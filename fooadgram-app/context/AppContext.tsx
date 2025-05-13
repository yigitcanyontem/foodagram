import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import {UserService} from "@/services/user-service";

interface AppContextType {
    userData: any;
    setUserData: (data: any) => void;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<any>(null);
    const navigation = useNavigation();
    // Load user data from AsyncStorage when the app starts
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem("userData");
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                    validateToken(JSON.parse(storedUserData));
                }else {
                }
            } catch (error) {
                logout();
            }
        };

        loadUserData();
    }, []);

    const validateToken = async (userData: any) => {
        const user = UserService.getLoggedInUser(userData);
        if (!user.username) {
            Toast.show({
                type: "error",
                text1: "Session expired",
                text2: "Please login again.",
                position: "bottom",
            })
            logout();
        }else{
            Toast.show({
                type: "success",
                text1: "Session valid",
                text2: "Welcome back!" + user.username,
                position: "bottom",
            })
        }
    }
    // Function to update user data and store it in AsyncStorage
    const updateUserData = async (data: any) => {
        try {
            await AsyncStorage.setItem("userData", JSON.stringify(data));
            setUserData(data);
        } catch (error) {
            console.error("Failed to save user data:", error);
        }
    };

    // Function to log out the user
    const logout = async () => {
        try {
            await AsyncStorage.removeItem("userData");
            setUserData(null);
        } catch (error) {
            console.error("Failed to remove user data:", error);
        }
    };

    return (
        <AppContext.Provider value={{ userData, setUserData: updateUserData, logout }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
