import {ActivityIndicator, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View}
from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {ContentService} from "@/services/content-service";
import {PostResponseDto} from "@/models/content/dto/PostResponseDto";
import {AntDesign} from "@expo/vector-icons";
import PostCard from "@/components/PostCard";

const PAGE_SIZE = 10;
const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 4;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS;

const BookmarkedPage = () => {
    const navigation = useNavigation();
    const { userData } = useAppContext();

    const [posts, setPosts] = useState<PostResponseDto[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async (pageNum: number) => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            console.log(`Fetching saved posts: page ${pageNum}`);
            const response = await ContentService.getSavedPostsByUser(userData, pageNum, PAGE_SIZE);
            const newPosts = response?.content ?? [];

            if (newPosts.length < PAGE_SIZE) setHasMore(false);

            setPosts(prev => [...prev, ...newPosts]);
            setPage(pageNum + 1);
        } catch (error) {
            console.error("Failed to fetch saved posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPosts([]);
        setPage(0);
        setHasMore(true);
        fetchPosts(0);
    }, [userData?.id]);

    const renderItem = ({ item }: { item: PostResponseDto }) => (
        <View style={{ width: CARD_WIDTH, margin: CARD_MARGIN }}>
            <PostCard post={item} onPress={() => navigation.navigate('PostDetail', { postId: item.id })} />
        </View>
    );
    const onEndReached = () => {
        // Prevent onEndReached from triggering if still loading or no more pages
        if (!loading && hasMore) {
            fetchPosts(page);
        }
    };
    return (
        <View style={shared_styles.body_container}>
            <View style={[shared_styles.row, shared_styles.justify_between, { width: "100%", padding: 20 }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Saved Posts</Text>
                <Text style={styles.title}></Text>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}

                ListEmptyComponent={     !loading && posts.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
                        You haven't saved any posts yet.
                    </Text>
                ) : null}

                ListFooterComponent={
                    loading ? (
                        <View style={{ paddingVertical: 20 }}>
                            <ActivityIndicator size="large" color="#888" />
                        </View>
                    ) : null
                }

                contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}

            />

            <FGTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    backButton: {
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        width: "100%",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    registerText: {
        marginTop: 10,
    },
    link: {
        color: "blue",
    },

});

export default BookmarkedPage;
