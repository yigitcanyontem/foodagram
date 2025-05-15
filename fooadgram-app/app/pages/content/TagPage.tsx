
import React, {useCallback, useEffect, useState} from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppContext } from "@/context/AppContext";
import { ContentService } from "@/services/content-service";
import { PostResponseDto } from "@/models/content/dto/PostResponseDto";
import shared_styles from "@/shared_styles";
import { formatPostDate } from "@/utils/dayjsConfig";
import FGTabBar from "@/app/shared/FGTabBar";
import { GlobalConstants } from "@/utils/GlobalConstants";
import { Video } from 'expo-av';
import { FlatList } from 'react-native';
import {debounce} from "@react-navigation/native-stack/src/utils/debounce";


type TagPageParams = {
    tag: string;
};


const TagPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { tag } = route.params as TagPageParams;
    const { userData } = useAppContext();
    const [posts, setPosts] = useState<PostResponseDto[]>([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const fetchPostsByTag = async (pageToLoad = 0) => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const response = await ContentService.getPostsByTag(tag, userData, pageToLoad, size);

            const { content, totalPages } = response;

            // If it's the first page, reset the posts, otherwise append new ones
            if (pageToLoad === 0) {
                setPosts(content);
            } else {
                setPosts((prev) => [...prev, ...content]);
            }

            // Determine if more pages are available
            setHasMore(pageToLoad + 1 < totalPages);
            setPage(pageToLoad);
            setError(null); // Reset error state
        } catch (err) {
            console.error("Failed to fetch posts by tag", err);
            setError("Failed to load posts. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchPostsByTag(); // Fetch posts for the first time when the tag changes
    }, [tag]);

    const debouncedFetchNextPage = useCallback(debounce(() => {
        fetchPostsByTag(page + 1);
    }, 300), [page, hasMore, isLoading]);




    /*
const renderMedia = (mediaPath: string) => {
    const mediaUrl = GlobalConstants.s3Url + mediaPath;
    const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.includes('video');
    const [videoError, setVideoError] = useState(false);

    if (isVideo && !videoError) {
        return (
            <Video
                source={{ uri: mediaUrl }}
                style={styles.postImage}
                useNativeControls={false}
                resizeMode="cover"
                isMuted
                shouldPlay={false}
                onError={(e) => {
                    console.error("Video load failed:", e);
                    setVideoError(true);
                }}
            />
        );
    } else {
        const fallbackImage = mediaUrl.replace('.mp4', '.jpg');  //Need to update the backend to save frames
        return (
            <Image
                source={{ uri: fallbackImage }}
                style={styles.postImage}
                accessibilityLabel="Post Thumbnail"
            />
        );
    }
};
 */
    return (
        <View style={shared_styles.body_container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item: post }) => (
                    <TouchableOpacity
                        style={styles.postItem}
                        onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
                    >
                        {(() => {
                            const mediaUrl = `${GlobalConstants.s3Url}${post.mediaUrls[0]}`;
                            const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.includes('video');

                            return isVideo ? (
                                <Video
                                    source={{ uri: mediaUrl }}
                                    style={styles.postImage}
                                    useNativeControls={false}
                                    resizeMode="cover"
                                    isMuted
                                    shouldPlay={false}
                                    isLooping={true}
                                />
                            ) : (
                                <Image
                                    source={{ uri: mediaUrl }}
                                    style={styles.postImage}
                                    accessibilityLabel="Post Image"
                                />
                            );
                        })()}
                        <View style={styles.postDetails}>
                            <Text style={styles.postUsername}>{post.username || "Anonymous"}</Text>
                            <Text style={styles.postContent} numberOfLines={2}>
                                {post.content}
                            </Text>
                            <Text style={styles.postDate}>{formatPostDate(post.createdAt)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListHeaderComponent={
                    <>
                        <Text style={styles.title}>Posts tagged with #{tag}</Text>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                    </>
                }
                contentContainerStyle={styles.container}
                windowSize={5}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                // Infinite scroll handlers
                onEndReached={debouncedFetchNextPage}// Fetch next page on scroll
                onEndReachedThreshold={0.5}


                ListFooterComponent={isLoading && hasMore ? <Text>Loading more...</Text> : null}
            />
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
