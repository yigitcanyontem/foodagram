import {Text, TouchableOpacity, View} from 'react-native';
import {Home, User} from 'lucide-react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation, useRoute} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import SearchIcon from "@/icons/SearchIcon";
import UserIcon from "@/icons/UserIcon";
import CloseIcon from "@/icons/CloseIcon";
import HomeIcon from "@/icons/HomeIcon";
import CreatePostIcon from "@/icons/CreatePostIcon";
import BookMarkIcon from "@/icons/BookMarkIcon";

export default function FGTabBar() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();

    // Define your routes
    const routes = [
        {key: 'Home', name: 'Home', icon: HomeIcon},
        {key: 'Explore', name: 'Explore', icon: SearchIcon},
        {key: 'CreatePost', name: 'CreatePost', icon: CreatePostIcon},
        {key: 'Bookmarked', name: 'Bookmarked', icon: BookMarkIcon},
        {key: 'Profile', name: 'Profile', icon: UserIcon},
    ];

    // Get the current active index dynamically
    const activeIndex = routes.findIndex(r => r.name === route.name);

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            backgroundColor: '#FFF',
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
                        Toast.show({
                            type: 'info',
                            text1: `Navigating to ${route.name}`,
                            position: 'top',
                            topOffset: 60,
                        });
                        navigation.navigate(route.name);
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
                            color={isFocused ? '#673ab7' : '#8E8E8E'}
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
