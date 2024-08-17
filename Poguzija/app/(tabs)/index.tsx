import { ActivityIndicator, FlatList, RefreshControl, StyleSheet} from 'react-native'
import CardFoodRecipes from '../../components/CardFoodRecipes'
import { useState, useEffect } from 'react'
import { FoodRecipes } from '../../model/model'
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView'
import { COLORS } from '../../constants/Colors'
import LoadingScreen from '../../components/LoadingScreen'
import { GetAllFoodRecipes } from '../../service/RecipesService'
import { QueryDocumentSnapshot } from 'firebase/firestore/lite'


export default function IndexScreen() {
    const [food, setFood] = useState<FoodRecipes[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>()
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const { foodRecipesData, newLastVisible } = await GetAllFoodRecipes(null)
            setFood(foodRecipesData)
            setLastVisible(newLastVisible)
            setHasMore(foodRecipesData.length > 0)
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

    const handleEndReached = async () => {
        if(hasMore){
            const { foodRecipesData, newLastVisible } = await GetAllFoodRecipes(lastVisible)
            if (foodRecipesData.length > 0) {
                setFood([...food, ...foodRecipesData])
                setLastVisible(newLastVisible)
            }else{
                setHasMore(false)
            }
        }
    }

    if (loading) return <LoadingScreen />

    return (
        <BackgroundSafeAreaView>
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
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
            />           
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%',
    },
})



