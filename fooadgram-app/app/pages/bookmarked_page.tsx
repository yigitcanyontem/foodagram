import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {ContentService} from "@/services/content-service";
import {PostResponseDto} from "@/models/content/dto/PostResponseDto";
import PostsSection from "@/app/shared/profile/PostsSection";
import {AntDesign} from "@expo/vector-icons";


const BookmarkedPage = () => {
    const navigation = useNavigation();
    const { setUserData, userData } = useAppContext()
    const [posts, setPosts] = useState<PostResponseDto[]>([]);

    const fetchPosts = async () => {
        try {
            const response = await ContentService.getSavedPostsByUser(userData);
            setPosts(response);
        } catch (error) {
            console.error("Failed to fetch saves posts", error);
        }
    };


    useEffect(() => {
        fetchPosts();
    }, [userData]);


    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container} >
               <View style={[shared_styles.row, shared_styles.justify_between, {width: "100%", padding: 20}]}>
                   <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                       <AntDesign name="arrowleft" size={24} color="black"/>
                   </TouchableOpacity>
                   <Text style={styles.title}>Saved Posts</Text>
                   <Text style={styles.title}></Text>
               </View>
                <View>
                    <PostsSection key={`posts_of_logged_in_user`} posts={posts}/>
                </View>
            </ScrollView>
            <FGTabBar/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    backButton: {
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        width: "100%",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    registerText: {
        marginTop: 10,
    },
    link: {
        color: "blue",
    },
});

export default BookmarkedPage;
