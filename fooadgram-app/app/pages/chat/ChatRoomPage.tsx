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

    const [convId, setConvId]             = useState<string | null>(convIdParam);
    const [wsReady, setWsReady]           = useState(false);
    const [text,    setText]              = useState('');
    const [messages, setMessages]         = useState<ChatMessageDto[]>([]);
    const [reportingMessageId, setReportingMessageId] =
        useState<string | null>(null);

    const listRef = useRef<FlatList>(null);

    // append or update deleted flag
    const append = (m: ChatMessageDto) =>
        setMessages(prev =>
            m.deleted
                ? prev.map(x => x.id === m.id
                    ? { ...x, deleted: true, content: m.content }
                    : x
                )
                : prev.some(x => x.id === m.id)
                    ? prev
                    : [...prev, m]
        );

    // WebSocket hookup…
    useEffect(() => {
        if (!userData) return;
        chatSocket.connect(userData.token, () => {
            setWsReady(true)
        })
    }, [userData?.token])

    useEffect(() => {
        if (!wsReady) return;
        const personalSub = chatSocket.subscribeUserQueue(append)
        return () => {
            personalSub.unsubscribe()
        }
    }, [wsReady])

    useEffect(() => {
        if (!wsReady || !convId) return;
        const roomSub = chatSocket.subscribe(convId, append)
        return () => {
            roomSub.unsubscribe()
        }
    }, [wsReady, convId])

    // fetch history once
    const fetchedRef = useRef(false);
    useEffect(() => {
        if (!userData || !convId || fetchedRef.current) return;
        fetchedRef.current = true;
        ChatService.getHistory(userData, convId)
            .then(hist => setMessages(hist))
            .catch(e => console.warn('history', e));
    }, [userData, convId]);

    // send
    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || !wsReady) return;
        chatSocket.sendMessage({
            conversationId: convId,
            receiverId:     receiverId ?? '',
            content:        trimmed,
        });
        setText('');
    };

    // long-press handler:
    const onLongPress = (msg: ChatMessageDto) => {
        if (msg.senderId === userData?.id) {
            // ─── your delete flow ───
            Alert.alert(
                "Delete message?",
                "This will remove the message for everyone.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete", style: "destructive",
                        onPress: () =>
                            ChatService.deleteMessage(userData, msg.id!)
                                .then(() => {
                                    // optimistic UI update:
                                    setMessages(prev =>
                                        prev.map(m =>
                                            m.id === msg.id
                                                ? { ...m, deleted: true, content: "Message deleted" }
                                                : m
                                        )
                                    );
                                })
                                .catch(() => Alert.alert("Error", "Could not delete message"))
                    }
                ]
            );
        } else {
            // ─── report other-person’s message ───
            setReportingMessageId(msg.id!);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={TAB_BAR_HEIGHT}
            >
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={m => m.id!}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onLongPress={() => onLongPress(item)}
                        >
                            <View
                                style={[
                                    styles.bubble,
                                    item.senderId === userData?.id ? styles.mine : styles.theirs
                                ]}
                            >
                                <Text style={{ color: '#fff' }}>{item.content}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: INPUT_BAR_HEIGHT + TAB_BAR_HEIGHT
                    }}
                />

                <View style={[styles.bar, { marginBottom: TAB_BAR_HEIGHT }]}>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                        placeholder="Message..."
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !wsReady && { opacity: 0.4 }]}
                        onPress={handleSend}
                        disabled={!wsReady}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* ─── single controlled ReportModal ─── */}
            {reportingMessageId && (
                <ReportModal
                    reportType={ReportType.CHAT_MESSAGE}
                    reportedEntityId={reportingMessageId}
                    isVisible={true}
                    onClose={() => setReportingMessageId(null)}
                />
            )}

            <FGTabBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    bubble: {
        marginBottom: 10,
        padding:       10,
        borderRadius:  12,
        maxWidth:     '80%',
    },
    mine:   { alignSelf: 'flex-end', backgroundColor: '#3d5afe' },
    theirs: { alignSelf: 'flex-start', backgroundColor: '#455a64' },
    bar: {
        height:            INPUT_BAR_HEIGHT,
        flexDirection:    'row',
        alignItems:       'center',
        paddingHorizontal: 8,
        borderTopWidth:    0.5,
        borderColor:      '#ccc',
        backgroundColor:  '#fff',
    },
    input:  { flex: 1, padding: 8 },
    sendBtn: {
        backgroundColor:  '#3d5afe',
        paddingHorizontal:16,
        paddingVertical:  10,
        borderRadius:     8,
        marginLeft:       8,
    },
});
