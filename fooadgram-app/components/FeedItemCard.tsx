import React, { useState, useEffect } from 'react';
import { Image, Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import ReportModal from '@/app/shared/content/ReportModal';
import { ReportType } from '@/models/content/dto/ReportType';
import { ContentService } from '@/services/content-service';
import { GlobalConstants } from '@/utils/GlobalConstants';
import { formatPostDate } from '@/utils/dayjsConfig';
import { Post } from '../services/feed';
import { UserData } from '@/models/user/UserData';
import {PostResponseDto} from "@/models/content/dto/PostResponseDto";

interface Props {
    post: Post;
    user: UserData;
    setScrollEnabled: (v: boolean) => void;
}

const { width } = Dimensions.get('window');
const MEDIA_HOST = GlobalConstants.s3Url;

function makeUrl(p: string) {
    return p.startsWith('http') ? p : `${MEDIA_HOST}${p}`;
}

const FeedItemCard: React.FC<Props> = ({ post, user, setScrollEnabled }) => {

    // like / save status
    const [liked, setLiked]                         = useState(false);
    const [saved, setSaved]                         = useState(false);
    const [savedInitialised, setSavedInitialised]   = useState(false);
    const [isSaving, setIsSaving]                 = useState(false);

    const [cardWidth, setCardWidth] = useState<number | null>(null);
    const navigation = useNavigation();
    const [localPost, setLocalPost] = useState<PostResponseDto>();

    // ─── 1) run once: fetch liked/saved flags ───────────────────────────────
    useEffect(() => {
        let mounted = true;
        ContentService.hasUserLikedPost(post.id, user)
            .then(res => mounted && setLiked(res))
            .catch(() => {});

        ContentService.hasUserSavedPost(post.id, user)
            .then(res => {
                if (mounted) {
                    setSaved(res);
                    setSavedInitialised(true);
                }
            })
            .catch(() => {});

        return () => { mounted = false };
    }, [post.id, user]);


    useEffect(() => {
        let mounted = true;
        ContentService.getPost(post.id, user)
            .then(p => mounted && setLocalPost(p))
            .catch(console.error);
        return () => { mounted = false };
    }, [post.id, user]);

    const toggleLike = async () => {
        if (!localPost) return;
        if (liked) {
            await ContentService.unlikePost(localPost.id, user);
            setLocalPost(lp => lp && { ...lp, likes: lp.likes - 1 });
        } else {
            await ContentService.likePost(localPost.id, user);
            setLocalPost(lp => lp && { ...lp, likes: lp.likes + 1 });
        }
        setLiked(!liked);
    };

    const toggleSave = async () => {
        // block if we’re already in flight or no data yet
        if (!localPost || isSaving) return;
        setIsSaving(true);
        try {
            if (saved) {
                await ContentService.unsavePost(localPost.id, user);
                setLocalPost(lp => lp && { ...lp, saves: lp.saves - 1 });
                setSaved(false);
            } else {
                await ContentService.savePost(localPost.id, user);
                setLocalPost(lp => lp && { ...lp, saves: lp.saves + 1 });
                setSaved(true);
            }
        } catch (e) {
            console.error("Failed to toggle save", e);
        } finally {
            setIsSaving(false);
        }
    };

    const renderMedia = ({ item }: { item: string }) => {
        const uri = makeUrl(item);
        const isVideo = uri.toLowerCase().endsWith('.mp4') || uri.toLowerCase().endsWith('.mov');
        return (
            <View key={uri} style={{ width: '100%', height: '100%' }}>
                {isVideo ? (
                    <Video source={{ uri }} style={{ width: '100%', height: '100%', borderRadius: 12 }}
                           useNativeControls resizeMode="cover" shouldPlay={false} isMuted
                           isLooping={true}/>
                ) : (
                    <Image source={{ uri }} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
                )}
            </View>
        );
    };

    return (
        <View style={styles.card} onLayout={e => setCardWidth(e.nativeEvent.layout.width)}>
            {/* header */}
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Text style={styles.username}>{post.username}</Text>
                    <Text style={styles.timestamp}>{formatPostDate(post.createdAt)}</Text>
                </View>
                {post.userId !== user.id && (
                    <ReportModal reportType={ReportType.POST} reportedEntityId={post.id}/>
                )}
            </View>

            {/* content */}
            <Text style={styles.content}>{post.content || '(no description)'}</Text>

            {/* carousel */}
            {cardWidth && post.mediaUrls?.length ? (
                <View style={styles.carouselContainer}>
                    <Carousel data={post.mediaUrls} renderItem={renderMedia}
                              containerWidth={cardWidth - 32} itemWidth={cardWidth - 32}
                              separatorWidth={8} onScrollBeginDrag={() => setScrollEnabled(false)}
                              onScrollEndDrag={() => setScrollEnabled(true)}
                              onMomentumScrollEnd={() => setScrollEnabled(true)}
                              inScrollView={false} style={styles.carousel}/>
                </View>
            ) : null}

            {/* actions */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={toggleLike} style={styles.footerButton}>
                    <AntDesign name={liked ? 'heart' : 'hearto'} size={20} color={liked ? '#E21E25' : '#444'}/>
                    <Text style={styles.footerText}>{localPost?.likes ?? post.likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: post.id })} style={styles.footerButton}>
                    <AntDesign name="message1" size={18} color="#444"/>
                    <Text style={styles.footerText}>{localPost?.comments ?? post.comments}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleSave}
                                  style={styles.footerButton}
                                  disabled={!savedInitialised || isSaving}>
                    <FontAwesome name={saved ? 'bookmark' : 'bookmark-o'}
                                 size={20}
                                 color={!savedInitialised ? '#bbb' : saved ? '#007AFF' : '#444'}/>
                    <Text style={styles.footerText}>{localPost?.saves ?? post.saves}</Text>
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
