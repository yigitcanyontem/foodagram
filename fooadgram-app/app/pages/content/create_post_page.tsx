import {ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Switch, Platform, Modal, Button} from 'react-native';
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
import {AIService} from "@/services/ai-service";
import { useRef } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';

const visibilityColors = {
    [Visibility.PUBLIC]: {
        active: '#E74C3C',
        inactive: '#FDEDEC'
    },
    [Visibility.PRIVATE]: {
        active: '#8E44AD',
        inactive: '#F5EEF8'
    },
    [Visibility.FOLLOWERS]: {
        active: '#2ECC71',
        inactive: '#EAFAF1'
    }
};


const CreatePostPage = () => {
    const navigation = useNavigation();
    const { setUserData, userData } = useAppContext();
    const [isImageValid, setIsImageValid] = useState(false);
    const [imageId, setImageId] = useState<string | null>(null);
    const { showActionSheetWithOptions } = useActionSheet();


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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [manualFoodName, setManualFoodName] = useState('');
    const foodNameResolver = useRef<(name: string | null) => void>();



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




    const pickFromGallery = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets?.length > 0) {
                await processPickedMedia(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking media:', error);
            setError('Failed to pick media. Please try again.');
        }
    };



    const takePhoto = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets?.length > 0) {
                await processPickedMedia(result.assets[0]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            setError('Failed to take photo. Please try again.');
        }
    };



    const recordVideo = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                quality: 1,
            });

            if (!result.canceled && result.assets?.length > 0) {
                await processPickedMedia(result.assets[0]);
            }
        } catch (error) {
            console.error('Error recording video:', error);
            setError('Failed to record video. Please try again.');
        }
    };


    const handleMediaChoice = () => {
        const options = ['Take Photo', 'Record Video', 'Pick from Gallery', 'Cancel'];
        const cancelButtonIndex = 3;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        takePhoto();
                        break;
                    case 1:
                        recordVideo();
                        break;
                    case 2:
                        pickFromGallery();
                        break;
                }
            }
        );
    };



    const processPickedMedia = async (asset: ImagePickerAsset) => {
        const isVideo = asset.type === 'video';

        try {
            if (isVideo) {
                let predictionResult = await AIService.predictVideo(asset);

                if (predictionResult.approved) {
                    await uploadMedia(asset);
                    const predictionLabel = predictionResult.prediction || "food";
                    setTags(prev => prev ? `${prev}, ${predictionLabel}` : predictionLabel);
                    setIsImageValid(true);
                    Toast.show({
                        type: 'success',
                        text1: "Video uploaded",
                        text2: `Approved video with ${predictionResult.food_percentage} food content.`,
                    });
                } else if (predictionResult.requires_manual_verification) {
                    const foodName = await promptFoodName();
                    if (!foodName) {
                        Toast.show({ type: 'error', text1: "Verification cancelled", text2: "No food name provided." });
                        return;
                    }

                    const verifyResult = await AIService.predictVideoWithFoodName(asset, foodName);
                    if (verifyResult.approved) {
                        await uploadMedia(asset);
                        setTags(prevTags => prevTags ? `${prevTags}, ${verifyResult.prediction}` : verifyResult.prediction);
                        Toast.show({ type: 'success', text1: "Video verified!", text2: verifyResult.reason || "Approved via food name." });
                    } else {
                        Toast.show({ type: 'error', text1: "Video rejected", text2: verifyResult.reason });
                    }
                } else {
                    Toast.show({ type: 'error', text1: "Video rejected", text2: predictionResult.reason || "Low food content." });
                }

                return;
            }

            // IMAGE FLOW
            let predictionResult = await AIService.predict(asset);
            if (predictionResult.image_id) setImageId(predictionResult.image_id);

            if (predictionResult.prediction !== 'no match') {
                setIsImageValid(true);
                await uploadMedia(asset);
                setTags(prevTags => prevTags ? `${prevTags}, ${predictionResult.prediction}` : predictionResult.prediction);
                Toast.show({
                    type: 'info',
                    text1: "Image uploaded and processed",
                    text2: `Detected ${predictionResult.prediction} (${predictionResult.confidence})`,
                    position: 'top',
                    topOffset: 60,
                });
            } else {
                const userProvidedName = await promptFoodName();
                if (!userProvidedName) {
                    Toast.show({ type: 'error', text1: "Upload canceled", text2: "You must enter a food name." });
                    return;
                }

                if (!predictionResult.image_id) {
                    Toast.show({ type: 'error', text1: "Error", text2: "Image ID missing." });
                    return;
                }

                const verifyResult = await AIService.verify(predictionResult.image_id, userProvidedName);
                if (verifyResult.prediction !== 'no match') {
                    setIsImageValid(true);
                    await uploadMedia(asset);
                    setTags(prevTags => prevTags ? `${prevTags}, ${verifyResult.prediction}` : verifyResult.prediction);
                    setIsImageValid(true);
                    Toast.show({ type: 'success', text1: "Image verified and uploaded", text2: verifyResult.reason });
                } else {
                    setIsImageValid(false);
                    Toast.show({ type: 'error', text1: "Verification failed", text2: verifyResult.reason });
                }
            }
        } catch (error) {
            console.error("Error processing media:", error);
            setIsImageValid(false);
        }
    };




    const promptFoodName = (): Promise<string | null> => {
        return new Promise((resolve) => {
            setManualFoodName('');
            setIsModalVisible(true);
            foodNameResolver.current = resolve;
        });
    };

    const handleModalSubmit = () => {
        setIsModalVisible(false);
        if (foodNameResolver.current) {
            foodNameResolver.current(manualFoodName.trim() || null);
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        if (foodNameResolver.current) {
            foodNameResolver.current(null);
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
                    text1: 'Media uploaded successful',
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

            console.log("Prepared postData for submission:", JSON.stringify(postData, null, 2));


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
                    <Text style={styles.label}>Media</Text>
                    <TouchableOpacity
                        style={styles.mediaButton}
                        onPress={handleMediaChoice}
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
                                    visibility === v && {
                                        backgroundColor: visibilityColors[v].active,
                                        borderColor: visibilityColors[v].active,
                                    },
                                    visibility !== v && {
                                        backgroundColor: visibilityColors[v].inactive,
                                        borderColor: visibilityColors[v].inactive,
                                    }
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
                    style={[styles.button, !isImageValid && { backgroundColor: 'gray' }]}
                    onPress={handleSubmit}
                    disabled={isLoading || !isImageValid}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Create Post</Text>
                    )}
                </TouchableOpacity>

                <Modal
                    visible={isModalVisible}
                    transparent
                    animationType="fade"
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '80%',
                                backgroundColor: 'white',
                                padding: 20,
                                borderRadius: 10,
                            }}
                        >
                            <Text style={{ fontSize: 18, marginBottom: 10 }}>
                                Enter Food Name
                            </Text>

                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 5,
                                    padding: 10,
                                    marginBottom: 10,
                                }}
                                placeholder="Type food name"
                                value={manualFoodName}
                                onChangeText={setManualFoodName}
                                autoFocus
                            />

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={handleModalCancel} style={{ marginRight: 10 }}>
                                    <Text style={{ color: 'red' }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleModalSubmit}>
                                    <Text style={{ color: 'blue' }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        paddingTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 25,
        color: "#2C3E50",
        fontFamily: "Roboto-Bold",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: "600",
        color: "#34495E",
        fontFamily: "Roboto-Medium",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ECF0F1",
        padding: 15,
        borderRadius: 12,
        width: "100%",
        backgroundColor: "#FDFDFD",
        fontSize: 16,
        color: "#2C3E50",
        fontFamily: "Roboto-Regular",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    button: {
        backgroundColor: "#E74C3C",
        padding: 18,
        borderRadius: 12,
        alignItems: "center",
        width: "100%",
        marginTop: 20,
        shadowColor: "#E74C3C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "Roboto-Bold",
    },
    errorText: {
        color: "#E74C3C",
        marginBottom: 10,
        textAlign: "center",
        fontFamily: "Roboto-Regular",
    },
    visibilityContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 8,
    },
    visibilityButton: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: '#F8F9FA', // Varsayılan arkaplan
    },
    visibilityButtonActive: {
        borderColor: 'transparent',
    },
    visibilityButtonText: {
        color: "#7F8C8D",
        fontWeight: "500",
    },
    visibilityButtonTextActive: {
        color: "white",
    },
    mediaButton: {
        backgroundColor: "#E74C3C",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    mediaButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
    mediaCount: {
        marginTop: 8,
        fontSize: 13,
        color: "#95A5A6",
        fontStyle: "italic",
    },
    recipeSection: {
        width: "100%",
        marginTop: 15,
        marginBottom: 20,
        borderRadius: 12,
        padding: 15,
        backgroundColor: "#FDFDFD",
        borderColor: "#ECF0F1",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    recipeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ECF0F1",
    },
    recipeTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2C3E50",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    switchLabel: {
        marginRight: 0,
        fontSize: 14,
        color: "#34495E",
        fontWeight: "500",
    },
    ingredientItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#F8F9FA",
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#ECF0F1",
    },
    ingredientText: {
        flex: 1,
        color: "#2C3E50",
        fontSize: 14,
    },
    ingredientForm: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 12,
        gap: 8,
    },
    ingredientInput: {
        width: "32%",
        marginBottom: 0,
    },
    instructionItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "#F8F9FA",
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ECF0F1",
    },
    instructionNumber: {
        width: 30,
        fontSize: 14,
        fontWeight: "700",
        color: "#E74C3C",
    },
    instructionInput: {
        flex: 1,
        marginRight: 10,
        color: "#2C3E50",
    },
    removeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#E74C3C",
        justifyContent: "center",
        alignItems: "center",
    },
    removeButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 20,
    },
    addButton: {
        backgroundColor: "#E74C3C",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        alignSelf: "flex-start",
    },
    addButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
});

export default CreatePostPage;
