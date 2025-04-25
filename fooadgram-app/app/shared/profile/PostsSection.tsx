import { Video, ResizeMode } from 'expo-av';
import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {PostResponseDto} from "@/models/content/dto/PostResponseDto";
import shared_styles from "@/shared_styles";
import {GlobalConstants} from "@/utils/GlobalConstants";


type PostsSectionProps = {
    posts: PostResponseDto[];
};

const PostsSection: React.FC<PostsSectionProps> = ({ posts }) => {
    const navigation = useNavigation<NavigationProp<{ PostDetail: { postId: string } }>>();

    return (
        <View style={shared_styles.posts_container}>
            {posts.map((post, index) => {
                const mediaUrl = GlobalConstants.s3Url + post.mediaUrls[0];
                const isVideo = mediaUrl.toLowerCase().endsWith('.mp4')|| mediaUrl.includes('video');
                console.log("Post media:", post.mediaUrls[0]);

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
                    >
                        {isVideo ? (
                            <Video
                                source={{ uri: mediaUrl }}
                                style={shared_styles.post_image}
                                useNativeControls={false}
                                resizeMode={ResizeMode.COVER}
                                isMuted
                                shouldPlay={false}
                            />
                        ) : (
                            <Image
                                source={{ uri: mediaUrl }}
                                style={shared_styles.post_image}
                            />
                        )}
                    </TouchableOpacity>
                );
            })}

            {posts.length === 0 && (
                <View>
                    <Text>No Posts...</Text>
                </View>
            )}
        </View>
    );
};

export default PostsSection;
