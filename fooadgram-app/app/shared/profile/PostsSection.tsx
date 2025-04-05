import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {PostResponseDto} from "@/models/content/dto/PostResponseDto";
import shared_styles from "@/shared_styles";
import {GlobalConstants} from "@/utils/GlobalConstants";

type PostsSectionProps = {
    posts: PostResponseDto[];
};

const PostsSection: React.FC<PostsSectionProps> = ({ posts }) => {
    const navigation = useNavigation();

    return (
        <View style={shared_styles.posts_container}>
            {posts.map((post, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
                >
                    <Image source={{ uri: GlobalConstants.s3Url + post.mediaUrls[0] }} style={shared_styles.post_image} />
                </TouchableOpacity>
            ))}

            {
                posts.length == 0 &&
                <View>
                    <Text>
                        No Posts...
                    </Text>
                </View>
            }
        </View>
    );
};

export default PostsSection;
