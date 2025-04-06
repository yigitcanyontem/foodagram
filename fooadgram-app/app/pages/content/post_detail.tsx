import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {AntDesign, FontAwesome} from '@expo/vector-icons';
import {PostResponseDto} from "@/models/content/dto/PostResponseDto";
import {ContentService} from "@/services/content-service";
import {GlobalConstants} from "@/utils/GlobalConstants";
import {formatPostDate} from "@/utils/dayjsConfig";

const PostDetailPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {postId} = route.params;
    const [post, setPost] = useState<PostResponseDto>()
    const {setUserData, userData} = useAppContext()
    const [hasLiked, setHasLiked] = useState<boolean>(false);

    const fetchPost = async () => {
        try {
            const postResponse = await ContentService.getPost(postId, userData);
            setPost(postResponse);
            const liked = await ContentService.hasUserLikedPost(postId, userData);
            setHasLiked(liked);
        } catch (error) {
            console.error("Failed to fetch users posts", error);
        }
    };

    const handleLike = async () => {
        try {
            if (hasLiked) {
                await ContentService.unlikePost(postId, userData);
                setPost(prevPost => prevPost ? {...prevPost, likes: prevPost.likes - 1} : prevPost);
            } else {
                await ContentService.likePost(postId, userData);
                setPost(prevPost => prevPost ? {...prevPost, likes: prevPost.likes + 1} : prevPost);
            }
            setHasLiked(!hasLiked);
        } catch (error) {
            console.error("Failed to like/unlike post", error);
        }
    };

    useEffect(() => {
        fetchPost()
    }, [postId, userData]);

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="black"/>
                </TouchableOpacity>

                {/* Post Header */}
                <View style={styles.header}>
                    <Text style={styles.username}>{post?.username}</Text>
                </View>

                {/* Post Image */}
                <Image source={{uri: GlobalConstants.s3Url + post?.mediaUrls[0]}} style={styles.postImage}/>

                {/* Post Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity onPress={handleLike}>
                        <AntDesign name={hasLiked ? "heart" : "hearto"} size={24} color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name="comment-o" size={24} color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name="send-o" size={24} color="black"/>
                    </TouchableOpacity>
                </View>

                {/* Post Details */}
                <Text style={styles.likes}>{post?.likes} likes</Text>
                <Text style={styles.description}><Text style={styles.username}>{post?.username} </Text>{post?.content}
                </Text>
                {post?.createdAt && (
                    <Text style={styles.date}>{formatPostDate(post.createdAt)}</Text>
                )}
            </ScrollView>
            <FGTabBar/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    backButton: {
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    postImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    likes: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        marginBottom: 5,
    },
    date: {
        color: 'gray',
        fontSize: 12,
    }
});

export default PostDetailPage;
