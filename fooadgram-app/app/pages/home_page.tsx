// fooadgram-app/app/pages/home_page.tsx
import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import FeedList from '../../components/FeedList';
import FGTabBar from '@/app/shared/FGTabBar';
import { useAppContext } from '@/context/AppContext';

const HomePage = () => {
    const { userData } = useAppContext();

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <StatusBar barStyle="light-content" />

            {/* main content fills available space */}
            <View style={{ flex: 1 }}>
                <FeedList user={userData} />
            </View>

            {/* tab-bar always at bottom */}
            <FGTabBar />

        </SafeAreaView>
    );
};

export default HomePage;
