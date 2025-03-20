import { Image, TouchableOpacity, View } from 'react-native';
import shared_styles from "@/shared_styles";

export default function PostsSection() {
    const images = Array.from({ length: 11 }, (_, i) => `https://picsum.photos/200?random=${i + 1}`);

    return (
        <View style={shared_styles.posts_container}>
            {images.map((imageUri, index) => (
                <TouchableOpacity key={index} onPress={() => console.log(`Image ${index + 1} pressed`)}>
                    <Image source={{ uri: imageUri }} style={shared_styles.post_image} />
                </TouchableOpacity>
            ))}
        </View>
    );
}
