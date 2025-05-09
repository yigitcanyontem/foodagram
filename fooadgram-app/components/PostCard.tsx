import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { PostResponseDto } from '@/models/content/dto/PostResponseDto';
import { Video } from 'expo-av';
import { GlobalConstants } from '@/utils/GlobalConstants';

type Props = {
    post: PostResponseDto;
    onPress?: () => void;
};

const CARD_SIZE = (Dimensions.get('window').width - 32) / 3;

const PostCard: React.FC<Props> = ({ post, onPress }) => {
    const rawUrl = post.mediaUrls?.[0];
    const mediaUrl = rawUrl ? GlobalConstants.s3Url + rawUrl : null;

    if (!mediaUrl) return null;

    const isVideo = mediaUrl.toLowerCase().endsWith('.mp4') || mediaUrl.toLowerCase().includes('video');

    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            {isVideo ? (
                <Video
                    source={{ uri: mediaUrl }}
                    style={styles.media}
                    resizeMode="cover"
                    isMuted
                    shouldPlay={false}
                />
            ) : (
                <Image
                    source={{ uri: mediaUrl }}
                    style={styles.media}
                    resizeMode="cover"
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    media: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },

});

export default PostCard;
