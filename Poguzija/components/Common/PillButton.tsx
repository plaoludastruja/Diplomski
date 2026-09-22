import { ReactNode } from 'react'
import { ActivityIndicator, Animated, GestureResponderEvent, Pressable, StyleProp, StyleSheet, Text, ViewStyle, useAnimatedValue } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'

interface PillButtonProps {
    children: ReactNode
    onPress?: (event: GestureResponderEvent) => void
    style?: StyleProp<ViewStyle>
    loading?: boolean
    disabled?: boolean
}

export const PillButton = ({ children, onPress, style, loading, disabled }: PillButtonProps) => {
    const scaleAnim = useAnimatedValue(1)

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start()
    }

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start()
    }

    return (
        <Animated.View style={[styles.button, style, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={loading || disabled}>
                {loading ?
                    <ActivityIndicator color={COLORS.white} /> :
                    <Text style={styles.buttonText}>{children}</Text>}
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        width: '85%',
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        marginVertical: SIZES.base,
        elevation: 2,
        shadowColor: COLORS.dark,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.large,
    },
})
