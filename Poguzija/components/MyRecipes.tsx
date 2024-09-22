import { StyleSheet, FlatList, RefreshControl } from 'react-native'
import { useContext, useEffect, useState } from 'react'
import { FoodRecipes } from '../model/model'
import { COLORS, SIZES } from '../constants/Colors'
import { UserContext } from '../app/_layout'
import CardFoodRecipes from './CardFoodRecipes'
import { GetMyFoodRecipes } from '../service/RecipesService'
import LoadingScreen from './LoadingScreen'
import { QueryDocumentSnapshot } from 'firebase/firestore/lite'

export default function MyRecipes() {
    const { user } = useContext(UserContext)
    const [food, setFood] = useState<FoodRecipes[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>()
    const [hasMore, setHasMore] = useState(true)
    
    useEffect(() => {
        if(user){
            setLoading(true)
            fetchData()
        }else{
            setFood([])
            setLoading(false)
        }
    },[user])
    
    const fetchData = async () => {
        try {
            const { foodRecipesData, newLastVisible }  = await GetMyFoodRecipes(null)
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
            const { foodRecipesData, newLastVisible } = await GetMyFoodRecipes(lastVisible)
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
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '95%',
    },
    header: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 5 * SIZES.extraLarge,
        height: 2 * SIZES.extraLarge,
    },
    image: {
        width: 1.2 * SIZES.tabIcon,
        height: 1.2 * SIZES.tabIcon,
        borderRadius: SIZES.large,
        margin: SIZES.base
    },
    subtitleText: {
        width: '85%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        marginBottom: 0.5 * SIZES.base,
        alignSelf: 'flex-start'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    flex: {
        flex: 1,
        width: '100%',
    },
    button: {
        textAlign: 'center',
        justifyContent: 'center',
        width: '85%',
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        marginVertical: SIZES.base,
        elevation: 2,
    },

    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },

    
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        height: 60,
        backgroundColor: COLORS.dark,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    
    textInput: {
        width: '100%',
        marginRight: 10,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    
    icon: {
        marginRight: 10,
        color: COLORS.lightDark,
        fontSize: SIZES.extraLarge
    },
})
