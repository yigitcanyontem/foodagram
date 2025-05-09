import React, { useRef, useState, useEffect } from 'react';
import { View, ActivityIndicator, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface VideoPostCardProps {
    uri: string;
    isVisible: boolean;
    width: number;
    height: number;
}

const VideoPostCard: React.FC<VideoPostCardProps> = ({ uri, isVisible, width, height }) => {
    const videoRef = useRef<Video>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);

    useEffect(() => {
        if (isVisible) {
            videoRef.current?.playAsync();
        } else {
            videoRef.current?.pauseAsync();
        }
    }, [isVisible]);

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <TouchableWithoutFeedback onPress={toggleMute}>
            <View style={[styles.container, { width, height }]}>
                <Video
                    ref={videoRef}
                    source={{ uri }}
                    style={styles.video}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping
                    isMuted={isMuted}
                    onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded && !status.isPlaying) {
                            setIsBuffering(true); // Buffering while it's not playing
                        } else {
                            setIsBuffering(false); // Not buffering if it's playing or loaded
                        }
                    }}
                />

                {isBuffering && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="small" color="#fff" />
                    </View>
                )}

                <View style={styles.muteIcon}>
                    <Ionicons
                        name={isMuted ? 'volume-mute' : 'volume-high'}
                        size={20}
                        color="white"
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        borderRadius: 8,
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    muteIcon: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 4,
        borderRadius: 12,
    },
});

export default VideoPostCard;
