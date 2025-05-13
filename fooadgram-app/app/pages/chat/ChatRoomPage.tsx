// ChatRoomPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Alert,
    Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppContext } from '@/context/AppContext';
import { chatSocket } from '@/services/chat-socket';
import { ChatMessageDto } from '@/models/Chat/ChatMessageDto';
import { ChatService } from '@/services/chat-service';
import FGTabBar from '@/app/shared/FGTabBar';
import ReportModal from '@/app/shared/content/ReportModalForChat';
import { ReportType } from '@/models/content/dto/ReportType';
import { formatMessageTime } from '@/utils/dayjsConfig';
import { GlobalConstants } from '@/utils/GlobalConstants';
import { Ionicons } from '@expo/vector-icons';
import shared_styles from '@/shared_styles';

const INPUT_BAR_HEIGHT = 52;
const TAB_BAR_HEIGHT = 52;

// ─── utilities ────────────────────────────────────────────────────────────────
const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

const isYesterday = (d: Date) => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return isSameDay(d, y);
};

const getDateHeader = (d: Date) => {
    if (isSameDay(d, new Date())) return 'Today';
    if (isYesterday(d)) return 'Yesterday';
    return d.toLocaleDateString();
};

interface MessageWithHeader extends ChatMessageDto {
    dateHeader: string | null;
}

