import { Image, TouchableOpacity, View } from 'react-native';
import shared_styles from "@/shared_styles";
import {useNavigation} from "@react-navigation/native";

export default function PostsSection() {
    const images = Array.from({ length: 11 }, (_, i) => `https://picsum.photos/200?random=${i + 1}`);
    const navigation = useNavigation();

    return (
        <View style={shared_styles.posts_container}>
            {images.map((imageUri, index) => (
                <TouchableOpacity key={index} onPress={() => navigation.navigate('PostDetail', { postId: index })}>
                    <Image source={{ uri: imageUri }} style={shared_styles.post_image} />
                </TouchableOpacity>
            ))}
        </View>
    );
}
