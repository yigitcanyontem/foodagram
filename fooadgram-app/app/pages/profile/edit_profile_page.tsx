import {Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {UserService} from "@/services/user-service";
import {UsersCompleteDto} from "@/models/user/UsersCompleteDto";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerAsset} from "expo-image-picker/src/ImagePicker.types";
import {useBase64Image} from "@/hooks/useBase64Image";

const EditProfilePage = () => {
    const navigation = useNavigation();
    const {setUserData, userData} = useAppContext()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        city: "",
        country: "",
        website: "",
        jobTitle: "",
        birthDate: new Date(),
        instagramProfile: "",
        facebookProfile: ""
    });
    const [open, setOpen] = useState(false)
    const [userProfile, setUserProfile] = React.useState<UsersCompleteDto>(null);
    const [date, setDate] = useState(new Date())
    const [profilePicture, setProfilePicture] = useState<ImagePickerAsset>(null);
    const {getBase64Uri} = useBase64Image();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await UserService.getLoggedInUser(userData)
                setUserProfile(response);
                setFormData(
                    {
                        firstName: response.profile.firstName,
                        lastName: response.profile.lastName,
                        bio: response.profile.bio,
                        city: response.profile.city,
                        country: response.profile.country,
                        website: response.profile.website,
                        jobTitle: response.profile.jobTitle,
                        birthDate: response.profile.birthDate,
                        instagramProfile: response.profile.instagramProfile,
                        facebookProfile: response.profile.facebookProfile
                    }
                );
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userData]);

    const handleChange = (key, value) => {
        setFormData({...formData, [key]: value});
    };

    const handleProfilePictureChange = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access media library is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0]);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (profilePicture) {
                await UserService.uploadProfilePicture(profilePicture, userData);
            }
            const response = await UserService.updateUserProfile(data, userData);
            navigation.navigate("Profile");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={[shared_styles.profilePicContainer, {
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1
                }]}>
                    <TouchableOpacity
                        onPress={handleProfilePictureChange}
                    >
                        <Image
                            source={
                                profilePicture
                                    ? { uri: profilePicture.uri }  // Show newly selected image
                                    : userProfile?.profile?.profilePicture
                                        ? { uri: getBase64Uri(userProfile.profile.profilePicture) }  // Show saved profile picture
                                        : require('@/assets/images/dummy-profile.jpeg')  // Show default image
                            }
                            style={shared_styles.profilePic}
                        />
                    </TouchableOpacity>
                </View>

                <Text>First Name</Text>
                <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(text) => handleChange("firstName", text)}
                />
                <Text>Last Name</Text>
                <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(text) => handleChange("lastName", text)}
                />
                <Text>Bio</Text>
                <TextInput
                    style={[styles.input, styles.multiline]}
                    value={formData.bio}
                    onChangeText={(text) => handleChange("bio", text)}
                    multiline
                />
                <Text>City</Text>
                <TextInput
                    style={styles.input}
                    value={formData.city}
                    onChangeText={(text) => handleChange("city", text)}
                />
                <Text>Country</Text>
                <TextInput
                    style={styles.input}
                    value={formData.country}
                    onChangeText={(text) => handleChange("country", text)}
                />
                <Text>Website</Text>
                <TextInput
                    style={styles.input}
                    value={formData.website}
                    onChangeText={(text) => handleChange("website", text)}
                />
                <Text>Job Title</Text>
                <TextInput
                    style={styles.input}
                    value={formData.jobTitle}
                    onChangeText={(text) => handleChange("jobTitle", text)}
                />
                <Text>Birth Date</Text>
                <Text>
                    {date.toLocaleDateString()}
                </Text>
                <Button title="Select Date" onPress={() => setOpen(true)} />

                {
                    open && (
                        <RNDateTimePicker
                            value={date}
                            onChange={(_, selectedDate) => {
                                const currentDate = selectedDate || date;
                                setOpen(false);
                                setDate(currentDate);
                                handleChange("birthDate", currentDate)
                            }
                            }
                        />
                    )
                }

                <Text>Instagram Profile</Text>
                <TextInput
                    style={styles.input}
                    value={formData.instagramProfile}
                    onChangeText={(text) => handleChange("instagramProfile", text)}
                />
                <Text>Facebook Profile</Text>
                <TextInput
                    style={styles.input}
                    value={formData.facebookProfile}
                    onChangeText={(text) => handleChange("facebookProfile", text)}
                />
                <Button title="Update Profile" onPress={() => onSubmit(formData)}/>
            </ScrollView>
            <FGTabBar/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    multiline: {
        height: 80,
    },
});

export default EditProfilePage;
