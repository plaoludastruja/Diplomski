import { FlatList, RefreshControl, StyleSheet} from 'react-native';
import CardFoodRecipes from '../../components/CardFoodRecipes';
import { useState, useEffect } from 'react';
import { FoodRecipes } from '../../model/model';
import { GetAllFoodRecipes } from '../../service/service';
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';


export default function IndexScreen() {
    const [food, setFood] = useState<FoodRecipes[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const foodRecipesData = await GetAllFoodRecipes();
            setFood(foodRecipesData)
            setRefreshing(false);
            console.log(JSON.stringify(foodRecipesData))
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    return (
        <BackgroundSafeAreaView>
            <FlatList
                data={food}
                renderItem={({ item }) => <CardFoodRecipes data={item} />}
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
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%',
    },
});



