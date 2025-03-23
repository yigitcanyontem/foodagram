import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {UserService} from "@/services/user-service";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import UserResultCard from "@/app/shared/profile/UserResultCard";
import Toast from "react-native-toast-message";
import FollowerList from "@/app/shared/profile/follower_list";
import FollowingList from "@/app/shared/profile/following_list";
import {useRoute} from "@react-navigation/native";

const ProfileFollowPage = () => {
        const [selectedTab, setSelectedTab] = useState('followers');
        const route = useRoute();
        const {userId, preSelectedTab} = route.params || {};

        useEffect(() => {
            if (preSelectedTab) {
                setSelectedTab(preSelectedTab);
            }
        }, [preSelectedTab]);

        return (
            userId &&
            <View style={shared_styles.body_container}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={shared_styles.column}>
                        <View style={[shared_styles.row, shared_styles.bottom_border_separator]}>
                            <TouchableOpacity
                                style={[shared_styles.row, {flex: 1, justifyContent: 'center'}]}
                                onPress={() => setSelectedTab('followers')}
                            >
                                <Text
                                    style={[shared_styles.text, {fontSize: 18}, selectedTab === 'followers' ? {fontWeight: 'bold'} : {}]}
                                >
                                    Followers
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[shared_styles.row, {flex: 1, justifyContent: 'center', marginBottom: 10}]}
                                onPress={() => setSelectedTab('following')}
                            >
                                <Text
                                    style={[shared_styles.text, {fontSize: 18}, selectedTab === 'following' ? {fontWeight: 'bold'} : {}]}
                                >
                                    Following
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[shared_styles.row, {flex: 1, width: '100%'}]}>
                            {
                                selectedTab === 'followers' ?
                                    <FollowerList userId={userId}/> :
                                    <FollowingList userId={userId}/>
                            }
                        </View>
                    </View>
                </ScrollView>
                <FGTabBar/>
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

export default ProfileFollowPage;
