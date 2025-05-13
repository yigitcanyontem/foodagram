import {Text, TouchableOpacity, View} from 'react-native';
import {BadgePlus, BookmarkCheck, House, Search, User} from 'lucide-react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useAppContext} from "@/context/AppContext";
import Toast from "react-native-toast-message";

export default function FGTabBar() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { setUserData, userData } = useAppContext()

    // Define your routes
    const routes = [
        {key: 'Home', name: 'Home', icon: House},
        {key: 'Explore', name: 'Explore', icon: Search},
        {key: 'CreatePost', name: 'CreatePost', icon: BadgePlus},
        {key: 'Bookmarked', name: 'Bookmarked', icon: BookmarkCheck},
        {key: 'Profile', name: 'UserProfile', icon: User},
    ];

    // Get the current active index dynamically
    const activeIndex = routes.findIndex(r => r.name === route.name);

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            backgroundColor: '#FAFAFA',
            borderColor: '#8E8E8E',
            borderTopWidth: 0.4,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 50,
        }}>
            {routes.map((route, index) => {
                const isFocused = activeIndex === index;
                const onPress = () => {
                    if (!isFocused) {
                        if (route.name === 'Profile') {
                            navigation.navigate('Profile', { profileId: userData?.id });
                        } else {
                            navigation.navigate(route.name);
                        }
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={{
                            borderRadius: 10,
                            width: 22,
                            height: 22,
                        }}
                    >
                        <route.icon
                            color={isFocused ? '#000000' : '#8E8E8E'}
                            style={{
                                marginBottom: 5,
                                marginTop: 5,
                                marginLeft: 5,
                                marginRight: 5,
                            }}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
