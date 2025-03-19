import {Animated} from 'react-native';
import {NavigationProp} from "@react-navigation/native";
import {Label} from "@rn-primitives/select";

type LoginPageProps = {
    navigation: NavigationProp<any>;
};

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {AuthService} from "@/services/auth-service";

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
    // const { toast } = useToast();

    const handleLogin = async () => {
        try {
            await AuthService.authenticate({ username: email, password });
            // toast({ title: "Login successful" });
            setError(null);
            navigation.navigate("Home");
        } catch (err) {
            console.error(err);
            // toast({ title: "Error while logging in" });
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Login to your account</Text>
            <AuthInput label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" />
            <AuthInput label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password" />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.link} onPress={() => navigation.navigate("Register")}>Create account</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
