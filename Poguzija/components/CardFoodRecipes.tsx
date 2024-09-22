import { View, Image, StyleSheet, Pressable, Text, Alert, GestureResponderEvent } from 'react-native'
import React, { FC, useContext, useEffect, useState } from 'react'
import { COLORS, SIZES } from '../constants/Colors'
import { FoodRecipes } from '../model/model'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { AddToMyScheduler, RemoveFromScheduler, SwapFromScheduler } from '../service/SchedulerService'
import { SchedulerContext, UserContext } from '../app/_layout'
import { StarRatingShow } from './StartRating'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const PlaceholderImage = require('../assets/images/icon.png')

const CardFoodRecipes: FC<{ data: FoodRecipes, route: string }> = ({ data, route }): JSX.Element => {
    const router = useRouter()
    const { setRefreshScheduler } = useContext(SchedulerContext)
    const { user } = useContext(UserContext)
    
    
    const handlePress = async (data: FoodRecipes) => {
        router.push(`/foodRecipesItem/${data.id}`)
        if (route.split('/')[0] === 'schedulerAdd' && false){
            await AddToMyScheduler(data, route.split('/')[1])
            setRefreshScheduler(true)
            router.back()
        }
    }

    const handleLongPress = async (data: FoodRecipes) => {
        if(!route){
            return
        }
    }

    const handleRemoveFromScheduler = async (event: GestureResponderEvent, data: FoodRecipes) => {
        event.stopPropagation()
        if(route.split('/')[0] !== 'scheduler' || !user)return
        await RemoveFromScheduler(data, route.split('/')[1])
        setRefreshScheduler(true)
    }

    const handleSwapFromScheduler = async (event: GestureResponderEvent, data: FoodRecipes) => {
        event.stopPropagation()
        if(route.split('/')[0] !== 'scheduler' || !user) return
        //await SwapFromScheduler(data, route.split('/')[1])
        setRefreshScheduler(true)
    }

    return (
        <View style={styles.cardContainer}>
            <Image source={data.images ? { uri: data.images[0] } : PlaceholderImage} style={[styles.image]} />
            <Pressable style={styles.pressable} onPress={() => handlePress(data)} onLongPress={() => handleLongPress(data)} >
                <LinearGradient 
                    colors={['rgba(0, 0, 0, 0.8)', 'rgba(255, 255, 255, 0)']}
                    start={{ x: 0.5, y: - 0.2 }}
                    end={{ x: 0.5, y: 0.15 }}
                    style={[styles.image, { ...StyleSheet.absoluteFillObject }]} />
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
            {route.split('/')[0]==='scheduler' && user &&<View style={styles.textContainerTop}>
                { false && <MaterialCommunityIcons name='swap-horizontal-circle-outline' color={COLORS.white} size={1.2*SIZES.tabIcon} onPress={(event) => handleSwapFromScheduler(event, data)} />}
                <MaterialCommunityIcons name='close-circle-outline' color={COLORS.white} size={1.2*SIZES.tabIcon} onPress={(event) => handleRemoveFromScheduler(event, data)} />
            </View>}
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
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: SIZES.base,
        margin: SIZES.base
    },
    textContainerTop: {
        position: 'absolute',
        top: 0, 
        left: 0,
        right: 0,
        //justifyContent: 'space-between',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: SIZES.base,
        margin: SIZES.base,
        flexDirection: 'row',
    },
    text: {
        fontSize: SIZES.large,
        color: COLORS.white,
        fontWeight: 'bold',
    },
})