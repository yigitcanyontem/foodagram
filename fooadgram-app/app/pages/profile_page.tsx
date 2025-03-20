import {Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React from "react";
import {useAppContext} from "@/context/AppContext";
import FGTabBar from "@/app/shared/FGTabBar";
import shared_styles from "@/shared_styles";
import {Label, Separator} from "@rn-primitives/select";
import PostsSection from "@/app/shared/profile/PostsSection";
import {CookingPot, Grid2X2} from "lucide-react-native";
import RecipesSection from "@/app/shared/profile/RecipesSection";


const ProfilePage = () => {
    const navigation = useNavigation();
    const {setUserData, userData} = useAppContext()
    const [chosenSection, setChosenSection] = React.useState('posts');

    return (
        <View style={shared_styles.body_container}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={[shared_styles.column, {flex: 1, marginTop: 20}]}>
                    <View style={[shared_styles.row, shared_styles.paddingH_20]}>
                        <View style={shared_styles.profilePicContainer}>
                            <Image
                                source={{uri: 'https://yigitcanyontem.github.io/static/media/profile_pic_new.b19522920f58b549fdcd.jpg'}}
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
                                    Yigit Can Yontem
                                </Label>
                            </View>

                            <View
                                style={[shared_styles.row, {flex: 1, marginLeft: 20, justifyContent: "space-between"}]}>
                                <View style={[shared_styles.column, {alignItems: "center"}]}>
                                    <Label
                                        style={{fontSize: 15, fontWeight: "bold"}}>
                                        54
                                    </Label>
                                    <Label
                                        style={{fontSize: 15, fontWeight: "medium"}}>
                                        Posts
                                    </Label>
                                </View>
                                <View style={[shared_styles.column, {alignItems: "center"}]}>
                                    <Label
                                        style={{fontSize: 15, fontWeight: "bold"}}>
                                        834
                                    </Label>
                                    <Label
                                        style={{fontSize: 15, fontWeight: "medium"}}>
                                        Followers
                                    </Label>
                                </View>

                                <View style={[shared_styles.column, {alignItems: "center"}]}>
                                    <Label
                                        style={{fontSize: 15, fontWeight: "bold"}}>
                                        162
                                    </Label>
                                    <Label
                                        style={{fontSize: 15, fontWeight: "medium"}}>
                                        Following
                                    </Label>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={[shared_styles.row, shared_styles.paddingH_20, {marginTop: 20}]}>
                        <Label
                            style={{fontSize: 15, fontFamily: 'Poppins', fontWeight: "medium", marginBottom: 10}}>
                            DŞ' 21 - ABU CENG
                        </Label>
                    </View>

                    <View style={[shared_styles.row, shared_styles.paddingH_20, {marginTop: 20}]}>
                        <TouchableOpacity style={shared_styles.transparent_button} onPress={() => {
                            navigation.navigate("EditProfilePage")
                        }}>
                            <Text style={shared_styles.button_text}>
                                Edit Profile
                            </Text>
                        </TouchableOpacity>
                    </View>

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
                            {
                            }]}
                    />

                    {
                        chosenSection == 'posts' ?
                            <PostsSection/>
                            :
                            <RecipesSection/>
                    }
                </View>

            </ScrollView>
            <FGTabBar/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff"
    }
});

export default ProfilePage;
