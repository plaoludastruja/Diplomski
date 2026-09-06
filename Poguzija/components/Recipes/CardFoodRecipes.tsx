import { View, StyleSheet, Pressable, Text, GestureResponderEvent, Animated, useAnimatedValue } from 'react-native'
import { Image } from 'expo-image'
import { memo, useContext, useEffect, useState } from 'react'
import { COLORS, SIZES } from '../../constants/Colors'
import { FoodRecipes, Day } from '../../model/model'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { AddToMyScheduler, RemoveFromScheduler } from '../../service/SchedulerService'
import { SchedulerContext, UserContext } from '../../app/_layout'
import { StarRatingShow } from './StarRating'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const PlaceholderImage = require('../../assets/images/icon.png')

export const CardFoodRecipes = memo(({ data, route }: { data: FoodRecipes, route: string }) => {
    const router = useRouter()
    const { setRefreshScheduler } = useContext(SchedulerContext)
    const { user } = useContext(UserContext)
    const [imageIndex, setImageIndex] = useState(0)
    const scaleAnim = useAnimatedValue(1)
    const removeScale = useAnimatedValue(1)

    const handleRemovePressIn = () => {
        Animated.spring(removeScale, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start()
    }

    const handleRemovePressOut = () => {
        Animated.spring(removeScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start()
    }

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start()
    }

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start()
    }

    useEffect(() => {
        setImageIndex(0)
        if (!data.images || data.images.length <= 1) return
        let timeoutId: ReturnType<typeof setTimeout>
        const scheduleNext = () => {
            const delay = 3000 + Math.random() * 7000
            timeoutId = setTimeout(() => {
                setImageIndex(index => (index + 1) % data.images.length)
                scheduleNext()
            }, delay)
        }
        scheduleNext()
        return () => clearTimeout(timeoutId)
    }, [data.id, data.images])


    const handlePress = async (data: FoodRecipes) => {
        router.push(`/foodRecipesItem/${data.id}`)
        if (route.split('/')[0] === 'schedulerAdd' && false){
            await AddToMyScheduler(data, route.split('/')[1] as keyof typeof Day)
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
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
            <Image key={data.id} source={data.images ? { uri: data.images[imageIndex] } : PlaceholderImage} style={styles.image} contentFit="cover" transition={600} />
            <Pressable style={styles.pressable} onPress={() => handlePress(data)} onLongPress={() => handleLongPress(data)} onPressIn={handlePressIn} onPressOut={handlePressOut} >
                <LinearGradient 
                    colors={['rgba(0, 0, 0, 0.8)', 'rgba(255, 255, 255, 0)']}
                    start={{ x: 0.5, y: - 0.2 }}
                    end={{ x: 0.5, y: 0.15 }}
                    style={[styles.image, StyleSheet.absoluteFill]} />
                <LinearGradient 
                    colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.8)']} 
                    start={{ x: 0.5, y: 0.65 }}
                    end={{ x: 0.5, y: 0.9 }}
                    style={[styles.image, StyleSheet.absoluteFill]} />
                <View style={styles.textContainer}>
                    { data?.rating?.count !== 0 && <StarRatingShow rating={(data?.rating?.sum / (data?.rating?.count === 0 ? 1 : data?.rating?.count)).toFixed(2)} />}
                    <Text style={styles.text}>{data.title}</Text>
                </View>
            </Pressable>
            {route.split('/')[0]==='scheduler' && user &&<View style={styles.textContainerTop}>
                { false && <MaterialCommunityIcons name='swap-horizontal-circle-outline' color={COLORS.white} size={1.2*SIZES.tabIcon} onPress={(event) => handleSwapFromScheduler(event, data)} />}
                <Animated.View style={{ transform: [{ scale: removeScale }] }}>
                    <Pressable onPress={(event) => handleRemoveFromScheduler(event, data)} onPressIn={handleRemovePressIn} onPressOut={handleRemovePressOut}>
                        <MaterialCommunityIcons name='close-circle-outline' color={COLORS.white} size={1.2*SIZES.tabIcon} />
                    </Pressable>
                </Animated.View>
            </View>}
        </Animated.View>
    )
})

CardFoodRecipes.displayName = 'CardFoodRecipes'

const styles = StyleSheet.create({
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
        margin: SIZES.base,
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
