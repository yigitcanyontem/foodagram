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

type TagPageParams = {
    tag: string;
};

const TagPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { tag } = route.params as TagPageParams;
    const { userData } = useAppContext();
    const [posts, setPosts] = useState<PostResponseDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchPostsByTag = async () => {
        try {
            const postsResponse = await ContentService.getPostsByTag(tag, userData);
            setPosts(postsResponse);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch posts by tag", err);
            setError("Failed to load posts. Please try again.");
        }
    };

    useEffect(() => {
        fetchPostsByTag();
    }, [tag]);

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Posts tagged with #{tag}</Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
                {posts.map((post) => (
                    <TouchableOpacity
                        key={post.id}
                        style={styles.postItem}
                        onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
                    >
                        <Image
                            source={{ uri: GlobalConstants.s3Url + post.mediaUrls[0] }}
                            style={styles.postImage}
                            accessibilityLabel="Post Image"
                        />
                        <View style={styles.postDetails}>
                            <Text style={styles.postUsername}>{post.username}</Text>
                            <Text style={styles.postContent} numberOfLines={2}>
                                {post.content}
                            </Text>
                            <Text style={styles.postDate}>{formatPostDate(post.createdAt)}</Text>
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

export default TagPage;