// ─── component ────────────────────────────────────────────────────────────────
export default function ChatRoomPage() {
    const {
        convId: convIdParam,
        receiverId,
        receiverName,
        receiverAvatar,
    } = useRoute().params as {
        convId: string | null;
        receiverId?: string;
        receiverName?: string;
        receiverAvatar?: string;
    };
    const navigation = useNavigation();
    const { userData } = useAppContext();

    const [convId] = useState<string | null>(convIdParam);
    const [wsReady, setWsReady] = useState(false);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState<MessageWithHeader[]>([]);
    const [reportingId, setReportingId] = useState<string | null>(null);

    // pagination
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const listRef = useRef<FlatList>(null);

    // ─── helpers ────────────────────────────────────────────────────────────────
    const withDateHeaders = (list: ChatMessageDto[]): MessageWithHeader[] =>
        list.map((m, i, arr) => {
            const showHeader =
                i === 0 ||
                !isSameDay(new Date(m.timestamp), new Date(arr[i - 1].timestamp));
            return { ...m, dateHeader: showHeader ? getDateHeader(new Date(m.timestamp)) : null };
        });

    const append = (m: ChatMessageDto, isLocal = false) => {
        setMessages(prev => {
            // replace temp message
            const idx = prev.findIndex(p => p.id.startsWith('temp-') && p.content === m.content);
            if (idx !== -1) {
                const replaced = prev.map((p, i) => (i === idx ? m : p));
                return withDateHeaders(replaced);
            }

            // update existing
            if (prev.some(p => p.id === m.id)) {
                const updated = prev.map(p => (p.id === m.id ? { ...p, ...m } : p));
                return withDateHeaders(updated);
            }

            const merged = [...prev, m];
            return withDateHeaders(merged);
        });

        // auto-scroll after you send
        if (isLocal && listRef.current) {
            setTimeout(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }), 50);
        }
    };

    // ─── websocket wiring ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!userData) return;
        chatSocket.connect(userData.token, () => setWsReady(true));
    }, [userData?.token]);

    useEffect(() => {
        if (!wsReady) return;
        const sub = chatSocket.subscribeUserQueue(m => {
            if (m.conversationId === convId && !m.id.startsWith('temp-')) append(m);
        });
        return () => sub.unsubscribe();
    }, [wsReady, convId]);

    useEffect(() => {
        if (!wsReady || !convId) return;
        const sub = chatSocket.subscribe(convId, m => {
            if (!m.id.startsWith('temp-')) append(m);
        });
        return () => sub.unsubscribe();
    }, [wsReady, convId]);

    // ─── history ────────────────────────────────────────────────────────────────
    const fetchMessages = async (loadMore = false) => {
        if (!userData || !convId || (loading && loadMore)) return;
        setLoading(true);
        try {
            const nextPage = loadMore ? page + 1 : 0;
            const hist = await ChatService.getHistory(userData, convId, nextPage, 20);

            if (hist.length) {
                setMessages(prev => {
                    const merged = loadMore ? [...hist.reverse(), ...prev] : [...prev, ...hist.reverse()];
                    const uniq = Array.from(new Map(merged.map(m => [m.id, m])).values()).sort(
                        (a, b) => +new Date(a.timestamp) - +new Date(b.timestamp),
                    );
                    return withDateHeaders(uniq);
                });
                setPage(nextPage);
                setHasMore(hist.length === 20);
            } else {
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    };

    // initial + pagination
    useEffect(() => void fetchMessages(), [userData, convId]);
    const handleLoadMore = () => hasMore && !loading && fetchMessages(true);

    // ─── send ───────────────────────────────────────────────────────────────────
    const handleSend = () => {
        const body = text.trim();
        if (!body || !wsReady) return;

        const temp: ChatMessageDto = {
            id: `temp-${Date.now()}`,
            content: body,
            senderId: userData!.id,
            timestamp: new Date().toISOString(),
            deleted: false,
        };
        append(temp, true);
        setText('');

        chatSocket.sendMessage({
            conversationId: convId,
            receiverId: receiverId ?? '',
            content: body,
        });
    };

    // ─── long-press delete / report ─────────────────────────────────────────────
    const onLongPress = (msg: ChatMessageDto) => {
        if (msg.senderId === userData?.id) {
            Alert.alert('Delete message?', 'This removes it for everyone.', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () =>
                        ChatService.deleteMessage(userData!, msg.id!).catch(() =>
                            Alert.alert('Error', 'Could not delete'),
                        ),
                },
            ]);
        } else {
            setReportingId(msg.id!);
        }
    };

    // ─── render ────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.safe}>
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile', { userId: receiverId })}
                    style={[shared_styles.row, { alignItems: 'center' }]}
                >
                    {receiverAvatar && (
                        <Image
                            source={{ uri: GlobalConstants.s3Url + receiverAvatar }}
                            style={styles.avatar}
                        />
                    )}
                    <Text numberOfLines={1} style={styles.headerName}>
                        {receiverName || 'Chat'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* list + input */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={TAB_BAR_HEIGHT}
            >
                <FlatList
                    ref={listRef}
                    data={[...messages].reverse()}
                    keyExtractor={m => m.id}
                    renderItem={({ item }) => (
                        <View>
                            {item.dateHeader && (
                                <View style={styles.dateWrap}>
                                    <Text style={styles.dateText}>{item.dateHeader}</Text>
                                </View>
                            )}
                            <TouchableOpacity activeOpacity={0.8} onLongPress={() => onLongPress(item)}>
                                <View
                                    style={[
                                        styles.bubble,
                                        item.senderId === userData?.id ? styles.mine : styles.theirs,
                                    ]}
                                >
                                    <Text style={styles.msgText}>
                                        {item.deleted ? 'Message deleted' : item.content}
                                    </Text>
                                    <Text style={styles.timeText}>{formatMessageTime(item.timestamp)}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    inverted
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={loading ? <Text>Loading…</Text> : null}
                    contentContainerStyle={{ padding: 16, paddingBottom: INPUT_BAR_HEIGHT + TAB_BAR_HEIGHT }}
                />

                <View style={[styles.inputBar, { marginBottom: TAB_BAR_HEIGHT }]}>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                        placeholder="Message…"
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!wsReady}>
                        <Text style={styles.sendTxt}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* report modal */}
            {reportingId && (
                <ReportModal
                    reportType={ReportType.CHAT_MESSAGE}
                    reportedEntityId={reportingId}
                    isVisible
                    onClose={() => setReportingId(null)}
                />
            )}

            <FGTabBar />
        </SafeAreaView>
    );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },

    /* header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: { marginRight: 12 },
    avatar: { width: 40, height: 40, borderRadius: 27, marginRight: 14 },
    headerName: { fontWeight: '600', fontSize: 15, maxWidth: '70%' },

    /* message bubble */
    bubble: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 12,
        maxWidth: '80%',
    },
    mine: { alignSelf: 'flex-end', backgroundColor: '#3d5afe' },
    theirs: { alignSelf: 'flex-start', backgroundColor: '#455a64' },
    msgText: { color: '#fff' },
    timeText: { color: '#E8E8E8', fontSize: 10, marginTop: 4 },

    /* date header */
    dateWrap: { alignItems: 'center', marginVertical: 10 },
    dateText: {
        color: '#666',
        fontSize: 12,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },

    /* input */
    inputBar: {
        height: INPUT_BAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderColor: '#ccc',
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    input: { flex: 1, padding: 8 },
    sendBtn: {
        borderColor: '#E8E8E8',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: '#E74C3C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    sendTxt: { color: '#3d5afe', fontWeight: '600', fontSize: 15 },
});
