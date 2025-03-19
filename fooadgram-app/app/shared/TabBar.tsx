import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoginPage from "@/app/pages/login_page";
import RegisterPage from "@/app/pages/register_page";
import Header from "@/app/shared/Header";
import { Home, User } from 'lucide-react-native'; // For icons
export default function FGTabBar({ state, descriptors, navigation }) {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            backgroundColor: 'black',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        }}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const onPress = () => {
                    if (!isFocused) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 10,
                            backgroundColor: isFocused ? 'gray' : 'transparent',
                        }}
                    >
                        {route.name === "Login" ? <Home color="white" size={24} /> : <User color="white" size={24} />}
                        <Text style={{ color: 'white', textAlign: 'center' }}>
                            {route.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
