import { View, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/Colors';
import { MyComponentProps } from '../model/model';

const BackgroundSafeAreaView : FC<MyComponentProps> = ({  children }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view} />
            {children}
        </SafeAreaView>
    )
}

export default BackgroundSafeAreaView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    view: {
        position: "absolute", 
        top: 0, 
        bottom: 0, 
        right: 0, 
        left: 0, 
        zIndex: -1, 
        height: 700, 
        backgroundColor: COLORS.light, 
        borderBottomEndRadius: SIZES.extraLarge, 
        borderBottomStartRadius: SIZES.extraLarge, 
    }
});