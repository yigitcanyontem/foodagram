import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
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
import {CommentService} from "@/services/comment-service";
import {CommentResponseDto} from "@/models/content/dto/CommentResponseDto";
import {CommentCreateDto} from "@/models/content/dto/CommentCreateDto";

type PostDetailParams = {
    postId: string;
};

const PostDetailPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {postId} = route.params as PostDetailParams;
    const [post, setPost] = useState<PostResponseDto>()
    const {setUserData, userData} = useAppContext()
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [comments, setComments] = useState<CommentResponseDto[]>([]);
    const [newComment, setNewComment] = useState<string>('');

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

    const fetchComments = async () => {
        try {
            const commentsResponse = await CommentService.getCommentsByPost(postId, userData);
            setComments(commentsResponse);
        } catch (error) {
            console.error("Failed to fetch comments", error);
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

    const handleComment = async () => {
        if (!newComment.trim()) return;
        
        try {
            const commentDto: CommentCreateDto = {
                content: newComment,
                postId: postId,
                parentReplyId: null,
                createdByUsername: userData.username,
            };
            
            await CommentService.createComment(commentDto, userData);
            setNewComment('');
            fetchComments(); // Refresh comments after adding new one
        } catch (error) {
            console.error("Failed to create comment", error);
        }
    };

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [postId, userData]);

    return (
        <View
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
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
                    <TouchableOpacity
                    onPress={() => navigation.navigate('Likes', {postId})}
                    >
                        <Text style={styles.likes}>{post?.likes} likes</Text>
                    </TouchableOpacity>
                    <Text style={styles.description}><Text style={styles.username}>{post?.username} </Text>{post?.content}</Text>
                    {post?.createdAt && (
                        <Text style={styles.date}>{formatPostDate(post.createdAt)}</Text>
                    )}

                    {/* Comments Section */}
                    <View style={styles.commentsSection}>
                        <Text style={styles.commentsTitle}>Comments</Text>
                        {comments.map((comment) => (
                            <View key={comment.id} style={styles.commentItem}>
                                <Text style={styles.commentUsername}>{comment.createdByUsername}</Text>
                                <Text style={styles.commentContent}>{comment.content}</Text>
                                <Text style={styles.commentDate}>{formatPostDate(comment.createdAt)}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Comment Input */}
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleComment}
                        disabled={!newComment.trim()}
                    >
                        <FontAwesome name="send" size={20} color={newComment.trim() ? "#007AFF" : "#999"}/>
                    </TouchableOpacity>
                </View>
                <FGTabBar/>
            </View>
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
    },
    commentsSection: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 20,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    commentItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    commentUsername: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentContent: {
        marginBottom: 5,
    },
    commentDate: {
        color: 'gray',
        fontSize: 12,
        textAlign: 'right'
    },
    commentInputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    commentInput: {
        flex: 1,
        marginRight: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        maxHeight: 100,
    },
    sendButton: {
        padding: 10,
    }
});

export default PostDetailPage;
