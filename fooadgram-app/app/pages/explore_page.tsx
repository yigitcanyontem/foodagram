import {ScrollView, StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {UserService} from "@/services/user-service";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import {useBase64Image} from "@/hooks/useBase64Image";
import UserResultCard from "@/app/shared/profile/UserResultCard";
import Toast from "react-native-toast-message";
import {PostResponseDto} from "@/models/content/dto/PostResponseDto";
import {ContentService} from "@/services/content-service";
import PostsSection from "@/app/shared/profile/PostsSection";

const ExplorePage = () => {
    const navigation = useNavigation();
    const {userData} = useAppContext();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UsersProfileDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const {getBase64Uri} = useBase64Image();
    const [posts, setPosts] = useState<PostResponseDto[]>([]);

    const fetchPosts = async () => {
        try {
            const response = await ContentService.getRandomPublicPostsForExplore(userData);
            setPosts(response);
        } catch (error) {
            console.error("Failed to fetch saves posts", error);
        }
    };

    const handleSearch = async () => {
        try {
            if (query.trim() === '') {
                setResults([]);
                return;
            }

            const profiles = await UserService.searchUserProfiles(query);
            setResults(profiles);
            setError(null);
        } catch (err) {
            setResults([]);
        }
    };
    useEffect(() => {
        fetchPosts()
    }, [userData]);

    useEffect(() => {
        handleSearch()
    }, [query]);

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={[shared_styles.row, {padding: 20}]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search users..."
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>
                {
                    posts.length > 0 && (
                        <View style={shared_styles.column}>
                            <View style={[shared_styles.row, {paddingHorizontal: 20}]}>
                                <Text style={styles.section_title}>Posts</Text>
                            </View>
                            <PostsSection key={`explore_posts`} posts={posts}/>
                        </View>
                    )
                }
                {error && <Text style={styles.errorText}>{error}</Text>}
                {results.map((profile) => (
                    <UserResultCard
                        key={profile.id}
                        profile={profile}
                    />
                ))}
            </ScrollView>
            <FGTabBar/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginBottom: 15,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    resultText: {
        fontSize: 16,
    },
    section_title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    }
});

export default ExplorePage;
