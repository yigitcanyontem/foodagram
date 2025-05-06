import React, { useEffect, useRef, useState } from "react";
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
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useAppContext } from "@/context/AppContext";
import { chatSocket } from "@/services/chat-socket";
import { ChatMessageDto } from "@/models/Chat/ChatMessageDto";
import { ChatService } from "@/services/chat-service";
import FGTabBar from "@/app/shared/FGTabBar";

const INPUT_BAR_HEIGHT = 52;
const TAB_BAR_HEIGHT   = 60;

export default function ChatRoomPage() {
    /* ---------- route & context ---------- */
    const { convId: convIdParam, receiverId } =
        useRoute().params as { convId: string | null; receiverId?: string };

    const { userData } = useAppContext();

    /* ---------- local state ---------- */
    const [convId,   setConvId]   = useState<string | null>(convIdParam);
    const [wsReady,  setWsReady]  = useState(false);
    const [text,     setText]     = useState("");
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const listRef                = useRef<FlatList>(null);

    /* ---------- helpers ---------- */
    const append = (m: ChatMessageDto) =>
        setMessages((prev) =>
            prev.some(
                (x) =>
                    x.timestamp === m.timestamp &&
                    x.senderId  === m.senderId &&
                    x.content   === m.content
            ) ? prev : [...prev, m]    // dedupe
        );

    /* ---------- socket life‑cycle ---------- */
    useEffect(() => {
        if (!userData) return;

        chatSocket.connect(userData.token, () => {
            setWsReady(true);

            /* personal queue always first */
            const personalSub = chatSocket.subscribeUserQueue((m) => {
                /* first ever message → we learn the conversation id */
                if (!convId && m.conversationId) {
                    setConvId(m.conversationId);
                    chatSocket.subscribe(m.conversationId, append);
                }
                append(m);
            });

            /* room topic (if we already know it) */
            let roomSub: any = null;
            if (convId) roomSub = chatSocket.subscribe(convId, append);
            else if (receiverId) {
                /* kick‑start the conversation */
                chatSocket.sendMessage({
                    conversationId: null,
                    receiverId,
                    content: "👋",
                });
            }

            return () => {
                personalSub?.unsubscribe();
                roomSub?.unsubscribe();
            };
        });
    }, [userData?.token]);   // initialise **once** per login

    /* ---------- fetch history once convId is known ---------- */
    const fetchedRef = useRef(false);
    useEffect(() => {
        if (!userData || !convId || fetchedRef.current) return;
        fetchedRef.current = true;

        ChatService.getHistory(userData, convId)
            .then((hist) => setMessages(hist))      // already oldest‑→newest from API
            .catch((e) => console.warn("history", e));
    }, [userData, convId]);

    /* ---------- send ---------- */
    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || !wsReady) return;

        chatSocket.sendMessage({
            conversationId: convId,        // may be null the very first time
            receiverId:    receiverId ?? "",
            content:       trimmed,
        });

        setText("");                     // we do *not* append optimistically anymore
    };

    /* always scroll to bottom */
    useEffect(() => {
        listRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    /* ---------- render ---------- */
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={TAB_BAR_HEIGHT}
            >
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.bubble,
                                item.senderId === userData?.id ? styles.mine : styles.theirs,
                            ]}
                        >
                            <Text style={{ color: "#fff" }}>{item.content}</Text>
                        </View>
                    )}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: INPUT_BAR_HEIGHT + TAB_BAR_HEIGHT,
                    }}
                />

                {/* input bar */}
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
                        <Text style={{ color: "#fff", fontWeight: "600" }}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            <FGTabBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    bubble: {
        marginBottom: 10,
        padding:       10,
        borderRadius:  12,
        maxWidth:     "80%",
    },
    mine:   { alignSelf: "flex-end", backgroundColor: "#3d5afe" },
    theirs: { alignSelf: "flex-start", backgroundColor: "#455a64" },
    bar: {
        height:          INPUT_BAR_HEIGHT,
        flexDirection:  "row",
        alignItems:     "center",
        paddingHorizontal: 8,
        borderTopWidth:    0.5,
        borderColor:   "#ccc",
        backgroundColor: "#fff",
    },
    input:  { flex: 1, padding: 8 },
    sendBtn: {
        backgroundColor: "#3d5afe",
        paddingHorizontal: 16,
        paddingVertical:   10,
        borderRadius:      8,
        marginLeft:        8,
    },
});
