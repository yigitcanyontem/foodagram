// components/CustomHeader.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HeartIcon, MessageSquareIcon} from "lucide-react-native";
import NotificationIcon from "@/icons/NotificationIcon";

export default function Header({title}) {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.logo_container}>
                <Image source={require('../../assets/images/foodagram_logo.png')} style={{width: 30, height: 30}}/>
                <Text style={styles.title}>
                    Foodagram
                </Text>
            </TouchableOpacity>

            <View style={styles.row}>
                <TouchableOpacity>
                    <NotificationIcon fill={'#8E8E8E'} width={25} height={25}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row:{
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
