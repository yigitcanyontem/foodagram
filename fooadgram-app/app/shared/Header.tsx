// components/CustomHeader.js
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HeartIcon, MessageSquareIcon} from "lucide-react-native";
import NotificationIcon from "@/icons/NotificationIcon";
import MessageIcon from "@/icons/MessageIcon";
import {NotificationService} from "@/services/notification-service";
import {useAppContext} from "@/context/AppContext";
import Toast from "react-native-toast-message";

export default function Header({title}) {
    const navigation = useNavigation();
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
    const {setUserData, userData} = useAppContext()

    const getUnreadNotificationsCount = () => {
        if (userData) {
            NotificationService.getUnreadNotificationCount(userData)
                .then((response) => {
                    if (response.data != unreadNotificationsCount){
                        setUnreadNotificationsCount(response.data);
                    }
                })
                .catch((error) => {
                    console.log('Error fetching unread notifications count:', error);
                });
        }
    }

    useEffect(() => {
        getUnreadNotificationsCount()
    }, [userData])


    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.logo_container}>
                <Image source={require('../../assets/images/foodagram_logo.png')} style={{width: 30, height: 30}}/>
                <Text style={styles.title}>
                    Foodagram
                </Text>
            </TouchableOpacity>

            {
                userData &&
                <View style={[styles.row, {gap: 20}]}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Notifications');
                        }}
                    >
                        <NotificationIcon fill={'#8E8E8E'} width={25} height={25}/>
                        {
                            unreadNotificationsCount > 0 &&
                            <View style={{
                                position: 'absolute',
                                top: -5,
                                right: -5,
                                backgroundColor: '#FF3D00',
                                borderRadius: 10,
                                width: 20,
                                height: 20,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{color: 'white', fontSize: 12}}>{unreadNotificationsCount}</Text>
                            </View>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Chats');
                        }}
                    >
                        <MessageIcon fill={'#8E8E8E'} width={25} height={25}/>

                    </TouchableOpacity>

                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        paddingVertical: 5,
        borderBottomWidth: 0.4,
        borderBottomColor: '#8E8E8E'
    },
    backButton: {
        padding: 8,
    },
    backText: {
        fontSize: 20,
        color: 'white',
    },
    title: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        marginLeft: 10
    },
    logo_container: {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
