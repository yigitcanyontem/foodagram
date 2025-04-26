import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppContext } from "@/context/AppContext";
import { ContentService } from "@/services/content-service";
import { PostResponseDto } from "@/models/content/dto/PostResponseDto";
import shared_styles from "@/shared_styles";
import { formatPostDate } from "@/utils/dayjsConfig";
import FGTabBar from "@/app/shared/FGTabBar";
import {GlobalConstants} from "@/utils/GlobalConstants";
import {NotificationDto} from "@/models/notification/NotificationDto";
import {NotificationService} from "@/services/notification-service";

const NotificationsPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userData } = useAppContext();
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);

    const fetchNotifications = async () => {
        if (userData) {
            try {
                const response = await NotificationService.getMyNotifications(userData);
                setNotifications(response);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [userData]);

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Notifications</Text>
                {notifications.map((notification) => (
                    <TouchableOpacity
                        key={notification.id}
                        style={styles.postItem}
                        onPress={() => navigation.navigate(notification.targetUrl)}
                    >
                        <Image
                            source={{ uri: GlobalConstants.s3Url + notification.mediaUrl }}
                            style={styles.postImage}
                            accessibilityLabel="Sender Image"
                        />
                        <View style={styles.postDetails}>
                            <Text style={styles.postUsername}>{notification.title}</Text>
                            <Text style={styles.postContent} numberOfLines={2}>
                                {notification.content}
                            </Text>
                            <Text style={styles.postDate}>{formatPostDate(notification.createdDate)}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <FGTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    postItem: {
        flexDirection: "row",
        marginBottom: 15,
        backgroundColor: "#f8f8f8",
        borderRadius: 8,
        overflow: "hidden",
    },
    postImage: {
        width: 100,
        height: 100,
    },
    postDetails: {
        flex: 1,
        padding: 10,
    },
    postUsername: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    postContent: {
        marginBottom: 5,
    },
    postDate: {
        color: "gray",
        fontSize: 12,
    },
});

export default NotificationsPage;
