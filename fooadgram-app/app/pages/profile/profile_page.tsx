import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import FGTabBar from '@/app/shared/FGTabBar';
import shared_styles from '@/shared_styles';
import UserProfile from '@/app/shared/profile/user_profile';

const ProfilePage = () => {
    const { userData } = useAppContext();
    const route = useRoute();

    {/* Use the tapped userId if available, otherwise show the signed-in user */}
    const profileId = route.params?.userId ?? userData?.id;

    if (!profileId) {
         {/* Still loading userData or no ID available */}
        return null;
    }

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                <UserProfile profileId={profileId} />
            </ScrollView>
            <FGTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
});

export default ProfilePage;
