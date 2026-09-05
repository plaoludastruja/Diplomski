import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'
import { FoodRecipes } from '../../model/model'
import { CardFoodRecipes } from './CardFoodRecipes'
import { Divider } from '../Common/Divider'
import { SubtitleText } from '../Common/SubtitleText'
import { TranslationKeys } from '../../locales/_translationKeys'
import { useTranslation } from 'react-i18next'

export const SchedulerRecipe = ({ recipesWeek, day }: { recipesWeek: FoodRecipes[], day: string }) => {
    const screenWidth = Dimensions.get('window').width
    const { t } = useTranslation()

    return (
        <View style={styles.container}>
            <SubtitleText>{t(TranslationKeys.Day[day.toUpperCase() as keyof typeof TranslationKeys.Day]) || day}</SubtitleText>
            <Divider />
            {recipesWeek.length === 0 ?
                <View style={[styles.flex, styles.emptyContainer]}>
                    <Text style={styles.emptyText}>{t(TranslationKeys.Scheduler.NO_RECIPES_FOR_DAY)}</Text>
                </View> :
                <ScrollView horizontal={true} style={styles.flex}>
                    {recipesWeek.map((recipe, index) =>
                        <View key={index} style={{ width: 0.8 * screenWidth }}>
                            <CardFoodRecipes data={recipe} route={'scheduler/' + day} />
                        </View>
                    )}
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%',
        margin: SIZES.small
    },
    container: {
        alignItems: 'center',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.tint,
        fontSize: SIZES.medium,
    },
})
