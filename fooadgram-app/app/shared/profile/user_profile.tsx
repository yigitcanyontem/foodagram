import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import React, {useEffect} from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {Label} from "@rn-primitives/select";
import PostsSection from "@/app/shared/profile/PostsSection";
import {CookingPot, Grid2X2} from "lucide-react-native";
import RecipesSection from "@/app/shared/profile/RecipesSection";
import {UserService} from "@/services/user-service";
import {useBase64Image} from "@/hooks/useBase64Image";
import {UsersProfileDto} from "@/models/user/UsersProfileDto";
import Toast from "react-native-toast-message";


const UserProfile = ({profileId}) => {
    const navigation = useNavigation();
    const {setUserData, userData} = useAppContext()
    const [chosenSection, setChosenSection] = React.useState('posts');
    const [userProfile, setUserProfile] = React.useState<UsersProfileDto>(null);
    const {getBase64Uri} = useBase64Image();
    const [userIsFollowed, setUserIsFollowed] = React.useState(false);
    const getUserProfile = async () => {
        try {
            const userProfileResponse = await UserService.getUserProfileByUserId(profileId);
            setUserProfile(userProfileResponse);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
        }
    };

    const checkIfUserIsFollowed = async () => {
        try {
            const isFollowed = await UserService.checkIfUserFollows(profileId, userData);
            setUserIsFollowed(isFollowed.data);
        } catch (error) {
            console.error("Failed to check if user is followed", error);
        }
    };

    useEffect(() => {
        if (profileId) {
            getUserProfile();
            checkIfUserIsFollowed();
        }
    }, [profileId]);

    const logout = async () => {
        try {
            setUserData(null);
            navigation.navigate("Login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    const followUser= (usersId: string) => {
        UserService.followUser(usersId, userData).then(
            () => {
                Toast.show({
                    type: 'success',
                    text1: 'Followed user successfully',
                    position: 'bottom',
                    visibilityTime: 2000,
                });
                getUserProfile();
                checkIfUserIsFollowed();
            }
        ).catch(
            (error) => {
                console.error("Failed to follow user", error);
                Toast.show({
                    type: 'error',
                    text1: 'Failed to follow user',
                    position: 'bottom',
                    visibilityTime: 2000,
                });
            }
        )
    }

    const unfollowUser = (usersId: string) => {
        UserService.unfollowUser(usersId, userData).then(
            () => {
                Toast.show({
                    type: 'success',
                    text1: 'Unfollowed user successfully',
                    position: 'bottom',
                    visibilityTime: 2000,
                });
                getUserProfile();
                checkIfUserIsFollowed();
            }
        ).catch(
            (error) => {
                console.error("Failed to unfollow user", error);
                Toast.show({
                    type: 'error',
                    text1: 'Failed to unfollow user',
                    position: 'bottom',
                    visibilityTime: 2000,
                });
            }
        )
    }

    return (
       <>
           {
               userProfile &&
               <>
                   <View style={[shared_styles.column, {flex: 1, marginTop: 20}]}>
                       <View style={[shared_styles.row, shared_styles.paddingH_20]}>
                           <View style={shared_styles.profilePicContainer}>
                               <Image
                                   source={
                                       userProfile?.profilePicture ? { uri: getBase64Uri(userProfile?.profilePicture)}
                                           : require('@/assets/images/dummy-profile.jpeg')
                                   }
                                   style={shared_styles.profilePic}
                               />
                           </View>

                           <View style={[shared_styles.column, {flex: 1}]}>
                               <View style={[shared_styles.row, {marginLeft: 20}]}>
                                   <Label
                                       style={{
                                           fontSize: 15,
                                           fontFamily: 'Poppins',
                                           fontWeight: "medium",
                                           marginBottom: 10
                                       }}>
                                       {userProfile?.username || 'Username'}
                                   </Label>
                               </View>

                               <View
                                   style={[shared_styles.row, {flex: 1, marginLeft: 20, justifyContent: "space-between"}]}>
                                   <TouchableOpacity style={[shared_styles.column, {alignItems: "center"}]}>
                                       <Label
                                           style={{fontSize: 15, fontWeight: "bold"}}>
                                           54
                                       </Label>
                                       <Label
                                           style={{fontSize: 15, fontWeight: "medium"}}>
                                           Posts
                                       </Label>
                                   </TouchableOpacity>
                                   <TouchableOpacity
                                       onPress={() => {
                                           navigation.navigate("ProfileFollowDetails", {
                                               userId: userProfile?.usersId,
                                               preSelectedTab: 'followers'
                                           })
                                       }}

                                       style={[shared_styles.column, {alignItems: "center"}]}>
                                       <Label
                                           style={{fontSize: 15, fontWeight: "bold"}}>
                                           {userProfile?.followersCount || 0}
                                       </Label>
                                       <Label
                                           style={{fontSize: 15, fontWeight: "medium"}}>
                                           Followers
                                       </Label>
                                   </TouchableOpacity>

                                   <TouchableOpacity
                                       onPress={() => {
                                           navigation.navigate("ProfileFollowDetails", {
                                               userId: userProfile?.usersId,
                                               preSelectedTab: 'following'
                                           })
                                       }}
                                       style={[shared_styles.column, {alignItems: "center"}]}>
                                       <Label
                                           style={{fontSize: 15, fontWeight: "bold"}}>
                                           {userProfile?.followingCount || 0}
                                       </Label>
                                       <Label
                                           style={{fontSize: 15, fontWeight: "medium"}}>
                                           Following
                                       </Label>
                                   </TouchableOpacity>
                               </View>
                           </View>
                       </View>

                       <View style={[shared_styles.column, shared_styles.paddingH_20, {marginTop: 20}]}>
                           <Label
                               style={{fontSize: 15, fontFamily: 'Poppins', fontWeight: "medium", marginBottom: 10}}>
                               {userProfile?.firstName ? (userProfile?.firstName + ' ' + userProfile?.lastName) : ''}
                           </Label>
                           <Label
                               style={{fontSize: 15, fontFamily: 'Poppins', fontWeight: "medium", marginBottom: 10}}>
                               {userProfile?.bio || ''}
                           </Label>

                       </View>

                       {
                           userData && (profileId == userData?.id) &&
                           <View style={[shared_styles.row, shared_styles.paddingH_20, {marginTop: 20, gap: 10}]}>
                               <TouchableOpacity style={shared_styles.transparent_button} onPress={() => {
                                   navigation.navigate("EditProfilePage")
                               }}>
                                   <Text style={shared_styles.button_text}>
                                       Edit Profile
                                   </Text>
                               </TouchableOpacity>

                               <TouchableOpacity style={shared_styles.logout_button} onPress={() => {
                                   logout()
                               }}>
                                   <Text style={shared_styles.button_text}>
                                       Logout
                                   </Text>
                               </TouchableOpacity>

                           </View>
                       }

                       {
                           userData && (profileId != userData?.id) && !userIsFollowed &&
                           <View style={[shared_styles.row, shared_styles.paddingH_20, {marginTop: 20, gap: 10}]}>
                               <TouchableOpacity style={shared_styles.transparent_button} onPress={() => {
                                   followUser(userProfile?.usersId)
                               }}>
                                   <Text style={shared_styles.button_text}>
                                       Follow
                                   </Text>
                               </TouchableOpacity>
                           </View>
                       }

                       {
                           userData && (profileId != userData?.id) && userIsFollowed &&
                           <View style={[shared_styles.row, shared_styles.paddingH_20, {marginTop: 20, gap: 10}]}>
                               <TouchableOpacity style={shared_styles.secondary_button} onPress={() => {
                                   unfollowUser(userProfile?.usersId)
                               }}>
                                   <Text style={shared_styles.secondary_button_text}>
                                       Unfollow
                                   </Text>
                               </TouchableOpacity>
                           </View>
                       }

                       <View
                           style={[shared_styles.bottom_border_separator,
                               {
                                   height: 12,
                                   marginTop: 10,
                                   marginBottom: 2,
                               }]}
                       />

                       <View style={[shared_styles.row, shared_styles.paddingH_20, {
                           justifyContent: "space-evenly",
                           alignItems: "center",
                           paddingVertical: 5,
                       }]}>
                           <TouchableOpacity
                               onPress={() => {
                                   setChosenSection('posts');
                               }}
                           >
                               <Grid2X2
                                   width={24}
                                   height={24}
                                   color={chosenSection == 'posts' ? '#000000' : '#8E8E8E'}
                                   style={{
                                       marginBottom: 5,
                                       marginTop: 5,
                                       marginLeft: 5,
                                       marginRight: 5,
                                   }}
                               />
                           </TouchableOpacity>
                           <TouchableOpacity>
                           </TouchableOpacity>
                           <TouchableOpacity
                               onPress={() => {
                                   setChosenSection('recipes');
                               }}
                           >
                               <CookingPot
                                   width={24}
                                   height={24}
                                   color={chosenSection == 'recipes' ? '#000000' : '#8E8E8E'}
                                   style={{
                                       marginBottom: 5,
                                       marginTop: 5,
                                       marginLeft: 5,
                                       marginRight: 5,
                                   }}
                               />
                           </TouchableOpacity>
                       </View>

                       <View
                           style={[shared_styles.bottom_border_separator,
                               {}]}
                       />

                       {
                           chosenSection == 'posts' ?
                               <PostsSection/>
                               :
                               <RecipesSection/>
                       }
                   </View>
               </>
           }

           {
               !userProfile &&
               <View style={[shared_styles.column, {flex: 1, marginTop: 20}]}>
                   <Label
                       style={{fontSize: 15, fontFamily: 'Poppins', fontWeight: "medium", marginBottom: 10}}>
                       Loading...
                   </Label>
               </View>
           }
       </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff"
    }
});

export default UserProfile;
