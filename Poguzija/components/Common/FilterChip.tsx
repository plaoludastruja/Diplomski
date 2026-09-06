import { MaterialIcons } from '@expo/vector-icons'
import { Animated, Pressable, StyleSheet, Text, useAnimatedValue } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'

interface FilterChipProps {
    label: string
    onPress: () => void
}

export const FilterChip = ({ label, onPress }: FilterChipProps) => {
    const scaleAnim = useAnimatedValue(1)

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true }).start()
    }

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()
    }

    return (
        <Animated.View style={[styles.chip, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable style={styles.chipPressable} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Text style={styles.textStyle}>{label}</Text>
                <MaterialIcons name="close" style={styles.iconButton} />
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    chip: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: SIZES.small,
        paddingVertical: 0.5 * SIZES.base,
        marginVertical: SIZES.base,
        marginHorizontal: 0.5 * SIZES.base,
        backgroundColor: COLORS.dark,
    },
    chipPressable: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: SIZES.medium,
        textAlign: 'center',
    },
    iconButton: {
        color: COLORS.lightDark,
        fontSize: SIZES.medium,
    },
})
