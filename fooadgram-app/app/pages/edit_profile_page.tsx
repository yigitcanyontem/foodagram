import {Text, Button, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {UserService} from "@/services/user-service";
import {UsersProfileUpdateDto} from "@/models/user/UsersProfileUpdateDto";

const EditProfilePage = () => {
    const navigation = useNavigation();
    const {setUserData, userData} = useAppContext()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        profilePictureUrl: "",
        bio: "",
        city: "",
        country: "",
        website: "",
        jobTitle: "",
        birthDate: new Date(),
        instagramProfile: "",
        facebookProfile: ""
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await UserService.getLoggedInUser(userData)
                setFormData(
                    {
                        firstName: response.profile.firstName,
                        lastName: response.profile.lastName,
                        profilePictureUrl: response.profile.profilePictureUrl,
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

    const onSubmit = async (data) => {
        try {
            const response = await UserService.updateUserProfile(data, userData);
            setUserData(response);
            navigation.navigate("Profile");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
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
                <Text>Profile Picture URL</Text>
                <TextInput
                    style={styles.input}
                    value={formData.profilePictureUrl}
                    onChangeText={(text) => handleChange("profilePictureUrl", text)}
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
                <Button title="Select Date" onPress={() => setShowDatePicker(true)} />

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
                <Button title="Update Profile" onPress={() => onSubmit(formData)} />
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
