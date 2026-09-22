import { Animated, Pressable, StyleProp, TextStyle, useAnimatedValue } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface DeleteIconButtonProps {
    onPress: () => void
    style?: StyleProp<TextStyle>
}

export const DeleteIconButton = ({ onPress, style }: DeleteIconButtonProps) => {
    const scaleAnim = useAnimatedValue(1)

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.85, useNativeDriver: true }).start()
    }

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()
    }

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Ionicons name='trash-outline' style={style} />
            </Pressable>
        </Animated.View>
    )
}
