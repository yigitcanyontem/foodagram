import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import shared_styles from "@/shared_styles";
import {useNavigation} from "@react-navigation/native";
import React from "react";
import {useBase64Image} from "@/hooks/useBase64Image";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import {GlobalConstants} from "@/utils/GlobalConstants";

export default function UserResultCard({profile}: { profile: UsersProfileDto }) {
    const navigation = useNavigation();
    const {getBase64Uri} = useBase64Image();

    return (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => navigation.navigate('Profile', {userId: profile.usersId})} key={profile.id}>
            <Image
                source={
                    profile?.profilePicture ? { uri: GlobalConstants.s3Url + profile?.profilePicture}
                        : require('@/assets/images/dummy-profile.jpeg')
                }
                style={{width: 50, height: 50, borderRadius: 25}}
            />
            <View style={shared_styles.column}>
                <View>
                    <Text style={styles.resultText}>{profile.username}</Text>
                </View>
                {
                    profile.firstName && profile.lastName &&
                    <View>
                        <Text style={styles.name}>{`${profile.firstName} ${profile.lastName}`}</Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
    );
}

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
        gap: 10,
        flex: 1
    },
    resultText: {
        fontSize: 16,
    },
    name: {
        fontSize: 14,
        color: "#555",
    }
});

