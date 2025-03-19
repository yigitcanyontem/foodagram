// components/CustomHeader.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function Header({title}) {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Text>
                    Foodagram
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        paddingVertical: 5
    },
    backButton: {
        padding: 8,
    },
    backText: {
        fontSize: 20,
        color: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});
