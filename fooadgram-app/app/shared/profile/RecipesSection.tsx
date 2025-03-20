import { Image, TouchableOpacity, View } from 'react-native';
import shared_styles from "@/shared_styles";
import {Label} from "@rn-primitives/select";

export default function RecipesSection() {
    const images = Array.from({ length: 11 }, (_, i) => `https://picsum.photos/200?random=${i + 1}`);

    return (
        <View style={shared_styles.recipes_container}>
            {images.map((imageUri, index) => (
                <View style={shared_styles.recipe_container} key={`Recipe-${index}`}>
                    <TouchableOpacity key={index} onPress={() => console.log(`Image ${index + 1} pressed`)}>
                        <Image source={{ uri: imageUri }} style={shared_styles.recipe_image} />
                    </TouchableOpacity>
                    <View style={[shared_styles.column, {flex: 1}]}>
                        <Label
                            style={{
                                fontSize: 15,
                                fontFamily: 'Poppins',
                                fontWeight: "medium",
                                marginBottom: 10
                            }}>
                            Recipe {index + 1}
                        </Label>
                        <View style={[shared_styles.row, {flex: 1, gap: 10}]}>
                            <Label
                                style={{fontSize: 15, fontWeight: "bold"}}>
                                54
                            </Label>
                            <Label
                                style={{fontSize: 15, fontWeight: "medium"}}>
                                Likes
                            </Label>
                            <Label
                                style={{fontSize: 15, fontWeight: "bold"}}>
                                834
                            </Label>
                            <Label
                                style={{fontSize: 15, fontWeight: "medium"}}>
                                Comments
                            </Label>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}
