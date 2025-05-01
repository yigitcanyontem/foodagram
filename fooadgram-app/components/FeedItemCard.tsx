    import React from 'react';
    import { Image, Text, View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
    import Carousel from 'react-native-anchor-carousel';
    import { Video } from 'expo-av';
    import { Post } from '../services/feed';
    import { GlobalConstants } from '@/utils/GlobalConstants';
    import { useNavigation } from '@react-navigation/native';

    import { AntDesign, FontAwesome } from '@expo/vector-icons';
    import { ContentService } from '@/services/content-service';
    import { UserData } from '@/models/user/UserData';
    import {formatPostDate} from "@/utils/dayjsConfig";
    import ReportModal from '@/app/shared/content/ReportModal';
    import { ReportType } from '@/models/content/dto/ReportType';

    interface Props {
        post: Post;
        user: UserData;
        setScrollEnabled: (v: boolean) => void;
    }

    const MEDIA_HOST = GlobalConstants.s3Url;      // …/api/v1/content-media/

    function makeUrl(p: string) {
        return p.startsWith('http') ? p : `${MEDIA_HOST}${p}`;
    }

    const { width } = Dimensions.get('window');

    const FeedItemCard: React.FC<Props> = ({ post, user, setScrollEnabled }) => {
        const [cardWidth, setCardWidth] = React.useState<number | null>(null);
        const [commentCount, setCommentCount] = React.useState<number>(post.comments ?? 0);

        const [liked, setLiked] = React.useState<boolean>(false);
        const [likeCount, setLikeCount] = React.useState<number>(post.likes ?? 0);

        const [saved, setSaved]           = React.useState<boolean>(false);
        const [saveCount, setSaveCount]   = React.useState<number>(post.saves ?? 0);

        const navigation = useNavigation();

        React.useEffect(() => {
            let mounted = true;
            ContentService.hasUserLikedPost(post.id, user)
                .then(res => mounted && setLiked(res))
                .catch(() => {/* ignore */});

            ContentService.hasUserSavedPost(post.id, user)
                .then(res => mounted && setSaved(res))
                .catch(() => {/* ignore */});
            return () => { mounted = false };
        }, [post.id, user]);

        const toggleLike = async () => {
            try {
                if (liked) {
                    await ContentService.unlikePost(post.id, user);
                    setLikeCount(c => c - 1);
                } else {
                    await ContentService.likePost(post.id, user);
                    setLikeCount(c => c + 1);
                }
                setLiked(!liked);
            } catch (_) { /* toast error if you like */ }
        };

        const toggleSave = async () => {
            try {
                if (saved) {
                    await ContentService.unsavePost(post.id, user);
                    setSaveCount(c => c - 1);
                } else {
                    await ContentService.savePost(post.id, user);
                    setSaveCount(c => c + 1);
                }
                setSaved(!saved);
            } catch (_) {/* toast error if you like */}
        };

        const renderMedia = ({ item }: { item: string }) => {
            if (!item) return null;
            const uri = makeUrl(item);
            const isVideo = uri.toLowerCase().endsWith('.mp4') || uri.toLowerCase().endsWith('.mov');

            return (
                <View key={uri} style={{ width: '100%', height: '100%' }}>
                    {isVideo ? (
                        <Video
                            source={{ uri }}
                            style={{ width: '100%', height: '100%', borderRadius: 12 }}
                            useNativeControls
                            resizeMode="cover"
                            shouldPlay={false}
                            isMuted
                            onError={(e) => {
                                const err = e?.nativeEvent?.error;
                                console.warn('Video error:', err || 'Unknown error');
                            }}
                        />
                    ) : (
                        <Image
                            source={{ uri }}
                            style={{ width: '100%', height: '100%', borderRadius: 12 }}
                            resizeMode="cover"
                        />
                    )}
                </View>
            );
        };


        return (
            <View style={styles.card} onLayout={e => setCardWidth(e.nativeEvent.layout.width)}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.username}>{post.username}</Text>
                        <Text style={styles.timestamp}>{formatPostDate(post.createdAt)}</Text>
                    </View>

                    {post.userId !== user?.id && (
                        <ReportModal
                            reportType={ReportType.POST}
                            reportedEntityId={post.id}
                        />
                    )}
                </View>

                <Text style={styles.content}>{post.content || '(no description)'}</Text>

                {cardWidth && post.mediaUrls?.length ? (
                    <View style={styles.carouselContainer}>
                        <Carousel
                            data={post.mediaUrls}
                            renderItem={renderMedia}
                            containerWidth={cardWidth - 32}
                            itemWidth={cardWidth - 32}
                            separatorWidth={8}
                            onScrollBeginDrag={() => setScrollEnabled(false)}
                            onScrollEndDrag={() => setScrollEnabled(true)}
                            onMomentumScrollEnd={() => setScrollEnabled(true)}
                            inScrollView={false}
                            style={styles.carousel}
                        />
                    </View>
                ) : null}

                <View style={styles.footer}>
                    {/* like button — already done earlier */}
                    <TouchableOpacity onPress={toggleLike} style={styles.footerButton}>
                        <AntDesign
                            name={liked ? 'heart' : 'hearto'}
                            size={20}
                            color={liked ? '#E21E25' : '#444'}
                        />
                        <Text style={styles.footerText}>{likeCount}</Text>
                    </TouchableOpacity>

                    {/* comment button */}
                    <TouchableOpacity
                        style={styles.footerButton}
                        onPress={() => navigation.navigate('Comments', { postId: post.id })}
                    >
                        <AntDesign name="message1" size={18} color="#444" />
                        <Text style={styles.footerText}>{commentCount}</Text>
                    </TouchableOpacity>

                    {/* save / bookmark */}
                    <TouchableOpacity onPress={toggleSave} style={styles.footerButton}>
                        <FontAwesome
                            name={saved ? 'bookmark' : 'bookmark-o'}
                            size={20}
                            color={saved ? '#007AFF' : '#444'}
                          />
                        <Text style={styles.footerText}>{saveCount}</Text>
                    </TouchableOpacity>
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

        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',   // top-align
            marginBottom: 8,
        },
        headerLeft: {
            flexShrink: 1,
        },

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
        footerText: { marginRight: 24, marginLeft: 6, color: '#444' },
        footerButton: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
    });

    export default FeedItemCard;
