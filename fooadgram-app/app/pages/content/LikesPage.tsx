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

type LikesParams = {
    postId: string;
};

const LikesPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {postId} = route.params as LikesParams;
    const {setUserData, userData} = useAppContext()
    const [users, setUsers] = useState<UsersProfileDto[]>([]);

    const fetchUsersWhoLikesThePost = async () => {
        try {
            const likersResponse = await ContentService.getUsersWhoLikedPost(postId, userData);
            setUsers(likersResponse);
        } catch (error) {
            console.error("Failed to fetch users who liked the post", error);
        }
    };


    useEffect(() => {
        fetchUsersWhoLikesThePost();
    }, [postId, userData]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <View style={shared_styles.body_container}>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Back Button */}
                   <View style={shared_styles.row}>
                       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                           <AntDesign name="arrowleft" size={24} color="black"/>
                       </TouchableOpacity>
                       <Text style={[styles.title, shared_styles.text]}>
                           Users who liked this post
                       </Text>
                   </View>

                    {/* Comments Section */}
                    <View style={styles.commentsSection}>
                        {users.map((profile) => (
                            <UserResultCard
                                key={profile.id}
                                profile={profile}
                            />
                        ))}
                    </View>
                </ScrollView>
                <FGTabBar/>
            </View>
        </KeyboardAvoidingView>
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
    },
    title: {
        marginLeft: 50,
        fontSize: 16,
        fontFamily: 'Poppins'
    }
});

export default LikesPage;
