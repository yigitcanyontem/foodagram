import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import LoginPage from "@/app/pages/login_page";
import RegisterPage from "@/app/pages/register_page";
import Header from "@/app/shared/Header";
import {createStackNavigator} from "@react-navigation/stack";
import {SafeAreaView} from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack.Navigator
                    screenOptions={{
                        header: ({navigation, route}) => <Header title={route.name}/>,
                    }}
                >
                    <Stack.Screen name="Login" component={LoginPage}/>
                    <Stack.Screen name="Register" component={RegisterPage}/>
                </Stack.Navigator>
            </ThemeProvider>
        </SafeAreaView>
    );
}
