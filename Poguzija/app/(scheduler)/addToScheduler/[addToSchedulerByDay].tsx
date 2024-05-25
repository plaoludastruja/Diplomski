import { Text, StyleSheet, View, FlatList, RefreshControl } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { FoodRecipes } from '../../../model/model';
import BackgroundSafeAreaView from '../../../components/BackgroundSafeAreaView';
import CardFoodRecipes from '../../../components/CardFoodRecipes';
import LoadingScreen from '../../../components/LoadingScreen';
import { GetAllFoodRecipes } from '../../../service/service';
import { useLocalSearchParams } from 'expo-router';

export default function addToSchedulerByDay() {
    const { addToSchedulerByDay } = useLocalSearchParams<{ addToSchedulerByDay: string }>();
    const [food, setFood] = useState<FoodRecipes[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const foodRecipesData = await GetAllFoodRecipes();
            setFood(foodRecipesData)
            setRefreshing(false)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading) return <LoadingScreen />

    return (
        <BackgroundSafeAreaView>
            <FlatList
                data={food}
                renderItem={({ item }) => <CardFoodRecipes data={item} route={'schedulerAdd/' + addToSchedulerByDay}/>}
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
