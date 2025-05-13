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

    const getNavigationUrl = (notification: NotificationDto): [string, any] | null => {
        const targetUrl = notification.targetUrl;

        if (targetUrl) {
            const [page, id] = targetUrl.split('/');

            if (page === 'PostDetail') {
                return ['PostDetail', { postId: id }];
            } else if (page === 'Profile') {
                return ['Profile', { userId: id }];
            }
        }

        return null;
    };

    useEffect(() => {
        fetchNotifications();
    }, [userData]);

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Notifications</Text>

                {notifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No new notifications</Text>
                    </View>
                ) : (
                    notifications.map((notification) => (
                        <TouchableOpacity
                            key={notification.id}
                            style={[styles.postItem, {backgroundColor: notification.notificationStatus === 'SENT' ? '#F0F8FF' : "#FFFFFF"}]}
                            onPress={() => {
                                setNotifications((prevNotifications) =>
                                    prevNotifications.map((n) =>
                                        n.id === notification.id ? { ...n, notificationStatus: 'READ' } : n
                                    )
                                );

                                const navTarget = getNavigationUrl(notification);
                                if (navTarget) {
                                    navigation.navigate(navTarget[0], navTarget[1]);
                                }
                            }}
                        >
                            <Image
                                source={{ uri: GlobalConstants.s3Url + notification.mediaUrl }}
                                style={styles.postImage}
                                accessibilityLabel="Sender Image"
                            />

                            <View style={styles.postDetails}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.postUsername}>{notification.title}</Text>
                                    <Text style={styles.postContent} numberOfLines={2}>
                                        {notification.content}
                                    </Text>
                                </View>

                                <View style={{alignItems: 'flex-end'}}>
                                    <Text style={styles.postDate}>
                                        {formatPostDate(notification.createdDate)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
            <FGTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        backgroundColor: "#FDFDFD",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#2C3E50",
        marginVertical: 20,
        fontFamily: "Roboto-Bold",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    postItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        marginBottom: 8,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    postImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
        borderWidth: 1,
        borderColor: "#ECF0F1",
    },
    postDetails: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    postUsername: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2C3E50",
        marginBottom: 4,
        fontFamily: "Roboto-Medium",
    },
    postContent: {
        fontSize: 13,
        color: "#7F8C8D",
        lineHeight: 18,
        fontFamily: "Roboto-Regular",
    },
    postDate: {
        fontSize: 12,
        color: "#95A5A6",
        fontFamily: "Roboto-Regular",
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    /**
    unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#E74C3C",
        marginLeft: 10,
    },**/
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: "#95A5A6",
        fontFamily: "Roboto-Medium",
    }
});

export default NotificationsPage;
