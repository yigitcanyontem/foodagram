import {StyleSheet, View, TextInput, Text, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {UserService} from "@/services/user-service";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import {useBase64Image} from "@/hooks/useBase64Image";
import UserResultCard from "@/app/shared/profile/UserResultCard";
import {PostResponseDto} from "@/models/content/dto/PostResponseDto";
import {ContentService} from "@/services/content-service";
import PostsSection from "@/app/shared/profile/PostsSection";
import PostCard from "@/components/PostCard";
import { Dimensions } from 'react-native';

const CARD_SIZE = (Dimensions.get('window').width - 32) / 3;
const PAGE_SIZE = 10;
const MAX_POSTS = 30;

const ExplorePage = () => {
    const navigation = useNavigation();
    const { userData } = useAppContext();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UsersProfileDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<PostResponseDto[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        try {
            if (query.trim() === '') {
                setResults([]);
                return;
            }
            const profiles = await UserService.searchUserProfiles(query);
            setResults(profiles);
            setError(null);
        } catch (err) {
            setResults([]);
            setError('Search failed');
        }
    };

    const fetchPosts = async (pageNum: number) => {
        if (loading) return;

        try {
            setLoading(true);
            const response = await ContentService.getRandomPublicPostsForExplore(userData, pageNum, PAGE_SIZE);
            const newPosts = response?.content ?? [];

            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
                    return [...prev, ...uniqueNewPosts];
                });
                setPage(pageNum + 1);
            }

            console.log(`Fetching explore posts for page ${pageNum}`);
        } catch (error) {
            console.error("Failed to fetch explore posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query === '') {
            setPosts([]);
            setPage(0);
            setHasMore(true);
            fetchPosts(0);
        }
    }, [userData?.id, query]);

    useEffect(() => {
        handleSearch();
    }, [query]);

    const renderPostItem = ({
                                item,
                            }: {
        item: PostResponseDto | null;
    }) => {
        if (item === null) {
            return (
                <View
                    style={{
                        width: CARD_SIZE,
                        height: CARD_SIZE,
                        marginBottom: 8,
                    }}
                />
            );
        }
        return (
            <PostCard
                post={item}
                onPress={() =>
                    navigation.navigate('PostDetail', { postId: item.id })
                }
            />
        );
    };

    const renderItem = () => (
        <View style={shared_styles.column}>
            <View style={[shared_styles.row, { paddingHorizontal: 20 }]}>
                <Text style={styles.section_title}>Posts</Text>
            </View>
            <PostsSection key={`explore_posts`} posts={posts} />
        </View>
    );

    const onEndReached = () => {
        if (!loading && hasMore && query === '') {
            fetchPosts(page);
        }
    };
    const getFilledPosts = () => {
        const count = posts.length;
        const remainder = count % 3;

        // perfectly even rows or no posts → just return them
        if (remainder === 0 || count === 0) {
            return posts;
        }

        // how many blanks we need to round up to a multiple of 3
        const needed = 3 - remainder;

        // create that many null placeholders
        const placeholders: (PostResponseDto | null)[] = Array(needed).fill(null);

        // append nulls to the end, so FlatList will render blanks
        return [...posts, ...placeholders];
    };
    const keyExtractor = (
        item: PostResponseDto | null,
        index: number
    ): string =>
        item
            ? `${item.id}-${index}`
            : `placeholder-${index}`;

    return (

        <View style={shared_styles.body_container}>
            <View style={[shared_styles.row, { padding: 20 }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Search users..."
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            {query === '' ? (
                <>

                    <View style={[shared_styles.row, shared_styles.justify_between, { width: "100%", paddingHorizontal: 20, paddingVertical: 10 }]}>
                        <Text style={styles.section_title}>Posts</Text>
                    </View>


                    <FlatList
                        data={getFilledPosts()}
                        keyExtractor={keyExtractor}
                        renderItem={renderPostItem}
                        numColumns={3}
                        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            loading ? (
                                <View style={{ paddingVertical: 20 }}>
                                    <ActivityIndicator size="large" color="#888" />
                                </View>
                            ) : !hasMore ? (
                                <Text style={{ color: '#888', fontSize: 12, textAlign: 'center', paddingVertical: 4 }}>No more posts</Text>
                            ) : null
                        }
                        contentContainerStyle={{ paddingBottom: loading ? 100 : 10 }}
                    />
                </>
            ) : (
                results.map((profile) => (
                    <UserResultCard key={profile.id} profile={profile} />
                ))
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <FGTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginBottom: 15,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    resultText: {
        fontSize: 16,
    },
    section_title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    }
});

export default ExplorePage;

