// components/CustomHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Footer() {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        paddingHorizontal: 16,
        backgroundColor: '#0b421a',
        paddingVertical: 10,
        width: '100%',
        flex:0
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
