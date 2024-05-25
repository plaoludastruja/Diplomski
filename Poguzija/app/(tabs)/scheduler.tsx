import { ScrollView, StyleSheet } from 'react-native';
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import SchedulerRecipe from '../../components/SchedulerRecipe';
import { FoodRecipes, RecipeScheduler } from '../../model/model';
import { useEffect, useState } from 'react';
import { GetRecipesScheduler } from '../../service/service';
import LoadingScreen from '../../components/LoadingScreen';
import { useIsFocused } from "@react-navigation/native";


export default function SchedulerScreen() {
    const [loading, setLoading] = useState(true);
    const [recipesWeek, setRecipesWeek] = useState<RecipeScheduler>();
    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused){
            setLoading(true);
            fetchData();
        }
    }, [isFocused]);

    const fetchData = async () => {
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