import React from 'react';
import { Image, Text, View, StyleSheet, Dimensions, FlatList } from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import { Video } from 'expo-av';
import { Post } from '../services/feed';
import { GlobalConstants } from '@/utils/GlobalConstants';

interface Props {
    post: Post;
    setScrollEnabled: (v: boolean) => void;
}

const MEDIA_HOST = GlobalConstants.s3Url;      // …/api/v1/content-media/

function makeUrl(p: string) {
    return p.startsWith('http') ? p : `${MEDIA_HOST}${p}`;
}

const { width } = Dimensions.get('window');

const FeedItemCard: React.FC<Props> = ({ post, setScrollEnabled }) => {
    const [cardWidth, setCardWidth] = React.useState<number | null>(null);

    const renderMedia = ({ item }: { item: string }) => {
        const uri = makeUrl(item);
        const isVideo = uri.toLowerCase().endsWith('.mp4') || uri.includes('video');
        return isVideo ? (
            <Video
                source={{ uri }}
                style={{ width: '100%', height: '100%' }}
                useNativeControls
                resizeMode="contain"
                shouldPlay={false}
                isMuted={false}
            />
        ) : (
            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
        );
    };

    return (
        <View style={styles.card} onLayout={e => setCardWidth(e.nativeEvent.layout.width)}>
            {!!post.username && (
                <>
                    <Text style={styles.username}>{post.username}</Text>
                    <Text style={styles.timestamp}>
                        {new Date(post.createdAt).toLocaleString()}
                    </Text>
                </>
            )}

            <Text style={styles.content}>{post.content || '(no description)'}</Text>

            {cardWidth && post.mediaUrls?.length ? (
                <View style={styles.carouselContainer}>
                    <Carousel
                        data={post.mediaUrls}
                        renderItem={renderMedia}
                        containerWidth={cardWidth - 32}
                        itemWidth={cardWidth - 32}
                        separatorWidth={0}
                        onScrollBeginDrag={() => setScrollEnabled(false)}
                        onScrollEndDrag={() => setScrollEnabled(true)}
                        onMomentumScrollEnd={() => setScrollEnabled(true)}
                        inScrollView={false}
                        style={styles.carousel}
                    />
                </View>
            ) : null}

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
        backgroundColor: '#fff',
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

    /* carousel & media */
    carouselContainer: {
        width: '100%',
        aspectRatio: 4 / 5, // Instagram style (optional, clearer way)
        overflow: 'hidden',
    },

    carousel: {
        width: '100%',
        height: '100%',
    },
    media: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },

    footer: { flexDirection: 'row', marginTop: 12 },
    footerText: { marginRight: 24, color: '#444' },
});

export default FeedItemCard;
