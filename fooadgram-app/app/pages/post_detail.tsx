import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const PostDetailPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { postId } = route.params;

    // Mock Post Data
    const post = {
        id: postId,
        username: "john_doe",
        imageUrl: "https://picsum.photos/200?random=123",
        description: "Exploring the beauty of nature! 🌿🌞",
        date: "March 22, 2025",
        likes: 120,
    };

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>

                {/* Post Header */}
                <View style={styles.header}>
                    <Text style={styles.username}>{post.username}</Text>
                </View>

                {/* Post Image */}
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />

                {/* Post Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity>
                        <AntDesign name="hearto" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name="comment-o" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name="send-o" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Post Details */}
                <Text style={styles.likes}>{post.likes} likes</Text>
                <Text style={styles.description}><Text style={styles.username}>{post.username} </Text>{post.description}</Text>
                <Text style={styles.date}>{post.date}</Text>
            </ScrollView>
            <FGTabBar />
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
