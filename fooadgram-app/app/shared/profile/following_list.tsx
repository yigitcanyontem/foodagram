import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {UserService} from "@/services/user-service";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import UserResultCard from "@/app/shared/profile/UserResultCard";
import Toast from "react-native-toast-message";

const FollowingList = ({userId}) => {

        const [profiles, setProfiles] = useState<UsersProfileDto[]>([]);

        const fetchFollowing = async () => {
            try {
                const profiles = await UserService.getUserFollowing(userId);
                setProfiles(profiles);
            } catch (err) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Error while fetching user profiles'
                });
            }
        };

        useEffect(() => {
            fetchFollowing()
        }, [userId]);

        return (
            <View style={[shared_styles.column, {flex: 1, width: '100%'}]}>
                {profiles.map((profile) => (
                    <UserResultCard
                        key={profile.id}
                        profile={profile}
                    />
                ))}
            </View>
        );
    }
;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontFamily: 'Poppins',
        fontSize: 24,
        fontWeight: 'medium',
        marginBottom: 20,
    }
});

export default FollowingList;
