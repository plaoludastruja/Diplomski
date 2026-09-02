import { useContext, useState, useEffect, useCallback } from "react"
import { ScrollView, RefreshControl, StyleSheet } from "react-native"
import { UserContext, SchedulerContext } from "../app/_layout"
import BackgroundSafeAreaView from "../components/BackgroundSafeAreaView"
import LoadingScreen from "../components/LoadingScreen"
import SchedulerRecipe from "../components/SchedulerRecipe"
import { RecipeSchedulerReturn } from "../model/model"
import { GetRecipesScheduler } from "../service/SchedulerService"


export default function SchedulerScreen() {
    const { user } = useContext(UserContext)
    const { refreshScheduler, setRefreshScheduler } = useContext(SchedulerContext)
    const [loading, setLoading] = useState(true)
    const [recipesWeek, setRecipesWeek] = useState<RecipeSchedulerReturn>()
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        loadData()
    }, [refreshScheduler, user])


    const loadData = async () => {
        setLoading(true)
        await fetchData()
        setRefreshScheduler(false)
    }

    const fetchData = useCallback(async () => {
        try {
            const recipesWeekData = await GetRecipesScheduler()
            setRecipesWeek(recipesWeekData)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    const handleRefresh = useCallback(() => {
        setRefreshing(true)
        fetchData()
    }, [fetchData])

    if (loading) return <LoadingScreen />

    return (
        <BackgroundSafeAreaView>
            <ScrollView
                style={styles.flex}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }>
                {recipesWeek?.recipeByDay.map(recipeByDay => (
                    <SchedulerRecipe key={recipeByDay.day} day={recipeByDay.day} recipesWeek={recipeByDay.recipes} />
                ))}
            </ScrollView>
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%'
    },
})