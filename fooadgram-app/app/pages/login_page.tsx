import {Animated, ScrollView} from 'react-native';
import {NavigationProp} from "@react-navigation/native";
import {Label} from "@rn-primitives/select";

type LoginPageProps = {
    navigation: NavigationProp<any>;
};

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {AuthService} from "@/services/auth-service";
import Toast from "react-native-toast-message";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";

export const AuthInput = ({ label, value, onChangeText, secureTextEntry, placeholder }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
        />
    </View>
);

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const { setUserData, userData } = useAppContext()

    const handleLogin = async () => {
        try {
            const authResponse = await AuthService.authenticate({ username: email, password });
            setError(null);

            const userData = {
                token: authResponse.accessToken,
                email: authResponse.user.email,
                username: authResponse.user.username,
            };

            await setUserData(userData);

            Toast.show({
                type: 'success',
                text1: 'Login successful',
                text2: 'Welcome ' + userData.username,
                position: 'top',
                topOffset: 60,
            });

            navigation.navigate("Home");
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: "Error while logging in",
                text2: "Please check your credentials.",
                position: 'top',
                topOffset: 60,
            });
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <View style={[shared_styles.body_container, {paddingBottom: 0}]}>
            <ScrollView contentContainerStyle={styles.container} >
                <Text style={styles.title}>Login</Text>
                <Text style={styles.subtitle}>Login to your account</Text>
                <AuthInput label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email"  secureTextEntry={false}/>
                <AuthInput label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password" />
                {error && <Text style={styles.errorText}>{error}</Text>}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.registerText}>
                    Don't have an account? <Text style={styles.link} onPress={() => navigation.navigate("Register")}>Create account</Text>
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        paddingTop: 150,
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

export default LoginPage;
