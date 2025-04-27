import {Dimensions, Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState, useEffect, useRef } from 'react'
import { Video } from 'expo-av'
import Carousel from 'react-native-anchor-carousel'
import Toast from 'react-native-toast-message'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { useAppContext } from '@/context/AppContext'
import FGTabBar from '@/app/shared/FGTabBar'
import shared_styles from '@/shared_styles'
import { PostResponseDto } from '@/models/content/dto/PostResponseDto'
import { ContentService } from '@/services/content-service'
import { GlobalConstants } from '@/utils/GlobalConstants'
import { formatPostDate } from '@/utils/dayjsConfig'
import ReportModal from '@/app/shared/content/ReportModal'
import { ReportType } from '@/models/content/dto/ReportType'
const { width } = Dimensions.get('window')
const theme = {primary: '#E74C3C',secondary: '#2C3E50',
}
type PostDetailParams = { postId: string }
const PostDetailPage = () => {
    const navigation = useNavigation()
    const { postId } = useRoute().params as PostDetailParams
    const { userData } = useAppContext()
    const [post, setPost] = useState<PostResponseDto>()
    const [hasLiked, setHasLiked] = useState(false)
    const [hasSaved, setHasSaved] = useState(false)
    const carouselRef = useRef<Carousel<string>>(null)

    const fetchPost = async () => {
        try {
            const postResponse = await ContentService.getPost(postId, userData);
            setPost(postResponse);
            const liked = await ContentService.hasUserLikedPost(postId, userData);
            setHasLiked(liked);
            const saved = await ContentService.hasUserSavedPost(postId, userData);
            setHasSaved(saved);
        } catch (error) {
            console.error("Failed to fetch users posts", error);
        }
    };

    useEffect(() => { fetchPost() }, [postId, userData])

    const renderMedia = ({ item }: { item: string }) => {
        const uri = GlobalConstants.s3Url + item
        const isVideo = uri.toLowerCase().endsWith('.mp4') || uri.toLowerCase().includes('video')
        return isVideo ? (
            <Video
                source={{ uri }}
                style={styles.postImage}
                useNativeControls
                resizeMode="contain"
                isMuted={false}
                shouldPlay={false}
            />
        ) : (
            <Image source={{ uri }} style={styles.postImage} />
        )
    }

    const handleLike = async () => {
        try {
            if (hasLiked) {
                await ContentService.unlikePost(postId, userData)
                setPost(p => p ? { ...p, likes: p.likes - 1 } : p)
            } else {
                await ContentService.likePost(postId, userData)
                setPost(p => p ? { ...p, likes: p.likes + 1 } : p)
            }
            setHasLiked(l => !l)
        } catch (e) { console.error(e) }
    }

    const handleSave = async () => {
        try {
            if (hasSaved) {
                await ContentService.unsavePost(postId, userData)
                setPost(p => p ? { ...p, saves: p.saves - 1 } : p)
            } else {
                await ContentService.savePost(postId, userData)
                setPost(p => p ? { ...p, saves: p.saves + 1 } : p)
            }
            setHasSaved(s => !s)
        } catch (e) { console.error(e) }
    }

    return (
        <View style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={shared_styles.body_container}>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>
                    {/* Post Header */}
                    <View style={styles.header}>
                        <Text style={styles.username}>{post?.username}</Text>
                        {post?.userId !== userData?.id && (
                            <ReportModal reportType={ReportType.POST} reportedEntityId={postId} />
                        )}
                    </View>
                    {/* Post Image */}
                    <View style={styles.imageWrapper}>
                        <Carousel
                            ref={carouselRef}
                            data={post?.mediaUrls || []}
                            renderItem={renderMedia}
                            style={styles.carousel}
                            itemWidth={width * 0.9}
                            containerWidth={width}
                        />
                    </View>
                    {/* Post Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={handleLike}>
                            <AntDesign
                                name={hasLiked ? 'heart' : 'hearto'}
                                size={24}
                                color={hasLiked ? '#E21E25' : 'black'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId })}>
                            <View style={shared_styles.row}>
                                <FontAwesome name="comment-o" size={24} color="black" />
                                <Text style={{ marginLeft: 10 }}>{post?.comments}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave}>
                            <View style={shared_styles.row}>
                                <FontAwesome
                                    name={hasSaved ? 'bookmark' : 'bookmark-o'}
                                    size={24}
                                    color="black"
                                />
                                <Text style={{ marginLeft: 10 }}>{post?.saves}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* Post Details */}
                    <TouchableOpacity onPress={() => navigation.navigate('Likes', { postId })}>
                        <Text style={styles.likes}>{post?.likes} likes</Text>
                    </TouchableOpacity>

                    <Text style={styles.description}>
                        <Text style={styles.username}>{post?.username} </Text>
                        {post?.content}
                    </Text>
                    {post?.tags?.map((tag, i) => (
                        <TouchableOpacity key={i} onPress={() => navigation.navigate('Tag', { tag })}>
                            <Text style={styles.tag}>#{tag}</Text>
                        </TouchableOpacity>
                    ))}

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
                <FGTabBar />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    carousel: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    imageWrapper: {
        width: '100%',
        height: 300,
        borderRadius: 6,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
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
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: theme.secondary,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    cancel: {
        color: 'red',
        marginRight: 16,
    },
    submit: {
        color: theme.primary,
    },
})

export default PostDetailPage
