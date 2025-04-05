import {ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Switch} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React, {useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {ContentService} from "@/services/content-service";
import {PostCreateDto} from "@/models/content/dto/PostCreateDto";
import {Visibility} from "@/models/content/enums/Visibility";
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerAsset} from "expo-image-picker/src/ImagePicker.types";
import {RecipeCreateDto} from "@/models/content/dto/RecipeCreateDto";
import {IngredientCreateDto} from "@/models/content/dto/IngredientCreateDto";
import Toast from "react-native-toast-message";

const CreatePostPage = () => {
    const navigation = useNavigation();
    const { setUserData, userData } = useAppContext();

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [location, setLocation] = useState('');
    const [prepTime, setPreptime] = useState('');
    const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC);
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Recipe state
    const [includeRecipe, setIncludeRecipe] = useState(false);
    const [recipeTitle, setRecipeTitle] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [ingredients, setIngredients] = useState<IngredientCreateDto[]>([]);
    const [instructions, setInstructions] = useState<string[]>(['']);
    const [difficulty, setDifficulty] = useState('');
    const [cuisine, setCuisine] = useState('');

    // Ingredient form state
    const [ingredientName, setIngredientName] = useState('');
    const [ingredientAmount, setIngredientAmount] = useState('');
    const [ingredientUnit, setIngredientUnit] = useState('');

    // Handle image picker
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                await uploadMedia(asset);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            setError('Failed to pick image. Please try again.');
        }
    };

    // Upload media
    const uploadMedia = async (file: ImagePickerAsset) => {
        try {
            setIsLoading(true);
            const response = await ContentService.uploadMedia(file, userData);
            if (response.data) {
                Toast.show({
                    type: 'success',
                    text1: 'Media uplaoded successful',
                    text2: response.data,
                    position: 'top',
                    topOffset: 60,
                });
                setMediaUrls([...mediaUrls, response.data]);
            }
        } catch (error) {
            console.error('Error uploading media:', error);
            setError('Failed to upload media. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Add ingredient
    const addIngredient = () => {
        if (!ingredientName.trim() || !ingredientAmount.trim() || !ingredientUnit.trim()) {
            setError('Ingredient name, amount, and unit are required');
            return;
        }

        const newIngredient: IngredientCreateDto = {
            name: ingredientName.trim(),
            amount: parseFloat(ingredientAmount),
            unit: ingredientUnit.trim()
        };

        setIngredients([...ingredients, newIngredient]);

        // Reset form
        setIngredientName('');
        setIngredientAmount('');
        setIngredientUnit('');
    };

    // Remove ingredient
    const removeIngredient = (index: number) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
    };

    // Add instruction
    const addInstruction = () => {
        setInstructions([...instructions, '']);
    };

    // Update instruction
    const updateInstruction = (index: number, value: string) => {
        const updatedInstructions = [...instructions];
        updatedInstructions[index] = value;
        setInstructions(updatedInstructions);
    };

    // Remove instruction
    const removeInstruction = (index: number) => {
        if (instructions.length > 1) {
            const updatedInstructions = [...instructions];
            updatedInstructions.splice(index, 1);
            setInstructions(updatedInstructions);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            // Validate form
            if (!title.trim()) {
                setError('Title is required');
                return;
            }
            if (!content.trim()) {
                setError('Content is required');
                return;
            }

            // Validate recipe if included
            if (includeRecipe) {
                if (!recipeTitle.trim()) {
                    setError('Recipe title is required');
                    return;
                }
                if (!recipeDescription.trim()) {
                    setError('Recipe description is required');
                    return;
                }
                if (ingredients.length === 0) {
                    setError('At least one ingredient is required');
                    return;
                }
                if (instructions.length === 0 || instructions.every(i => !i.trim())) {
                    setError('At least one instruction is required');
                    return;
                }
                if (!difficulty.trim()) {
                    setError('Difficulty is required');
                    return;
                }
                if (!cuisine.trim()) {
                    setError('Cuisine is required');
                    return;
                }
            }

            setIsLoading(true);
            setError('');

            // Prepare data
            const postData: PostCreateDto = {
                title: title.trim(),
                content: content.trim(),
                visibility: visibility,
                mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
                tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : undefined,
                location: location.trim() || undefined,
            };

            // Add recipe if included
            if (includeRecipe) {
                const recipeData: RecipeCreateDto = {
                    title: recipeTitle.trim(),
                    description: recipeDescription.trim(),
                    ingredients: ingredients,
                    instructions: instructions.filter(i => i.trim()),
                    prepTime: prepTime ? parseInt(prepTime) : 0,
                    difficultyLevel: difficulty.trim(),
                    cuisineType: cuisine.trim(),
                };

                postData.recipe = recipeData;
            }

            // Create post
            const response = await ContentService.createPost(postData, userData);

            // Navigate back or to the post detail page
            Alert.alert('Success', 'Post created successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Create New Post</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter post title"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Content *</Text>
                    <TextInput
                        style={[styles.input, {height: 150, textAlignVertical: 'top'}]}
                        value={content}
                        onChangeText={setContent}
                        placeholder="Enter post content"
                        multiline
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Tags (comma separated)</Text>
                    <TextInput
                        style={styles.input}
                        value={tags}
                        onChangeText={setTags}
                        placeholder="e.g. food, recipe, cooking"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Location</Text>
                    <TextInput
                        style={styles.input}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Enter location"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Visibility</Text>
                    <View style={styles.visibilityContainer}>
                        {Object.values(Visibility).map((v) => (
                            <TouchableOpacity
                                key={v}
                                style={[
                                    styles.visibilityButton,
                                    visibility === v && styles.visibilityButtonActive
                                ]}
                                onPress={() => setVisibility(v)}
                            >
                                <Text style={[
                                    styles.visibilityButtonText,
                                    visibility === v && styles.visibilityButtonTextActive
                                ]}>
                                    {v}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Media</Text>
                    <TouchableOpacity
                        style={styles.mediaButton}
                        onPress={pickImage}
                        disabled={isLoading}
                    >
                        <Text style={styles.mediaButtonText}>Add Media</Text>
                    </TouchableOpacity>
                    {mediaUrls.length > 0 && (
                        <Text style={styles.mediaCount}>
                            {mediaUrls.length} media item(s) attached
                        </Text>
                    )}
                </View>

                {/* Recipe Section */}
                <View style={styles.recipeSection}>
                    <View style={styles.recipeHeader}>
                        <Text style={styles.recipeTitle}>Recipe</Text>
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Include Recipe</Text>
                            <Switch
                                value={includeRecipe}
                                onValueChange={setIncludeRecipe}
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={includeRecipe ? "#007bff" : "#f4f3f4"}
                            />
                        </View>
                    </View>

                    {includeRecipe && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Recipe Title *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={recipeTitle}
                                    onChangeText={setRecipeTitle}
                                    placeholder="Enter recipe title"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Recipe Description *</Text>
                                <TextInput
                                    style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
                                    value={recipeDescription}
                                    onChangeText={setRecipeDescription}
                                    placeholder="Enter recipe description"
                                    multiline
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Ingredients *</Text>
                                {ingredients.map((ingredient, index) => (
                                    <View key={index} style={styles.ingredientItem}>
                                        <Text style={styles.ingredientText}>
                                            {ingredient.name} - {ingredient.amount} {ingredient.unit}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => removeIngredient(index)}
                                            style={styles.removeButton}
                                        >
                                            <Text style={styles.removeButtonText}>×</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <View style={styles.ingredientForm}>
                                    <TextInput
                                        style={[styles.input, styles.ingredientInput]}
                                        value={ingredientName}
                                        onChangeText={setIngredientName}
                                        placeholder="Name"
                                    />
                                    <TextInput
                                        style={[styles.input, styles.ingredientInput]}
                                        value={ingredientAmount}
                                        onChangeText={setIngredientAmount}
                                        placeholder="Amount"
                                        keyboardType="numeric"
                                    />
                                    <TextInput
                                        style={[styles.input, styles.ingredientInput]}
                                        value={ingredientUnit}
                                        onChangeText={setIngredientUnit}
                                        placeholder="Unit"
                                    />
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={addIngredient}
                                    >
                                        <Text style={styles.addButtonText}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Instructions *</Text>
                                {instructions.map((instruction, index) => (
                                    <View key={index} style={styles.instructionItem}>
                                        <Text style={styles.instructionNumber}>{index + 1}.</Text>
                                        <TextInput
                                            style={[styles.input, styles.instructionInput]}
                                            value={instruction}
                                            onChangeText={(text) => updateInstruction(index, text)}
                                            placeholder={`Step ${index + 1}`}
                                        />
                                        <TouchableOpacity
                                            onPress={() => removeInstruction(index)}
                                            style={styles.removeButton}
                                            disabled={instructions.length === 1}
                                        >
                                            <Text style={styles.removeButtonText}>×</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={addInstruction}
                                >
                                    <Text style={styles.addButtonText}>Add Step</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Difficulty *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={difficulty}
                                    onChangeText={setDifficulty}
                                    placeholder="e.g. Easy, Medium, Hard"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Cuisine *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={cuisine}
                                    onChangeText={setCuisine}
                                    placeholder="e.g. Italian, Mexican, Asian"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Preparation Time (minutes)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={prepTime}
                                    onChangeText={setPreptime}
                                    placeholder="Enter preparation time"
                                    keyboardType="numeric"
                                />
                            </View>

                        </>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Create Post</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
            <FGTabBar/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        width: "100%",
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        width: "100%",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
    registerText: {
        marginTop: 10,
    },
    link: {
        color: "blue",
    },
    visibilityContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    visibilityButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: "center",
    },
    visibilityButtonActive: {
        backgroundColor: "#007bff",
        borderColor: "#007bff",
    },
    visibilityButtonText: {
        color: "#333",
    },
    visibilityButtonTextActive: {
        color: "white",
    },
    mediaButton: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 5,
    },
    mediaButtonText: {
        color: "#333",
        fontWeight: "500",
    },
    mediaCount: {
        marginTop: 5,
        fontSize: 12,
        color: "#666",
    },
    recipeSection: {
        width: "100%",
        marginTop: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 15,
    },
    recipeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    switchLabel: {
        marginRight: 10,
        fontSize: 14,
    },
    ingredientItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        marginBottom: 5,
    },
    ingredientText: {
        flex: 1,
    },
    ingredientForm: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 10,
    },
    ingredientInput: {
        width: "23%",
        marginBottom: 5,
    },
    instructionItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    instructionNumber: {
        width: 30,
        fontSize: 16,
        fontWeight: "bold",
    },
    instructionInput: {
        flex: 1,
        marginRight: 10,
    },
    removeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#ff6b6b",
        justifyContent: "center",
        alignItems: "center",
    },
    removeButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    addButton: {
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default CreatePostPage;
