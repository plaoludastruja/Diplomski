import { View, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/Colors';
import { MyComponentProps } from '../model/model';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const BackgroundSafeAreaView : FC<MyComponentProps> = ({  children }) => {
    let headerHeight;
    let tabBarHeight;
    try {
        headerHeight = useHeaderHeight();
    } catch (error) {
        headerHeight = 0
    }
    try {
        tabBarHeight = useBottomTabBarHeight();
    } catch (error) {
        tabBarHeight = 0
    }

    const edges = ['left', 'right'];
    if (headerHeight === 0) edges.push('top');
    if (tabBarHeight === 0) edges.push('bottom');
        
    return (
        <SafeAreaView style={styles.container} edges={edges}>
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
        height: 600, 
        backgroundColor: COLORS.light, 
        borderBottomEndRadius: SIZES.extraLarge, 
        borderBottomStartRadius: SIZES.extraLarge, 
    }
});