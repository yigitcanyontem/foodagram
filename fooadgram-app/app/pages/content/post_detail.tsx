import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import React, {useEffect, useRef, useState} from "react";
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
import Carousel from 'react-native-anchor-carousel';

type PostDetailParams = {
    postId: string;
};
const {width} = Dimensions.get('window');

const PostDetailPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {postId} = route.params as PostDetailParams;
    const [post, setPost] = useState<PostResponseDto>()
    const {setUserData, userData} = useAppContext()
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const carouselRef = useRef(null);

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
        fetchPost();
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
                    <View
                        style={[styles.imageWrapper, {marginBottom: 10}]}>
                        <Carousel
                            ref={carouselRef}
                            data={post?.mediaUrls}
                            renderItem={({item}) => (
                                <Image
                                    source={{uri: GlobalConstants.s3Url + item}}
                                    style={styles.postImage}
                                    accessibilityLabel={"Post Image"}
                                />
                            )}
                            style={styles.carousel}
                            itemWidth={width * 0.90}
                            containerWidth={width}
                            separatorWidth={0}
                        />

                    </View>

                    {/* Post Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={handleLike}>
                            <AntDesign name={hasLiked ? "heart" : "hearto"} size={24} color="black"/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Comments', {postId})}
                        >
                            <View style={shared_styles.row}>
                                <FontAwesome name="comment-o" size={24} color="black"/>
                                <Text style={{marginLeft: 10, verticalAlign: 'middle'}}>
                                    {post?.comments}
                                </Text>
                            </View>
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

                    <View>
                        <Text style={styles.description}><Text
                            style={styles.username}>{post?.username} </Text>{post?.content}
                        </Text>
                        {
                            post?.tags && post.tags.map((tag, index) => (
                                <Text key={index} style={styles.tag}>#{tag}</Text>
                            ))
                        }
                    </View>
                    {post?.createdAt && (
                        <Text style={styles.date}>{formatPostDate(post.createdAt)}</Text>
                    )}

                    <View style={styles.recipeSection}>
                        <Text style={styles.recipeTitle}>Recipe: {post?.recipe?.title}</Text>
                        <Text style={styles.recipeDescription}>{post?.recipe?.description}</Text>
                        <Text style={styles.recipeSubtitle}>Ingredients:</Text>
                        {post?.recipe?.ingredients.map((ingredient) => (
                            <Text key={ingredient.id} style={styles.ingredientItem}>
                                - {ingredient.amount} {ingredient.unit} {ingredient.name}
                            </Text>
                        ))}
                        <Text style={styles.recipeSubtitle}>Instructions:</Text>
                        {post?.recipe?.instructions.map((instruction, index) => (
                            <Text key={index} style={styles.instructionItem}>
                                {index + 1}. {instruction}
                            </Text>
                        ))}
                        <Text style={styles.recipeDetails}>
                            Cuisine: {post?.recipe?.cuisineType} | Difficulty: {post?.recipe?.difficultyLevel} | Prep Time: {post?.recipe?.prepTime} mins
                        </Text>
                    </View>

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
});

export default PostDetailPage;
