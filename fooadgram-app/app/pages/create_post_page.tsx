import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";


const CreatePostPage = () => {
    const navigation = useNavigation();
    const { setUserData, userData } = useAppContext()

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container} >

            </ScrollView>
            <FGTabBar/>
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

export default CreatePostPage;
