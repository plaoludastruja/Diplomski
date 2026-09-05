import { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView, Edge } from 'react-native-safe-area-context'
import { COLORS, SIZES } from '../../constants/Colors'
import { MyComponentProps } from '../../model/model'
import { HeaderHeightContext } from 'expo-router/react-navigation'
import { BottomTabBarHeightContext } from 'expo-router/build/react-navigation/bottom-tabs'

export const BackgroundSafeAreaView = ({ children }: MyComponentProps) => {
    const headerHeight = useContext(HeaderHeightContext) ?? 0
    const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0

    const edges: Edge[] = ['left', 'right']
    if (headerHeight === 0) edges.push('top')
    if (tabBarHeight === 0) edges.push('bottom')

    return (
        <SafeAreaView style={styles.container} edges={edges}>
            <View style={styles.view} />
            {children}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    view: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: -1,
        height: '85%',
        backgroundColor: COLORS.light,
        borderBottomEndRadius: SIZES.extraLarge,
        borderBottomStartRadius: SIZES.extraLarge,
    },
})
