// fooadgram-app/components/FeedList.tsx
// -----------------------------------------------------------------------------
// Smart list component that fetches the personalised feed and shows cards.
// Expects the whole `userData` object (exactly what Create‑Post passes to
// ContentService) so it can attach the bearer token internally.
// -----------------------------------------------------------------------------

import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View
} from 'react-native';

import FeedItemCard from './FeedItemCard';
import { fetchFeed, Post } from '../services/feed';
import { UserData } from '@/models/user/UserData';

interface Props {
    user: UserData | null;   // null when not logged‑in yet
}

const FeedList: React.FC<Props> = ({ user }) => {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        console.log('[FeedList] load(): user =', user?.username ?? null);
        if (!user) {
            setError('You need to log in first');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFeed(user);
            console.log('[FeedList] fetched', data.length, 'posts');
            setPosts(data);
        } catch (e: any) {
            console.log('[FeedList] error while fetching:', e);
            setError(e.message ?? 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        load();
    }, [load]);

    // Pull‑to‑refresh
    const onRefresh = useCallback(async () => {
        if (!user) return;
        setRefreshing(true);
        try {
            setPosts(await fetchFeed(user));
        } catch (_) {/* ignore */}
        finally { setRefreshing(false); }
    }, [user]);

    // ─────────── render branches ───────────

    if (!user) {
        return (
            <View className="flex-1 items-center justify-center px-6">
                <Text className="text-base text-gray-600 dark:text-gray-300 text-center">
                    Please log in to see your personalised feed.
                </Text>
            </View>
        );
    }

    if (loading && posts === null) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center px-6">
                <Text className="text-red-600 dark:text-red-400 mb-4 text-center">
                    {error}
                </Text>
                <Text className="text-blue-600 dark:text-blue-400" onPress={load}>
                    Tap to retry
                </Text>
            </View>
        );
    }

    if (posts?.length === 0) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500 dark:text-gray-300">
                    Nobody you follow has posted in the last 24 hours.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            style={{ flex: 1 }}
            data={posts ?? []}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <FeedItemCard post={item} />}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        />
    );
};

export default FeedList;
