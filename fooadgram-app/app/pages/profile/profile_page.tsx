import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import React, {useEffect} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {Label} from "@rn-primitives/select";
import PostsSection from "@/app/shared/profile/PostsSection";
import {CookingPot, Grid2X2} from "lucide-react-native";
import RecipesSection from "@/app/shared/profile/RecipesSection";
import {UserService} from "@/services/user-service";
import {useBase64Image} from "@/hooks/useBase64Image";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import Toast from "react-native-toast-message";
import UserProfile from "@/app/shared/profile/user_profile";


const ProfilePage = () => {
    const {setUserData, userData} = useAppContext()

    return (
        userData && (
            <View style={shared_styles.body_container}>
                <ScrollView contentContainerStyle={styles.container}>
                    <UserProfile profileId={userData.id} />
                </ScrollView>
                <FGTabBar/>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff"
    }
});

export default ProfilePage;
