// ChatRoomPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    View, FlatList, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppContext } from '@/context/AppContext';
import { chatSocket } from '@/services/chat-socket';
import { ChatMessageDto } from '@/models/Chat/ChatMessageDto';
import { ChatService } from '@/services/chat-service';
import FGTabBar from '@/app/shared/FGTabBar';
import ReportModal from '@/app/shared/content/ReportModalForChat';
import { ReportType } from '@/models/content/dto/ReportType';

    const INPUT_BAR_HEIGHT = 52;
    const TAB_BAR_HEIGHT = 60;





    export default function ChatRoomPage() {
        const { convId: convIdParam, receiverId } =
            useRoute().params as { convId: string | null; receiverId?: string };
        const { userData } = useAppContext();

        const [convId, setConvId] = useState<string | null>(convIdParam);
        const [wsReady, setWsReady] = useState(false);
        const [text, setText] = useState('');
        const [messages, setMessages] = useState<ChatMessageDto[]>([]);
        const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);

        const listRef = useRef<FlatList>(null);

        // Pagination state
        const [page, setPage] = useState(0);
        const [loading, setLoading] = useState(false);
        const [hasMore, setHasMore] = useState(true);

    // Append or update messages
        const append = (m: ChatMessageDto, isNewMessage = false) => {
            setMessages((prev) => {
                // Check if a temporary message with same content exists
                const tempMessageIndex = prev.findIndex(
                    (x) => x.id.startsWith("temp-") && x.content === m.content
                );

                if (tempMessageIndex !== -1) {
                    // Replace temp message with real one
                    return prev.map((x, index) =>
                        index === tempMessageIndex ? m : x
                    );
                }

                // Regular append or update
                const existing = prev.find((x) => x.id === m.id);
                if (existing) {
                    return prev.map((x) => (x.id === m.id ? { ...x, ...m } : x));
                } else {
                    return isNewMessage ? [...prev, m] : [...prev, m];
                }
            });

            // Scroll to bottom for new locally sent messages
            if (isNewMessage && listRef.current) {
                setTimeout(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }), 50);
            }
        };

        // WebSocket hookup
        useEffect(() => {
            if (!userData) return;
            chatSocket.connect(userData.token, () => setWsReady(true));
        }, [userData?.token]);

        useEffect(() => {
            if (!wsReady) return;
            const personalSub = chatSocket.subscribeUserQueue((m) => {
                if (m.conversationId === convId && !m.id.startsWith("temp-")) {
                    append(m, false);
                }
            });
            return () => {
                personalSub.unsubscribe();
            };
        }, [wsReady, convId]);

        useEffect(() => {
            if (!wsReady || !convId) return;
            const roomSub = chatSocket.subscribe(convId, (m) => {
                if (!m.id.startsWith("temp-")) {
                    append(m, false);
                }
            });
            return () => {
                roomSub.unsubscribe();
            };
        }, [wsReady, convId]);

    // Fetch history with pagination
        const fetchMessages = async (isLoadMore = false) => {
            if (!userData || !convId || (loading && isLoadMore)) return;

            setLoading(true);
            try {
                const newPage = isLoadMore ? page + 1 : 0;
                const hist = await ChatService.getHistory(userData, convId, newPage, 20);

                if (hist.length > 0) {
                    setMessages((prev) => {
                        const merged = isLoadMore
                            ? [...hist.reverse(), ...prev]
                            : [...prev, ...hist.reverse()];

                        const uniqueMessages = Array.from(
                            new Map(merged.map((m) => [m.id, m])).values()
                        );

                        return uniqueMessages.sort(
                            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                        );
                    });
                    setPage(newPage);
                    setHasMore(hist.length === 20);
                } else {
                    setHasMore(false);
                }

                // Always start at the bottom
                if (listRef.current) {
                    setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 50);
                }
            } catch (e) {
                console.warn("history", e);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchMessages();
        }, [userData, convId]);

        // Load more on scroll to top
        const handleLoadMore = () => {
            if (hasMore && !loading) {
                fetchMessages(true);
            }
        };

    // Send message function
        const handleSend = () => {
            const trimmed = text.trim();
            if (!trimmed || !wsReady) return;

            const newMessage: ChatMessageDto = {
                id: `temp-${Date.now()}`,
                content: trimmed,
                senderId: userData?.id!,
                timestamp: new Date().toISOString(),
                deleted: false,
            };

            append(newMessage, true); // Only add locally
            setText("");

            // Send via WebSocket
            chatSocket.sendMessage({
                conversationId: convId,
                receiverId: receiverId ?? "",
                content: trimmed,
            });
        };

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <FlatList
                    ref={listRef}
                    data={[...messages].reverse()} // Reverse messages for inverted list
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item }) => (
                        <View style={[styles.bubble, item.senderId === userData?.id ? styles.mine : styles.theirs]}>
                            <Text style={{ color: '#fff' }}>
                                {item.deleted ? "Message deleted" : item.content}
                            </Text>
                        </View>
                    )}
                    inverted // This makes the list start at the bottom
                    onEndReached={handleLoadMore} // Will load more when reaching the top (since it's inverted)
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={loading ? <Text>Loading...</Text> : null}
                    contentContainerStyle={{ paddingBottom: INPUT_BAR_HEIGHT + TAB_BAR_HEIGHT }}
                />

                <View style={[styles.bar, { marginBottom: TAB_BAR_HEIGHT }]}>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                        placeholder="Message..."
                    />
                    <TouchableOpacity onPress={handleSend} disabled={!wsReady}>
                        <Text style={{ color: '#3d5afe', fontWeight: '600' }}>Send</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }





const styles = StyleSheet.create({
    bubble: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 12,
        maxWidth: '80%',
    },
    mine:   { alignSelf: 'flex-end', backgroundColor: '#3d5afe' },
    theirs: { alignSelf: 'flex-start', backgroundColor: '#455a64' },
    bar: {
        height: INPUT_BAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderTopWidth: 0.5,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    input:  { flex: 1, padding: 8 },
    sendBtn: {
        backgroundColor: '#3d5afe',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginLeft: 8,
    },
});
