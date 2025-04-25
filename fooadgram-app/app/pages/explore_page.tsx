import {ScrollView, StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {UserService} from "@/services/user-service";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import {useBase64Image} from "@/hooks/useBase64Image";
import UserResultCard from "@/app/shared/profile/UserResultCard";
import Toast from "react-native-toast-message";

const ExplorePage = () => {
    const navigation = useNavigation();
    const {userData} = useAppContext();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UsersProfileDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const {getBase64Uri} = useBase64Image();

    const handleSearch = async () => {
        try {
            if (query.trim() === '') {
                setResults([]);
                return;
            }

            const profiles = await UserService.searchUserProfiles(query);
            setResults(profiles);
            setError(null);
        } catch (err) {
            setResults([]);
        }
    };

    useEffect(() => {
        handleSearch()
    }, [query]);

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={shared_styles.row}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search users..."
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
                {results.map((profile) => (
                   <UserResultCard
                        key={profile.id}
                        profile={profile}
                    />
                ))}
            </ScrollView>
            <FGTabBar/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginBottom: 15,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    resultText: {
        fontSize: 16,
    },
});

export default ExplorePage;
