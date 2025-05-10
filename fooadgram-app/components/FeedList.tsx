
import React, { useCallback, useEffect, useState } from 'react';
import { Video } from 'expo-av';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from 'react-native';

import FeedItemCard from './FeedItemCard';
import { fetchFeed, Post } from '../services/feed';
import { UserData } from '@/models/user/UserData';
import { useFocusEffect } from '@react-navigation/native';


interface Props {
    user: UserData | null;   // null when not logged‑in yet
}

const FeedList: React.FC<Props> = ({ user }) => {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [page, setPage] = useState(1);  // Track current page
    const [hasMore, setHasMore] = useState(true);  // Track if there are more posts to fetch

    const load = useCallback(async () => {
        if (!user|| loading) {
            setError('You need to log in first');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFeed(user, page);  // Fetch posts for the current page
            setPosts(prevPosts => (page === 1 ? data : [...(prevPosts ?? []), ...data])); // Append new posts to the list
            setHasMore(data.length > 0);  // Check if more posts are available
        } catch (e: any) {
            setError(e.message ?? 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [user, page]);

    // Automatically load posts when the component is focused
    useFocusEffect(
        React.useCallback(() => {
            load();
        }, [load])
    );

    useEffect(() => {
        load();  // Load posts on initial render
    }, [load]);

    const onRefresh = useCallback(async () => {
        if (!user) return;
        setRefreshing(true);
        try {
            setPosts(await fetchFeed(user, 1));  // Reset to page 1 on refresh
            setPage(1);  // Reset page number
        } catch (_) { } finally {
            setRefreshing(false);
        }
    }, [user]);

    // Handle the event when the user scrolls to the bottom
    const onEndReached = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);  // Increment the page number
        }
    };

    if (!user) return <View><Text>Please log in first.</Text></View>;
    if (loading && posts === null) return <ActivityIndicator />;
    if (error) return <Text>{error}</Text>;
    if (posts?.length === 0) return <Text>No recent posts.</Text>;

    return (
        <FlatList
            style={{ flex: 1 }}
            data={posts ?? []}
            keyExtractor={item => item.id}
            scrollEnabled={scrollEnabled}
            renderItem={({ item }) => (
                <FeedItemCard
                    post={item}
                    user={user}
                    setScrollEnabled={setScrollEnabled}
                />
            )}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            onEndReached={onEndReached}  // Trigger pagination when scrolled to the bottom
            onEndReachedThreshold={0.5}  // Load more when 50% from the end
            ListFooterComponent={
                loading ? (
                    <View style={{ paddingVertical: 10 }}>
                        <ActivityIndicator size="large" color="#888" />
                    </View>
                ) : !hasMore ? (
                    <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                        <Text>No more posts</Text>
                    </View>
                ) : null
            }
        />
    );
};



export default FeedList;
