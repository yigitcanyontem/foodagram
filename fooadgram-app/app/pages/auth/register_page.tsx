import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "@/services/auth-service";
import Toast from "react-native-toast-message";
import shared_styles from "@/shared_styles";
import { useAppContext } from "@/context/AppContext";


const AuthInput = ({
                       label,
                       value,
                       onChangeText,
                       placeholder,
                       secureTextEntry = false,
                       onFocus,
                       onBlur,
                   }) => (
    <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            onFocus={onFocus}
            onBlur={onBlur}
        />
    </View>
);

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(null);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const navigation = useNavigation();
    const { setUserData } = useAppContext();

    const handleRegister = async () => {
        try {
            const authResponse = await AuthService.register({
                email,
                password,
                username,
            });

            const userData = {
                token: authResponse.accessToken,
                email: authResponse.user.email,
                username: authResponse.user.username,
                id: authResponse.user.id,
            };

            await setUserData(userData);

            Toast.show({
                type: "success",
                text1: "Register successful",
                text2: "Welcome aboard!",
                position: "top",
                topOffset: 60,
            });
            setError(null);
            navigation.navigate("Home");
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Registration failed. Please try again",
                text2: "Please check your details.",
                position: "top",
                topOffset: 60,
            });
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <View style={[shared_styles.body_container, { paddingBottom: 0 }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <Image
                    source={require("@/assets/images/knife-logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join our community</Text>

                <AuthInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                />
                <AuthInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                />
                <AuthInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                />
                {isPasswordFocused && (
                    <Text style={styles.passwordHint}>
                        Min 8 characters, 1 uppercase, 1 number, 1 special char
                    </Text>
                )}

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.loginLink}>Login here</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 30,
        backgroundColor: "#fff",
        paddingTop: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 30,
        tintColor: "#E74C3C",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2C3E50",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "#7F8C8D",
        marginBottom: 30,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: "#2C3E50",
        marginBottom: 8,
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ECF0F1",
        padding: 15,
        borderRadius: 8,
        backgroundColor: "#F9F9F9",
        fontSize: 16,
        color: "#2C3E50",
    },
    passwordHint: {
        fontSize: 12,
        color: "#BDC3C7",
        alignSelf: "flex-start",
        marginBottom: 10,
        marginTop: -15,
    },
    button: {
        backgroundColor: "#E74C3C",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
        marginTop: 20,
        shadowColor: "#E74C3C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    errorText: {
        color: "#E74C3C",
        marginBottom: 10,
        textAlign: "center",
    },
    loginContainer: {
        flexDirection: "row",
        marginTop: 25,
        alignItems: "center",
    },
    loginText: {
        color: "#95A5A6",
        fontSize: 15,
    },
    loginLink: {
        color: "#E74C3C",
        fontSize: 15,
        fontWeight: "600",
    },
});

export default RegisterPage;
