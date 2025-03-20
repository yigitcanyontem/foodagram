import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {AuthService} from "@/services/auth-service";
import Toast from "react-native-toast-message";

const AuthInput = ({ label, value, onChangeText, secureTextEntry, placeholder }) => (
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

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
            await AuthService.register({ email, password, username });
            Toast.show({
                type: 'success',
                text1: 'Register successful',
                text2: 'Welcome aboard!',
                position: 'top',
                topOffset: 60,
            });
            setError(null);
            navigation.navigate("Login");
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: "Registration failed. Please try again",
                text2: "Please check your details.",
                position: 'top',
                topOffset: 60,
            });
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Create a new account</Text>
            <AuthInput label="Username" value={username} onChangeText={setUsername} placeholder="Enter your username" />
            <AuthInput label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" />
            <AuthInput label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password" />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.loginText}>
                Already have an account? <Text style={styles.link} onPress={() => navigation.navigate("Login")}>Login here</Text>
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
    loginText: {
        marginTop: 10,
    },
    link: {
        color: "blue",
    },
});

export default RegisterPage;
