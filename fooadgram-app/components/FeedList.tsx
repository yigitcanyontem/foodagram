
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

interface Props {
    user: UserData | null;   // null when not logged‑in yet
}

const FeedList: React.FC<Props> = ({ user }) => {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const load = useCallback(async () => {
        if (!user) {
            setError('You need to log in first');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFeed(user);
            setPosts(data);
        } catch (e: any) {
            setError(e.message ?? 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { load(); }, [load]);

    const onRefresh = useCallback(async () => {
        if (!user) return;
        setRefreshing(true);
        try { setPosts(await fetchFeed(user)); }
        catch (_) { } finally { setRefreshing(false); }
    }, [user]);

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
                <FeedItemCard post={item} user={user!} setScrollEnabled={setScrollEnabled}/>
            )}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
    );
};


export default FeedList;
