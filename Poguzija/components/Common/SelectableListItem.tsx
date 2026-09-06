import { Animated, Pressable, StyleSheet, Text, useAnimatedValue } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'

interface SelectableListItemProps {
    label: string
    selected?: boolean
    onPress: () => void
}

export const SelectableListItem = ({ label, selected, onPress }: SelectableListItemProps) => {
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
        <Animated.View style={[selected ? styles.buttonModalSelected : styles.buttonModal, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Text style={styles.textStyle}>{label}</Text>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    buttonModal: {
        borderRadius: SIZES.extraLarge,
        padding: SIZES.small,
        marginVertical: 0.5 * SIZES.base,
        width: '100%',
        elevation: 2,
        shadowColor: COLORS.dark,
        backgroundColor: COLORS.tint,
    },
    buttonModalSelected: {
        borderRadius: SIZES.extraLarge,
        padding: SIZES.small,
        marginVertical: 0.5 * SIZES.base,
        width: '100%',
        elevation: 2,
        backgroundColor: COLORS.dark,
    },
    textStyle: {
        width: '100%',
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.medium,
    },
})
