import { View, StyleSheet } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'

export const Divider = () => {
    return <View style={styles.line} />
}

const styles = StyleSheet.create({
    line: {
        backgroundColor: COLORS.tint,
        height: SIZES.base,
        width: '95%',
        borderRadius: SIZES.base,
        elevation: 2,
    },
})
