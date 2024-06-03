import { View, Image, StyleSheet, Pressable, Text, Alert } from 'react-native'
import React, { FC, useContext, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import Colors, { COLORS, SIZES } from '../constants/Colors'
import { FoodRecipes } from '../model/model'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { AddToMyScheduler, RemoveFromScheduler } from '../service/SchedulerService'
import { SchedulerContext, UserContext } from '../app/_layout'
import { StarRatingShow } from './StartRating'

const PlaceholderImage = require('../assets/images/icon.png')

const CardFoodRecipes: FC<{ data: FoodRecipes, route: string }> = ({ data, route }): JSX.Element => {
    const router = useRouter()
    const { setRefreshScheduler } = useContext(SchedulerContext)
    const { user } = useContext(UserContext)
    
    
    const handlePress = async (data: FoodRecipes) => {
        if(!route){
            router.push(`/foodRecipesItem/${data.id}`)
        }else if (route.split('/')[0] === 'schedulerAdd'){
            await AddToMyScheduler(data, route.split('/')[1])
            setRefreshScheduler(true)
            router.back()
        }else{
            router.push(`/foodRecipesItem/${data.id}`)
        }
    }

    const handleLongPress = async (data: FoodRecipes) => {
        if(!route){
            return
        }else if (route.split('/')[0] === 'schedulerRemove'){
            user && Alert.alert('Remove Item', 'Are you sure you want to remove this item from scheduler?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove', onPress: async () => {
                    await RemoveFromScheduler(data, route.split('/')[1])
                    setRefreshScheduler(true)
                    },
                },
            ],
            { cancelable: false }
        )
        }
    }

    return (
        <View style={styles.cardContainer}>
            <Pressable style={styles.pressable} onPress={() => handlePress(data)} onLongPress={() => handleLongPress(data)} >
                <Image source={data.images ? { uri: data.images[0] } : PlaceholderImage} style={[styles.image]} />
                <LinearGradient 
                    colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.8)']} 
                    start={{ x: 0.5, y: 0.65 }}
                    end={{ x: 0.5, y: 0.9 }}
                    style={[styles.image, { ...StyleSheet.absoluteFillObject }]} />
                <View style={styles.textContainer}>
                    { data?.rating?.count != 0 && <StarRatingShow rating={(data?.rating?.sum / (data?.rating?.count == 0 ? 1 : data?.rating?.count)).toFixed(2)} />}
                    <Text style={styles.text}>{data.title}</Text>
                </View>
            </Pressable>
        </View>
    )
}

export default CardFoodRecipes

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    cardContainer: {
        backgroundColor: COLORS.lightDark,
        margin: SIZES.base,
        borderRadius: SIZES.large,
    },
    pressable: {
        width: '100%',
        height: 450,
        overflow: 'hidden',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0, 
        width: '100%',
        height: '100%',
        borderRadius: SIZES.large,
    },
    textContainer: {
        flex: 1, // Ensure text container takes up remaining space
        justifyContent: 'flex-end', // Align text to bottom
        alignItems: 'flex-start', // Center text horizontally
        padding: SIZES.base, // Add padding for visual breathing space
        margin: SIZES.base
    },
    text: {
        fontSize: SIZES.large,
        color: COLORS.light,
        fontWeight: 'bold',
    },
})