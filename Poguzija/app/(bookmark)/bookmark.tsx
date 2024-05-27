import { useContext, useEffect, useState } from "react"
import {  FlatList, Pressable, RefreshControl,  StyleSheet, Text, View } from "react-native"
import BackgroundSafeAreaView from "../../components/BackgroundSafeAreaView"
import { SIZES, COLORS } from "../../constants/Colors"
import { UserContext } from "../_layout"
import { MaterialIcons } from "@expo/vector-icons"
import { FoodRecipes } from "../../model/model"
import LoadingScreen from "../../components/LoadingScreen"
import CardFoodRecipes from "../../components/CardFoodRecipes"
import { GetMySavedFoodRecipes } from "../../service/BookmarkService"

export default function BookmarkScreen() {
    const { user } = useContext(UserContext)
    const [food, setFood] = useState<FoodRecipes[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)

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
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.subtitleText}>Saved</Text>
                    <Pressable style={styles.addButton} >
                        <MaterialIcons name="add" style={styles.icon}  />
                    </Pressable>
                </View>
            </View>
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
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        
        padding: SIZES.base,
    },
    addButton: {
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        elevation: 2,
    },
    icon: {
        color: COLORS.light,
        fontSize: SIZES.extraLarge
    },    
    line: {
        backgroundColor: COLORS.tint,
        height: SIZES.base,
        width: '95%',
        borderRadius: SIZES.base,
        elevation: 2,
    },
    flex: {
        flex: 1,
        width: '95%'
    },
    subtitleText: {
        width: '85%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        marginBottom: 0.5 * SIZES.base,
        marginTop: SIZES.small
    },
})