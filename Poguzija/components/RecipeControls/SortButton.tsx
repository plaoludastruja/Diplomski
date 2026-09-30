import { Animated, Pressable, StyleSheet, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../../locales/_translationKeys'
import { RecipeSortMode } from '../../service/RecipesService'
import { COLORS, SIZES } from '../../constants/Colors'

type SortButtonProps = {
    sortMode: RecipeSortMode
    onToggle: () => void
    positionAnimation: Animated.Value
}

export function SortButton({ sortMode, onToggle, positionAnimation }: SortButtonProps) {
    const { t } = useTranslation()

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY: positionAnimation }] }]}>
            <Pressable style={styles.button} onPress={onToggle}>
                <MaterialIcons name={sortMode === 'topRated' ? 'star' : 'arrow-downward'} size={SIZES.medium} color={COLORS.white} />
                <Text style={styles.buttonText}>
                    {sortMode === 'topRated' ? t(TranslationKeys.Recipe.TOP_RATED) : t(TranslationKeys.Recipe.NEWEST)}
                </Text>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: SIZES.base,
        right: SIZES.base,
        zIndex: 2,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightDark,
        borderRadius: SIZES.extraLarge,
        paddingHorizontal: SIZES.small,
        paddingVertical: 0.5 * SIZES.base,
        elevation: 3,
        shadowColor: COLORS.dark,
        gap: 4,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: SIZES.font,
    },
})
