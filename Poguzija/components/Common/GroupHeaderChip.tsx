import { Pressable, StyleSheet, Text, View } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'

interface GroupHeaderChipProps {
    label: string
    selected?: boolean
    onPress?: () => void
    inline?: boolean
}

export const GroupHeaderChip = ({ label, selected = true, onPress, inline = false }: GroupHeaderChipProps) => {
    const chip = (
        <Pressable
            style={[styles.chip, !selected && styles.chipUnselected, inline && styles.chipInline]}
            onPress={onPress}
            disabled={!onPress}>
            <Text style={[styles.chipText, !selected && styles.chipTextUnselected]}>{label}</Text>
        </Pressable>
    )

    if (inline) return chip
    return <View style={styles.container}>{chip}</View>
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        alignItems: 'flex-start',
    },
    chip: {
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.base / 2,
        marginLeft: SIZES.small,
        marginBottom: SIZES.base,
    },
    chipInline: {
        marginLeft: 0,
        marginRight: SIZES.base,
        marginBottom: 0,
    },
    chipUnselected: {
        backgroundColor: COLORS.white,
    },
    chipText: {
        color: COLORS.white,
        fontSize: SIZES.font,
        fontWeight: '500',
    },
    chipTextUnselected: {
        color: COLORS.dark,
    },
})
