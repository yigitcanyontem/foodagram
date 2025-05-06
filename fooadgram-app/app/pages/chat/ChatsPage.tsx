import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
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

    const loadData = async () => {
        if (!userData) return;

        const list = await ChatService.getMyConversations(userData).catch(() => []);
        setConversations(list);

        if (list.length === 0) {
            const f = await ChatService.getStartableChats(userData).catch(() => []);
            setFollowing(f);
        }
    };

    useEffect(() => {
        loadData();
    }, [userData]);

    /* ---------- render helpers ---------- */

    const renderConversation = (c: ConversationDto) => (
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

    const renderFollowingRow = (p: UsersProfileDto) => (
        <TouchableOpacity
            key={p.userId}
            style={styles.row}
            onPress={() =>
                navigation.navigate("ChatRoom", {
                    convId: null,
                    receiverId: p.userId,             // ← ★ here
                    receiverName: p.name ?? p.username,
                    receiverAvatar: p.profilePicture,
                })
            }>
            <Image source={{ uri: GlobalConstants.s3Url + p.profilePicture }}
                   style={styles.avatar}/>
            <Text style={styles.name}>{p.name ?? p.username}</Text>
        </TouchableOpacity>
    );

    /* ---------- JSX ---------- */

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Messages</Text>

                {conversations.length > 0
                    ? conversations.map(renderConversation)
                    : following.map(renderFollowingRow)}
            </ScrollView>

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
});

export default ChatsPage;
