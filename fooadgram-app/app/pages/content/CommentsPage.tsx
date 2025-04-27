import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
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
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import UserResultCard from "@/app/shared/profile/UserResultCard";
import ReportModal from "@/app/shared/content/ReportModal";
import {ReportType} from "@/models/content/dto/ReportType";

type CommentsParams = {
    postId: string;
};

const CommentsPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {postId} = route.params as CommentsParams;
    const {setUserData, userData} = useAppContext();
    const [comments, setComments] = useState<CommentResponseDto[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [replyTo, setReplyTo] = useState<string | null>(null); // Track the comment being replied to

    const fetchComments = async () => {
        try {
            const commentsResponse = await CommentService.getCommentsByPost(postId, userData);
            setComments(commentsResponse);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    const handleComment = async () => {
        if (!newComment.trim()) return;

        try {
            const commentDto: CommentCreateDto = {
                content: newComment,
                postId: postId,
                parentReplyId: replyTo, // Set parentReplyId for replies
                createdByUsername: userData.username,
            };

            await CommentService.createComment(commentDto, userData);
            setNewComment('');
            setReplyTo(null); // Reset replyTo after posting
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error("Failed to create comment", error);
        }
    };

    const renderComments = (comments: CommentResponseDto[], parentId: string | null = null) => {
        return comments
            .filter((comment) => comment.parentReplyId === parentId)
            .map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                    <View style={shared_styles.titleContainer}>
                        <Text style={styles.commentUsername}>{comment.createdByUsername}</Text>

                        {
                            comment?.userId != userData?.id &&
                            <ReportModal
                                reportType={ReportType.COMMENT}
                                reportedEntityId={comment.id}
                            />
                        }

                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <Text style={styles.commentDate}>{formatPostDate(comment.createdAt)}</Text>
                    <TouchableOpacity onPress={() => setReplyTo(comment.id)}>
                        <Text style={styles.replyButton}>Reply</Text>
                    </TouchableOpacity>
                    {/* Render nested replies */}
                    <View style={styles.nestedComments}>
                        {renderComments(comments, comment.id)}
                    </View>
                </View>
            ));
    };

    useEffect(() => {
        fetchComments();
    }, [postId, userData]);

    return (
        <View style={{flex: 1}}>
            <View style={shared_styles.body_container}>
                <View style={[styles.container, {marginTop: 10}]}>
                    <Text style={styles.commentsTitle}>Comments</Text>
                </View>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.commentsSection}>
                        {renderComments(comments)}
                    </View>
                </ScrollView>

                {/* Comment Input */}
                <View style={styles.commentInputContainer}>
                    {replyTo && (
                        <Text style={styles.replyingTo}>
                            Replying to: {comments.find((c) => c.id === replyTo)?.createdByUsername}
                        </Text>
                    )}
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
        paddingRight: 20,
        paddingLeft: 20,
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
    Comments: {
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
    },
    title: {
        marginLeft: 50,
        fontSize: 16,
        fontFamily: 'Poppins'
    },
    nestedComments: {
        marginLeft: 20,
        marginTop: 10,
    },
    replyButton: {
        color: "#007AFF",
        marginTop: 5,
    },
    replyingTo: {
        fontSize: 12,
        color: "gray",
        marginBottom: 5,
    },
});

export default CommentsPage;
