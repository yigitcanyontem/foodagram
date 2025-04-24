// fooadgram-app/components/FeedItemCard.tsx
import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { Post } from '../services/feed';
import { GlobalConstants } from '@/utils/GlobalConstants';

interface Props {
    post: Post;
}

// --- CONFIG ---
// Gateway / CDN base used to turn relative media paths into absolute URLs.
// Change this single value when you switch environments.
const MEDIA_HOST = GlobalConstants.s3Url;
// ---------------

function makeUrl(path: string): string {
    // is the URL already absolute?
    return path.startsWith('http://') || path.startsWith('https://')
        ? path
        : `${MEDIA_HOST}${path}`;                          // MEDIA_HOST already ends with '/'
}

const FeedItemCard: React.FC<Props> = ({ post }) => {
    console.log('[FeedItemCard] post =', post);
    const firstImage = post.mediaUrls?.length ? makeUrl(post.mediaUrls[0]) : null;
    console.log(firstImage)

    return (
        <View style={styles.card}>
            {/* Header */}
            {post.username && (
                <>
                    <Text style={styles.username}>{post.username}</Text>
                    <Text style={styles.timestamp}>
                        {new Date(post.createdAt).toLocaleString()}
                    </Text>
                </>
            )}

            {/* Body */}
            <Text style={styles.content}>
                {post.content || '(no description)'}
            </Text>

            {/* Media */}
            {firstImage && (
                <Image source={{ uri: firstImage }} style={styles.image} />
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>❤️ {post.likes ?? 0}</Text>
                <Text style={styles.footerText}>💬 {post.comments ?? 0}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    username: { fontSize: 18, fontWeight: '600', color: '#000' },
    timestamp: { fontSize: 12, color: '#666', marginTop: 2 },
    content: { marginTop: 8, fontSize: 14, color: '#000' },
    image: {
        width: '100%',
        height: 240,
        resizeMode: 'cover',
        borderRadius: 12,
        marginTop: 10,
    },
    footer: { flexDirection: 'row', marginTop: 12 },
    footerText: { marginRight: 24, color: '#444' },
});

export default FeedItemCard;
