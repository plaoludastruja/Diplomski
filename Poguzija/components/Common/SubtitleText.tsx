import { ReactNode } from 'react'
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'

interface SubtitleTextProps {
    children: ReactNode
    style?: StyleProp<TextStyle>
}

export const SubtitleText = ({ children, style }: SubtitleTextProps) => {
    return <Text style={[styles.subtitleText, style]}>{children}</Text>
}

const styles = StyleSheet.create({
    subtitleText: {
        width: '90%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        padding: SIZES.base,
    },
})
