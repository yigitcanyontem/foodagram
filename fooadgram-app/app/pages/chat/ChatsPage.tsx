import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image, FlatList, ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "@/context/AppContext";
import { ChatService } from "@/services/chat-service";
import { formatPostDate } from "@/utils/dayjsConfig";
import { GlobalConstants } from "@/utils/GlobalConstants";
import FGTabBar from "@/app/shared/FGTabBar";
import { ConversationDto } from "@/models/Chat/ConversationDto";
import { UsersProfileDto } from "@/models/user/UsersProfileDto";

const ChatsPage = () => {
    const { userData } = useAppContext();
    const navigation = useNavigation();
    const [conversations, setConversations] = useState<ConversationDto[]>([]);
    const [following, setFollowing] = useState<UsersProfileDto[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Load data with pagination
    const loadData = async (pageNumber = 0) => {
        if (!userData || loading) return;
        setLoading(true);

        try {
            const list = await ChatService.getMyConversations(userData, pageNumber).catch(() => []);

            // Group by user, keeping the most recent message only
            const uniqueConversations = Object.values(
                list.reduce((acc, conv) => {
                    acc[conv.otherUserId] = conv;
                    return acc;
                }, {} as Record<string, ConversationDto>)
            );

            if (pageNumber === 0) setConversations(uniqueConversations);
            else setConversations((prev) => {
                const combined = [...prev, ...uniqueConversations];
                const unique = Object.values(
                    combined.reduce((acc, conv) => {
                        acc[conv.otherUserId] = conv;
                        return acc;
                    }, {} as Record<string, ConversationDto>)
                );
                return unique;
            });

            setHasMore(list.length > 0);

            // Load following if no conversations found
            if (list.length === 0 && pageNumber === 0) {
                const f = await ChatService.getStartableChats(userData).catch(() => []);
                setFollowing(f);
            }
        } catch (error) {
            console.warn("Error loading conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        if (!userData) return;
        loadData(0);
        if (following.length === 0) {
            ChatService.getStartableChats(userData).then(setFollowing);
        }
    }, [userData]);

    // Load more when reaching the end
    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadData(nextPage);
        }
    };;

    /* ---------- render helpers ---------- */
    const renderConversation = ({ item: c }: { item: ConversationDto }) => (
        <TouchableOpacity
            key={c.id}
            style={styles.row}
            onPress={() => navigation.navigate("ChatRoom", { convId: c.id })}
        >
            <Image
                source={{ uri: GlobalConstants.s3Url + c.otherUserAvatar }}
                style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>{c.otherUserName}</Text>
                    <Text style={styles.time}>{formatPostDate(c.lastMessageTime)}</Text>
                </View>
                <Text style={styles.snippet} numberOfLines={1}>
                    {c.lastMessageSnippet}
                </Text>
            </View>
            {c.unreadCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{c.unreadCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderFollowingRow = ({ item: p }: { item: UsersProfileDto }) => (
        <TouchableOpacity
            key={p.userId}
            style={styles.row}
            onPress={() =>
                navigation.navigate("ChatRoom", {
                    convId: null,
                    receiverId: p.userId,
                    receiverName: p.name ?? p.username,
                    receiverAvatar: p.profilePicture,
                })
            }
        >
            <Image
                source={{ uri: GlobalConstants.s3Url + p.profilePicture }}
                style={styles.avatar}
            />
            <Text style={styles.name}>{p.name ?? p.username}</Text>
        </TouchableOpacity>
    );

    /* ---------- JSX ---------- */
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Text style={styles.heading}>Messages</Text>
            <FlatList
                data={conversations.length > 0 ? conversations : (following as any[])}
                renderItem={(item) =>
                    conversations.length > 0
                        ? renderConversation(item as { item: ConversationDto })
                        : renderFollowingRow(item as { item: UsersProfileDto })
                }
                keyExtractor={(item) =>
                    item.otherUserId ?? item.userId ?? Math.random().toString()
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
                }
                ListEmptyComponent={<Text style={styles.noChats}>No conversations yet.</Text>}
            />

            <FGTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    heading: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
        gap: 14,
    },
    avatar: { width: 54, height: 54, borderRadius: 27 },
    nameRow: { flexDirection: "row", justifyContent: "space-between" },
    name: { fontWeight: "600", fontSize: 15, maxWidth: "70%" },
    time: { color: "#8E8E8E", fontSize: 12 },
    snippet: { color: "#555", marginTop: 4 },
    badge: {
        backgroundColor: "#FF3D00",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 6,
    },
    badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
    noChats: { textAlign: "center", marginVertical: 20, color: "#555" },
});

export default ChatsPage;

