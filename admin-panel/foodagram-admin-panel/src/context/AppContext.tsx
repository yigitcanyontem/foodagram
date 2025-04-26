import React, { createContext, useContext, useState, useEffect } from "react";
import {UserService} from "../services/user-service.ts";
import { useNavigate } from "react-router-dom";

interface AppContextType {
    userData: any;
    setUserData: (data: any) => void;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUserData = await sessionStorage.getItem("userData");
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                    validateToken(JSON.parse(storedUserData));
                }else {
                    navigate("Login");
                }
            } catch (error) {
                logout();
                navigate("Login");
            }
        };

        loadUserData();
    }, []);

    const validateToken = async (userData: any) => {
        const user = UserService.getLoggedInUser(userData);
        if (!user.username) {
            //TODO: add toast
            logout();
            navigate("Login");
        }else{
            //TODO: add toast
        }
    }
    const updateUserData = async (data: any) => {
        try {
            await sessionStorage.setItem("userData", JSON.stringify(data));
            setUserData(data);
        } catch (error) {
            console.error("Failed to save user data:", error);
        }
    };

    const logout = async () => {
        try {
            await sessionStorage.removeItem("userData");
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
