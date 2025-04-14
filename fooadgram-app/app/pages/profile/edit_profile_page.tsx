import {Button,Image,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View} from 'react-native';
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
import {GlobalConstants} from "@/utils/GlobalConstants";

//Global form for boxes
const FormInput = ({ label, value, onChangeText, multiline = false }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.input, multiline && styles.multiline]}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
        />
    </View>
);

const EditProfilePage = () => {
    const navigation = useNavigation();
    const {setUserData, userData} = useAppContext();
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
    const [open, setOpen] = useState(false);
    const [userProfile, setUserProfile] = React.useState<UsersCompleteDto>(null);
    const [date, setDate] = useState(new Date());
    const [profilePicture, setProfilePicture] = useState<ImagePickerAsset>(null);
    const {getBase64Uri} = useBase64Image();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await UserService.getLoggedInUser(userData);
                setUserProfile(response);
                setFormData({
                    firstName: response.profile.firstName,
                    lastName: response.profile.lastName,
                    bio: response.profile.bio,
                    city: response.profile.city,
                    country: response.profile.country,
                    website: response.profile.website,
                    jobTitle: response.profile.jobTitle,
                    birthDate: new Date(response.profile.birthDate),
                    instagramProfile: response.profile.instagramProfile,
                    facebookProfile: response.profile.facebookProfile
                });
                setDate(new Date(response.profile.birthDate));//**date update
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

    const onSubmit = async () => {
        try {
            if (profilePicture) {
                await UserService.uploadProfilePicture(profilePicture, userData);
            }
            await UserService.updateUserProfile(formData, userData);
            navigation.navigate("Profile");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={handleProfilePictureChange}>
                    <Image
                        source={
                            profilePicture
                                ? { uri: profilePicture.uri } // Show newly selected image
                                : userProfile?.profile?.profilePicture
                                    ? { uri: GlobalConstants.s3Url + userProfile.profile.profilePicture }// Show saved profile picture
                                    : require('@/assets/images/dummy-profile.jpeg')// Show default image
                        }
                        style={styles.profilePic}
                    />
                </TouchableOpacity>

                <FormInput label="First Name" value={formData.firstName} onChangeText={(text) => handleChange("firstName", text)} />
                <FormInput label="Last Name" value={formData.lastName} onChangeText={(text) => handleChange("lastName", text)} />
                <FormInput label="Bio" value={formData.bio} onChangeText={(text) => handleChange("bio", text)} multiline />
                <FormInput label="City" value={formData.city} onChangeText={(text) => handleChange("city", text)} />
                <FormInput label="Country" value={formData.country} onChangeText={(text) => handleChange("country", text)} />
                <FormInput label="Website" value={formData.website} onChangeText={(text) => handleChange("website", text)} />
                <FormInput label="Job Title" value={formData.jobTitle} onChangeText={(text) => handleChange("jobTitle", text)} />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Birth Date</Text>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {open && (
                        <RNDateTimePicker
                            value={date}
                            onChange={(_, selectedDate) => {
                                const currentDate = selectedDate || date;
                                setOpen(false);
                                setDate(currentDate);
                                handleChange("birthDate", currentDate);
                            }}
                        />
                    )}
                </View>

                <FormInput label="Instagram Profile" value={formData.instagramProfile} onChangeText={(text) => handleChange("instagramProfile", text)} />
                <FormInput label="Facebook Profile" value={formData.facebookProfile} onChangeText={(text) => handleChange("facebookProfile", text)} />

                <TouchableOpacity style={styles.button} onPress={onSubmit}>
                    <Text style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity>
            </ScrollView>
            <FGTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 30,
        backgroundColor: "#fff",
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: "#2C3E50",
        marginBottom: 8,
        fontWeight: "500",
        fontFamily: 'Roboto-Medium',
    },
    input: {
        borderWidth: 1,
        borderColor: "#ECF0F1",
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#FDFDFD",
        fontSize: 16,
        color: "#2C3E50",
        fontFamily: 'Roboto-Regular',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    multiline: {
        height: 100,
        textAlignVertical: "top"
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: "center",
        marginBottom: 30,
    },
    dateText: {
        fontSize: 16,
        color: "#2C3E50",
        fontFamily: 'Roboto-Regular',
    },
    button: {
        backgroundColor: "#E74C3C",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#E74C3C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        fontFamily: 'Roboto-Bold',
    },
});

export default EditProfilePage;
