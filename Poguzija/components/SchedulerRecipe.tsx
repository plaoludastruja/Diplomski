import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { SIZES, COLORS } from '../constants/Colors'
import { FoodRecipes, RecipeByDay } from '../model/model'
import CardFoodRecipes from './CardFoodRecipes'
import { useRouter } from 'expo-router'
import { useContext } from 'react'
import { UserContext } from '../app/_layout'
import { TranslationKeys } from '../locales/_translationKeys'
import { useTranslation } from 'react-i18next'



export default function SchedulerRecipe( { recipesWeek, day }: { recipesWeek: FoodRecipes[], day: string } ) {
    const screenWidth = Dimensions.get('window').width
    const router = useRouter()
    const { user } = useContext(UserContext)
    const {t} = useTranslation()
    
    const onAddToScheduler = () => {
        router.push(`/addToScheduler/${day}`)
    }

    return (
        <View style={styles.container}>
            <View style={styles.addContainer}>
                <Text style={styles.subtitleText}>{t(TranslationKeys.Day[day.toUpperCase()])}</Text>
                { false && user && <Pressable style={styles.addButton} >
                    <MaterialIcons name="add" style={styles.icon} onPress={ onAddToScheduler } />
                </Pressable>}
            </View>
            <View style={styles.line} />
            <ScrollView horizontal={true} style={styles.flex}>
                { recipesWeek.map((recipe, index) => 
                    <View key={index} style={{ width: 0.8 * screenWidth }}>
                        <CardFoodRecipes data={recipe} route={'scheduler/' + day }/>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginHorizontal: SIZES.base,
        marginVertical: SIZES.base,
    },
    subtitleText: {
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        elevation: 2,
    },
    line: {
        backgroundColor: COLORS.tint,
        height: SIZES.base,
        width: '100%',
        borderRadius: SIZES.base,
        elevation: 2,
    },
    addButton: {
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        elevation: 2,
    },
    addContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SIZES.base,
    },
    icon: {
        color: COLORS.light,
        fontSize: SIZES.extraLarge
    },
})