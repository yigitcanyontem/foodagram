import React, {useEffect, useRef, useState} from 'react';
import {
    View, FlatList, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, Alert,
    Image
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useAppContext} from '@/context/AppContext';
import {chatSocket} from '@/services/chat-socket';
import {ChatMessageDto} from '@/models/Chat/ChatMessageDto';
import {ChatService} from '@/services/chat-service';
import FGTabBar from '@/app/shared/FGTabBar';
import ReportModal from '@/app/shared/content/ReportModalForChat';
import {ReportType} from '@/models/content/dto/ReportType';
import {formatPostDate} from "@/utils/dayjsConfig";
import {GlobalConstants} from "@/utils/GlobalConstants";
import { Ionicons } from '@expo/vector-icons';
import shared_styles from "@/shared_styles";

const INPUT_BAR_HEIGHT = 52;
const TAB_BAR_HEIGHT = 52;

// Date utility functions
const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};

const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(date, yesterday);
};

const getDateHeader = (date: Date): string => {
    if (isSameDay(date, new Date())) {
        return 'Today';
    } else if (isYesterday(date)) {
        return 'Yesterday';
    }
    return date.toLocaleDateString();
};

interface MessageWithDateHeader extends ChatMessageDto {
    dateHeader: string | null;
}

export default function ChatRoomPage() {
    const {convId: convIdParam, receiverId, receiverName, receiverAvatar} =
        useRoute().params as {
            convId: string | null;
            receiverId?: string;
            receiverName?: string;
            receiverAvatar?: string;
        };
    const navigation = useNavigation();
    const {userData} = useAppContext();

    const [convId, setConvId] = useState<string | null>(convIdParam);
    const [wsReady, setWsReady] = useState(false);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState<MessageWithDateHeader[]>([]);
    const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);

    const listRef = useRef<FlatList>(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Function to process messages and add date headers
    const processMessagesWithDateHeaders = (newMessages: ChatMessageDto[]): MessageWithDateHeader[] => {
        return newMessages.map((msg, index) => {
            const currentDate = new Date(msg.timestamp);
            const prevMessage = newMessages[index - 1];

            let dateHeader: string | null = null;
            // Show date header if this is the first message or if the previous message is from a different day
            if (index === 0 || !prevMessage || !isSameDay(currentDate, new Date(prevMessage.timestamp))) {
                dateHeader = getDateHeader(currentDate);
            }

            return {
                ...msg,
                dateHeader
            };
        });
    };

    // Append or update messages
    const append = (m: ChatMessageDto, isNewMessage = false) => {
        setMessages((prev) => {
            // Check if a temporary message with same content exists
            const tempMessageIndex = prev.findIndex(
                (x) => x.id.startsWith("temp-") && x.content === m.content
            );

            if (tempMessageIndex !== -1) {
                // Replace temp message with real one
                const updatedMessages = prev.map((x, index) =>
                    index === tempMessageIndex ? m : x
                );
                return processMessagesWithDateHeaders(updatedMessages);
            }

            // Regular append or update
            const existing = prev.find((x) => x.id === m.id);
            if (existing) {
                const updatedMessages = prev.map((x) => (x.id === m.id ? {...x, ...m} : x));
                return processMessagesWithDateHeaders(updatedMessages);
            } else {
                const newMessages = isNewMessage ? [...prev, m] : [...prev, m];
                return processMessagesWithDateHeaders(newMessages);
            }
        });

        // Scroll to bottom for new locally sent messages
        if (isNewMessage && listRef.current) {
            setTimeout(() => listRef.current?.scrollToOffset({offset: 0, animated: true}), 50);
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

                    const sortedMessages = uniqueMessages.sort(
                        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    );

                    return processMessagesWithDateHeaders(sortedMessages);
                });
                setPage(newPage);
                setHasMore(hist.length === 20);
            } else {
                setHasMore(false);
            }

            // Scroll to bottom after messages are loaded
            if (listRef.current && !isLoadMore && page==0) {
                setTimeout(() => {
                    listRef.current?.scrollToOffset({ offset: 0, animated: false });
                }, 100);
            }
        } catch (e) {
            console.warn("history", e);
        } finally {
            setLoading(false);
        }
    };

    // Add an effect to scroll to bottom when messages change
    /*useEffect(() => {
        if (messages.length > 0 && listRef.current) {
            setTimeout(() => {
                listRef.current?.scrollToOffset({ offset: 0, animated: false });
            }, 100);
        }
    }, [messages.length]); */

    useEffect(() => {
        fetchMessages();
    }, [userData, convId]);

    // Load more on scroll to top
    const handleLoadMore = () => {
        if (hasMore && !loading) {
            fetchMessages(true);
        }
    };
    const canSend = text.trim().length > 0 && wsReady;

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

    // long-press handler:
    const onLongPress = (msg: ChatMessageDto) => {
        if (msg.senderId === userData?.id) {
            // ─── your delete flow ───
            Alert.alert(
                "Delete message?",
                "This will remove the message for everyone.",
                [
                    {text: "Cancel", style: "cancel"},
                    {
                        text: "Delete", style: "destructive",
                        onPress: () =>
                            ChatService.deleteMessage(userData, msg.id!)
                                .then(() => {
                                    // optimistic UI update:
                                    setMessages(prev =>
                                        prev.map(m =>
                                            m.id === msg.id
                                                ? {...m, deleted: true, content: "Message deleted"}
                                                : m
                                        )
                                    );
                                })
                                .catch(() => Alert.alert("Error", "Could not delete message"))
                    }
                ]
            );
        } else {
            // ─── report other-person's message ───
            setReportingMessageId(msg.id!);
        }
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('Profile', { userId: receiverId })
                    }
                    style={[shared_styles.row, {alignItems: 'center'}]}>
                    {receiverAvatar && (
                        <Image
                            source={{ uri: GlobalConstants.s3Url + receiverAvatar }}
                            style={styles.headerAvatar}
                        />
                    )}
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerName}>{receiverName || 'Chat'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={TAB_BAR_HEIGHT}
            >
                <FlatList
                    ref={listRef}
                    data={[...messages].reverse()} // Reverse messages for inverted list
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({item}) => (
                        <View>
                            {item.dateHeader && (
                                <View style={styles.dateContainer}>
                                    <Text style={styles.dateText}>
                                        {item.dateHeader}
                                    </Text>
                                </View>
                            )}
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
                                    <Text style={{color: '#fff'}}>
                                        {item.deleted ? "Message deleted" : item.content}
                                    </Text>
                                    <Text style={{color: '#E8E8E8', fontSize: 10}}>
                                        {item.timestamp.slice(11, 16)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    inverted // This makes the list start at the bottom
                    onEndReached={handleLoadMore} // Will load more when reaching the top (since it's inverted)
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={loading ? <Text>Loading...</Text> : null}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: INPUT_BAR_HEIGHT + TAB_BAR_HEIGHT}}
                />

                <View style={[styles.bar, {marginBottom: TAB_BAR_HEIGHT}]}>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                        placeholder="Message..."
                    />

                    <TouchableOpacity
                        style={[
                            styles.buttonBase,
                            canSend ? styles.buttonEnabled : styles.buttonDisabled,
                        ]}
                        disabled={!canSend}
                        onPress={handleSend}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                { color: canSend ? '#fff' : '#666' },
                            ]}
                        >
                            Send
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* ─── single controlled ReportModal ─── */
            }
            {
                reportingMessageId && (
                    <ReportModal
                        reportType={ReportType.CHAT_MESSAGE}
                        reportedEntityId={reportingMessageId}
                        isVisible={true}
                        onClose={() => setReportingMessageId(null)}
                    />
                )
            }

            <FGTabBar/>
        </SafeAreaView>
    )
        ;
}

const styles = StyleSheet.create({
    bubble: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 12,
        maxWidth: '80%',
    },
    mine: {alignSelf: 'flex-end', backgroundColor: '#3d5afe'},
    theirs: {alignSelf: 'flex-start', backgroundColor: '#455a64'},
    bar: {
        height: INPUT_BAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderTopWidth: 0.5,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    input: {flex: 1, padding: 8},
    sendBtn: {
        backgroundColor: '#3d5afe',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginLeft: 8,
    },
    dateContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    dateText: {
        color: '#666',
        fontSize: 12,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 12,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 27,
        marginRight: 14,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerName: {
        fontWeight: '600',
        fontSize: 15,
        maxWidth: '70%',
    },
    button: {
        borderColor: '#E8E8E8',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#E74C3C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: "#3d5afe",
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "Roboto-Bold",
    },
    buttonBase: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    buttonEnabled: {
        backgroundColor: '#3d5afe',   // your blue
    },
    buttonDisabled: {
        backgroundColor: '#E0E0E0',   // light-grey fallback
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});