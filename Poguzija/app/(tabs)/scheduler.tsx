import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import SchedulerRecipe from '../../components/SchedulerRecipe';
import { FoodRecipes, RecipeScheduler } from '../../model/model';
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useRef, useState } from 'react';
import { GetRecipesScheduler } from '../../service/service';
import LoadingScreen from '../../components/LoadingScreen';
import { useIsFocused } from "@react-navigation/native";
import { SchedulerContext, UserContext } from '../_layout';


export default function SchedulerScreen() {
    const { user } = useContext(UserContext)
    const { refreshScheduler, setRefreshScheduler } = useContext(SchedulerContext)
    const [loading, setLoading] = useState(true);
    const [recipesWeek, setRecipesWeek] = useState<RecipeScheduler>();
    const isFocused = useIsFocused();
    
    useEffect(() => {
        setLoading(true);
        fetchData();
        setRefreshScheduler(false)
    }, [refreshScheduler || user]);


    const fetchData = async () => {
        console.log('cheduler fetch', user)
        try {
            const recipesWeekData = await GetRecipesScheduler();
            setRecipesWeek(recipesWeekData)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    if (loading) return <LoadingScreen />
    
    return (
            <BackgroundSafeAreaView>
                <ScrollView style={styles.flex} horizontal={false} showsVerticalScrollIndicator={false} >
                { recipesWeek?.recipeByDay.map(recipeByDay => (
                    <SchedulerRecipe key={recipeByDay.day} day={recipeByDay.day} recipesWeek={recipeByDay.recipes} />
                ))}
                </ScrollView>
            </BackgroundSafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%'
    },
});