import { Pressable, StyleSheet, Text } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'

interface SelectableListItemProps {
    label: string
    selected?: boolean
    onPress: () => void
}

export const SelectableListItem = ({ label, selected, onPress }: SelectableListItemProps) => {
    return (
        <Pressable style={selected ? styles.buttonModalSelected : styles.buttonModal} onPress={onPress}>
            <Text style={styles.textStyle}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonModal: {
        borderRadius: SIZES.extraLarge,
        padding: 10,
        marginVertical: 0.2 * SIZES.base,
        width: '100%',
        elevation: 2,
        backgroundColor: COLORS.tint,
    },
    buttonModalSelected: {
        borderRadius: SIZES.extraLarge,
        padding: 10,
        marginVertical: 0.2 * SIZES.base,
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
