import { ActivityIndicator, Animated, GestureResponderEvent, Pressable, StyleSheet, Text, useAnimatedValue } from 'react-native'
import { Image } from 'expo-image'
import { COLORS, SIZES } from '../../constants/Colors'

const GoogleIcon = require('../../assets/images/googleIcon.png')

interface GoogleSignInButtonProps {
    children: string
    onPress?: (event: GestureResponderEvent) => void
    loading?: boolean
    disabled?: boolean
}

export const GoogleSignInButton = ({ children, onPress, loading, disabled }: GoogleSignInButtonProps) => {
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
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable style={styles.content} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={loading || disabled}>
                {loading ?
                    <ActivityIndicator color={COLORS.white} /> :
                    <>
                        <Image source={GoogleIcon} style={styles.icon} contentFit="contain" />
                        <Text style={styles.buttonText}>{children}</Text>
                    </>}
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '85%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SIZES.small,
        minHeight: SIZES.tabIcon + 2 * SIZES.small,
        backgroundColor: COLORS.lightDark,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.small,
        marginVertical: SIZES.base,
        elevation: 2,
        shadowColor: COLORS.dark,
    },
    icon: {
        width: SIZES.tabIcon,
        height: SIZES.tabIcon,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.large,
    },
})
