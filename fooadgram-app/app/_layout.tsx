import {createStaticNavigation, DarkTheme, DefaultTheme, ThemeProvider, useNavigation} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import Header from "@/app/shared/Header";
import {createStackNavigator} from "@react-navigation/stack";
import {SafeAreaView} from "react-native";
import {
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';
import Toast from "react-native-toast-message";
import {AppProvider} from "@/context/AppContext";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomeScreen from "@/app/(tabs)";
import FGTabBar from "@/app/shared/FGTabBar";
import HomePage from "@/app/pages/home_page";
import ExplorePage from "@/app/pages/explore_page";
import BookmarkedPage from "@/app/pages/bookmarked_page";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileFollowPage from "@/app/pages/profile/profile_follow_page";
import CreatePostPage from "@/app/pages/content/create_post_page";
import ProfilePage from "@/app/pages/profile/profile_page";
import LoginPage from "@/app/pages/auth/login_page";
import RegisterPage from "@/app/pages/auth/register_page";
import EditProfilePage from "@/app/pages/profile/edit_profile_page";
import PostDetailPage from "@/app/pages/content/post_detail";
import UserProfilePage from "@/app/pages/profile/user_profile_page";
import LikesPage from "@/app/pages/content/LikesPage";
import CommentsPage from "@/app/pages/content/CommentsPage";
import TagPage from "@/app/pages/content/TagPage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Poppins_100Thin,
        Poppins_100Thin_Italic,
        Poppins_200ExtraLight,
        Poppins_200ExtraLight_Italic,
        Poppins_300Light,
        Poppins_300Light_Italic,
        Poppins_400Regular,
        Poppins_400Regular_Italic,
        Poppins_500Medium,
        Poppins_500Medium_Italic,
        Poppins_600SemiBold,
        Poppins_600SemiBold_Italic,
        Poppins_700Bold,
        Poppins_700Bold_Italic,
        Poppins_800ExtraBold,
        Poppins_800ExtraBold_Italic,
        Poppins_900Black,
        Poppins_900Black_Italic,
    });
    const [userLoggedIn, setUserLoggedIn] = React.useState(false);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
            checkUserLoggedIn();
        }
    }, [loaded]);

    const checkUserLoggedIn = async () => {
        const storedUserData = await AsyncStorage.getItem("userData");
        setUserLoggedIn(!!storedUserData);
    }

    if (!loaded) {
        return null;
    }


    return (
        <SafeAreaView style={{flex: 1}}>
            <AppProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack.Navigator
                        screenOptions={{
                            header: ({navigation, route}) => <Header title={route.name}/>,
                            gestureEnabled: true,  // Enables swipe-to-go-back
                            gestureDirection: 'horizontal',  // Swipes from left to right
                        }}
                    >
                        <Stack.Screen name="Home" component={HomePage}/>
                        <Stack.Screen name="Explore" component={ExplorePage}/>
                        <Stack.Screen name="CreatePost" component={CreatePostPage}/>
                        <Stack.Screen name="Bookmarked" component={BookmarkedPage}/>
                        <Stack.Screen name="Profile" component={ProfilePage}/>
                        <Stack.Screen name="UserProfile" component={UserProfilePage}/>
                        <Stack.Screen name="Login" component={LoginPage}/>
                        <Stack.Screen name="Register" component={RegisterPage}/>
                        <Stack.Screen name="EditProfilePage" component={EditProfilePage}/>
                        <Stack.Screen name="PostDetail" component={PostDetailPage} />
                        <Stack.Screen name="ProfileFollowDetails" component={ProfileFollowPage} />
                        <Stack.Screen name="Likes" component={LikesPage} />
                        <Stack.Screen name="Comments" component={CommentsPage} />
                        <Stack.Screen name="Tag" component={TagPage} />
                    </Stack.Navigator>
                </ThemeProvider>
                <Toast/>
            </AppProvider>
        </SafeAreaView>
    );
}
