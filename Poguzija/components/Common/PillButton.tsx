import { ReactNode } from 'react'
import { GestureResponderEvent, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'

interface PillButtonProps {
    children: ReactNode
    onPress?: (event: GestureResponderEvent) => void
    style?: StyleProp<ViewStyle>
}

export const PillButton = ({ children, onPress, style }: PillButtonProps) => {
    return (
        <Pressable style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.buttonText}>{children}</Text>
        </Pressable>
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
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.large,
    },
})
