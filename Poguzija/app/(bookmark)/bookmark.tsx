import { useContext, useEffect, useState } from "react"
import {  FlatList, Pressable, RefreshControl,  StyleSheet, Text, View } from "react-native"
import BackgroundSafeAreaView from "../../components/BackgroundSafeAreaView"
import { SIZES, COLORS } from "../../constants/Colors"
import { FoodRecipes } from "../../model/model"
import LoadingScreen from "../../components/LoadingScreen"
import CardFoodRecipes from "../../components/CardFoodRecipes"
import { GetMySavedFoodRecipes } from "../../service/BookmarkService"
import { TranslationKeys } from "../../locales/_translationKeys"
import { useTranslation } from "react-i18next"

export default function BookmarkScreen() {
    const [food, setFood] = useState<FoodRecipes[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const {t} = useTranslation()

    useEffect(() => {
        setLoading(true)
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const foodRecipesData = await GetMySavedFoodRecipes()
            setFood(foodRecipesData)
            setRefreshing(false)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchData()
    }

    if (loading) return <LoadingScreen />

    return (
        <BackgroundSafeAreaView>
            <Text style={styles.subtitleText}>{t(TranslationKeys.Bookmark.SAVED)}</Text>
            <View style={styles.line} />
            <FlatList
                data={food}
                renderItem={({ item }) => <CardFoodRecipes data={item} route={''} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.flex}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />  
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '95%'
    },
    line: {
        backgroundColor: COLORS.tint,
        height: SIZES.base,
        width: '95%',
        borderRadius: SIZES.base,
        elevation: 2,
    },
    subtitleText: {
        width: '95%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        padding: SIZES.base,
        elevation: 2,
    },
})