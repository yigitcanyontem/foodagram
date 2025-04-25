import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { AuthService } from "@/services/auth-service";
import Toast from "react-native-toast-message";
import { useAppContext } from "@/context/AppContext";
import shared_styles from "@/shared_styles";

type LoginPageProps = {
    navigation: NavigationProp<any>;
};

const AuthInput = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    placeholder,
    keyboardType,
}) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            keyboardType={keyboardType}
        />
    </View>
);

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const { setUserData } = useAppContext();

    const handleLogin = async () => {
        try {
            const authResponse = await AuthService.authenticate({
                username: email,
                password,
            });
            setError(null);

            const userData = {
                token: authResponse.accessToken,
                email: authResponse.user.email,
                username: authResponse.user.username,
                id: authResponse.user.id,
            };

            await setUserData(userData);

            Toast.show({
                type: "success",
                text1: "Login Successful",
                text2: "Welcome " + userData.username,
                position: "top",
                topOffset: 60,
            });

            navigation.navigate("Home");
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Login Failed",
                text2: "Please check your information",
                position: "top",
                topOffset: 60,
            });
            setError("Login failed. Please check your information.");
        }
    };

    return (
        <KeyboardAvoidingView style={[shared_styles.body_container, { paddingTop:0 }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    >
                        <Image
                            source={require("@/assets/images/knife-logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Text style={styles.title}>Login</Text>
                        <Text style={styles.subtitle}>Access your account</Text>

                        <AuthInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email address"
                            secureTextEntry={false}
                            keyboardType="email-address"
                        />

                        <AuthInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry={true}
                        />

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                                <Text style={styles.registerLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 30,
        backgroundColor: "#fff",
        paddingTop: 30,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 25,
        tintColor: "#E74C3C",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#2C3E50",
        marginBottom: 8,
        fontFamily: "Roboto-Bold",
    },
    subtitle: {
        fontSize: 16,
        color: "#7F8C8D",
        marginBottom: 30,
        fontFamily: "Roboto-Regular",
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
        fontFamily: "Roboto-Medium",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ECF0F1",
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#FDFDFD",
        fontSize: 16,
        color: "#2C3E50",
        fontFamily: "Roboto-Regular",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    button: {
        backgroundColor: "#E74C3C",
        padding: 16,
        borderRadius: 10,
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
        fontFamily: "Roboto-Bold",
    },
    errorText: {
        color: "#E74C3C",
        marginBottom: 10,
        textAlign: "center",
        fontFamily: "Roboto-Regular",
    },
    registerContainer: {
        flexDirection: "row",
        marginTop: 25,
        alignItems: "center",
    },
    registerText: {
        color: "#95A5A6",
        fontSize: 15,
        fontFamily: "Roboto-Regular",
    },
    registerLink: {
        color: "#E74C3C",
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "Roboto-Bold",
    },
});

export default LoginPage;
