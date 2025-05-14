import {Alert, Dimensions, Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute, useFocusEffect} from "@react-navigation/native";
import React, {useEffect, useRef, useState, useCallback} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {AntDesign, FontAwesome, Entypo} from '@expo/vector-icons';
import {ContentService} from "@/services/content-service";
import {GlobalConstants} from "@/utils/GlobalConstants";
import {formatPostDate} from "@/utils/dayjsConfig";
import Carousel from 'react-native-anchor-carousel';
import {CommentService} from "@/services/comment-service";
import {CommentResponseDto} from "@/models/content/dto/CommentResponseDto";
import {CommentCreateDto} from "@/models/content/dto/CommentCreateDto";
import { Video } from 'expo-av';
import Toast from "react-native-toast-message";
import {ReportReason} from "@/models/content/dto/ReportReason";
import {ReportType} from "@/models/content/dto/ReportType";
import ReportModal from "@/app/shared/content/ReportModal";
import {UserService} from "@/services/user-service";
import {PostResponseDto} from "@/models/content/dto/PostResponseDto";

type PostDetailParams = {
    postId: string;
};
const {width} = Dimensions.get('window');
const theme = {primary: '#E74C3C',secondary: '#2C3E50'};

const PostDetailPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {postId} = route.params as PostDetailParams;
    const [post, setPost] = useState<PostResponseDto>()
    const {setUserData, userData} = useAppContext()
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [hasSaved, setHasSaved] = useState<boolean>(false);
    const carouselRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState<number>(0);
    const videoRefs = useRef<{ [key: string]: Video | null }>({});
    const [posterProfilePicture, setPosterProfilePicture] = useState<string | null>(null);
    const fetchPost = async () => {
        try {
            const postResponse = await ContentService.getPost(postId, userData);
            setPost(postResponse);
            UserService.getUserProfilePicture(postResponse.userId)
                .then((profilePicture) => {
                    setPosterProfilePicture(profilePicture.data);
                })
                .catch(() => {
                    setPosterProfilePicture(null);
                });
            const liked = await ContentService.hasUserLikedPost(postId, userData);
            setHasLiked(liked);
            const saved = await ContentService.hasUserSavedPost(postId, userData);
            setHasSaved(saved);
        } catch (error) {
            console.error("Failed to fetch users posts", error);
        }
    };



    const renderMedia = ({ item, index }: { item: string, index: number }) => {
        const uri = GlobalConstants.s3Url + item;
        const isVideo = uri.toLowerCase().endsWith('.mp4') || uri.toLowerCase().includes('video');
        const isActive = index === activeSlide;

        if (isVideo) {
            return (
                <View key={uri}>
                    <Video
                        ref={(ref) => { videoRefs.current[uri] = ref; }}
                        source={{ uri }}
                        style={styles.postImage}
                        useNativeControls
                        resizeMode="contain"
                        muted
                        shouldPlay={isActive}
                        onError={(e) => console.error('Video loading error', e)}
                        onLoadStart={() => console.log('Video loading started')}
                        onLoad={() => console.log('Video loaded successfully')}
                    />
                </View>
            );
        }

        return (
            <Image
                source={{ uri }}
                style={styles.postImage}
                key={uri}
            />
        );
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

    const handleSave = async () => {
        try {
            if (hasSaved) {
                await ContentService.unsavePost(postId, userData);
                setPost(prevPost => prevPost ? {...prevPost, saves: prevPost.saves - 1} : prevPost);
            } else {
                await ContentService.savePost(postId, userData);
                setPost(prevPost => prevPost ? {...prevPost, saves: prevPost.saves + 1} : prevPost);
            }
            setHasSaved(!hasSaved);
        } catch (error) {
            console.error("Failed to like/unlike post", error);
        }
    };

    const handleDeletePost = () => {
        Alert.alert(
            'Delete post',
            'Are you sure you want to delete this post? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ContentService.deletePost(postId, userData);
                            Toast.show({ type: 'success', text1: 'Post deleted.' });
                            navigation.goBack();       {/*or navigation.navigate('Home')*/}
                        } catch (e) {
                            Toast.show({ type: 'error', text1: 'Delete failed' });
                        }
                    },
                },
            ],
        );
    };



    useEffect(() => {
        return () => {
            console.log('Cleaning up videos (PostDetailPage unmount)');
            Object.entries(videoRefs.current).forEach(([uri, video]) => {
                if (video) {
                    video.pauseAsync?.();
                    video.unloadAsync?.();
                }
            });
            videoRefs.current = {};
        };
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchPost();
        }, [postId, userData])
    );

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
                    {/* Added navigation to profile page when clicked on username */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={[shared_styles.row,{alignItems: 'center', gap: 10}]}
                            onPress={() => {
                            navigation.navigate('Profile', {userId: post?.userId});
                        }}>
                            <Image
                                source={
                                    posterProfilePicture ? { uri: GlobalConstants.s3Url + posterProfilePicture}
                                        : require('@/assets/images/dummy-profile.jpeg')
                                }
                                style={{width: 40, height: 40, borderRadius: 25}}
                            />
                            <Text style={[styles.username]}>{post?.username}</Text>
                        </TouchableOpacity>

                        {
                            post?.userId != userData?.id &&
                            <ReportModal
                                reportType={ReportType.POST}
                                reportedEntityId={postId}
                            />
                        }
                        {post?.userId === userData?.id && (
                            <TouchableOpacity onPress={handleDeletePost}>
                                <Entypo name="trash" size={22} color="red" />
                            </TouchableOpacity>
                        )}
                    </View>


                    {/* Post Image */}
                    <View
                        style={[styles.imageWrapper, {marginBottom: 10}]}>
                        <Carousel
                            ref={carouselRef}
                            data={post?.mediaUrls}
                            renderItem={renderMedia}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            style={styles.carousel}
                            itemWidth={width * 0.90}
                            containerWidth={width}
                            separatorWidth={0}
                            onSnapToItem={(index) => {
                                console.log('Active Slide Changed:', index);
                                setActiveSlide(index);
                            }}
                        />


                    </View>

                    {/* Post Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={handleLike}>
                            <AntDesign name={hasLiked ? "heart" : "hearto"} size={24} color={hasLiked ? "#E21E25" : "black"}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Comments', {postId})}
                        >
                            <View style={[shared_styles.row, {alignItems: 'center'}]}>
                                <FontAwesome name="comment-o" size={24} color="black"/>
                                <Text style={{marginLeft: 10}}>
                                    {post?.comments}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={
                                handleSave
                            }
                        >
                            <View style={[shared_styles.row, {alignItems: 'center'}]}>
                                <FontAwesome name={hasSaved ? 'bookmark' : 'bookmark-o'} size={24} color="black"/>
                                <Text style={{marginLeft: 10}}>
                                    {post?.saves}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Post Details */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Likes', {postId})}
                    >
                        <Text style={styles.likes}>{post?.likes} likes</Text>
                    </TouchableOpacity>

                    {/* Added navigation to profile page when clicked on username */}
                    <View>
                        <Text style={styles.description}>
                            <Text
                                style={styles.username}
                                onPress={() =>
                                    navigation.navigate('Profile', { userId: post?.userId })
                                }
                            >
                                {post?.username}{' '}
                            </Text>
                            {post?.content}
                        </Text>
                        {post?.tags && post.tags.map((tag, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => navigation.navigate('Tag', { tag })}
                            >
                                <Text style={styles.tag}>#{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {post?.createdAt && (
                        <Text style={styles.date}>{formatPostDate(post.createdAt)}</Text>
                    )}
                    {post?.recipe && (
                        <View style={styles.recipeCard}>
                            <Text style={styles.recipeTitle}>
                                <FontAwesome name="cutlery" size={18} color={theme.primary} />{' '}
                                {post.recipe.title}
                            </Text>
                            <Text style={styles.recipeDescription}>{post.recipe.description}</Text>

                            <Text style={styles.subheading}>🍅 Ingredients</Text>
                            {post.recipe.ingredients.map(ing => (
                                <Text key={ing.id} style={styles.recipeItem}>
                                    • {ing.amount} {ing.unit} {ing.name}
                                </Text>
                            ))}

                            <Text style={styles.subheading}>📝 Instructions</Text>
                            {post.recipe.instructions.map((step, idx) => (
                                <Text key={idx} style={styles.recipeItem}>
                                    {idx + 1}. {step}
                                </Text>
                            ))}

                            <Text style={styles.recipeFooter}>
                                Cuisine: {post.recipe.cuisineType} · Difficulty: {post.recipe.difficultyLevel} · Prep: {post.recipe.prepTime} min
                            </Text>
                        </View>
                    )}

                </ScrollView>

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
    carousel: {
        flex: 1,
        backgroundColor: 'white',
    },

    backButton: {
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
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
    tag: {
        color: 'blue',
        marginRight: 8,
    },
    date: {
        color: 'gray',
        fontSize: 12,
        marginBottom: 12,
    },
    recipeCard: {
        backgroundColor: '#FFFDF5',
        padding: 16,
        marginVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.primary,
        marginBottom: 8,
    },
    recipeDescription: {
        fontSize: 14,
        color: theme.secondary,
        marginBottom: 12,
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
    },
    imageWrapper: {
        width: '100%',
        height: 300,
        overflow: 'hidden',
        borderRadius: 6,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    recipeSection: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    recipeDescription: {
        fontSize: 14,
        marginBottom: 10,
    },
    recipeSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    ingredientItem: {
        fontSize: 14,
        marginBottom: 5,
    },
    instructionItem: {
        fontSize: 14,
        marginBottom: 5,
    },
    recipeDetails: {
        fontSize: 12,
        color: 'gray',
        marginTop: 10,
    },
    mediaContainer: {
        width: '100%',
        aspectRatio: 4 / 5,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#000',
        marginVertical: 16,
    },
    media: {
        width: '100%',
        height: '100%',
    },

    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    usernameAndDate: {
        flexDirection: 'column',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalOption: {
        fontSize: 16,
        marginVertical: 10,
        color: 'blue',
    },
    modalCancel: {
        fontSize: 16,
        marginTop: 20,
        color: 'red',
    },
    subheading: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.secondary,
        marginTop: 12,
        marginBottom: 6,
    },
    recipeItem: {
        fontSize: 14,
        color: theme.secondary,
        marginBottom: 4,
        lineHeight: 20,
    },
    recipeFooter: {
        fontSize: 12,
        color: '#777',
        marginTop: 12,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
    }
});

export default PostDetailPage;
