import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { SIZES } from '../constants/Colors'

export const StarRating = ({ ratingValue, onRatingChange }) => {
    const [rating, setRating] = useState(ratingValue)

    const handleStarPress = (newRating) => {
        setRating(newRating)
        if (onRatingChange) {
            onRatingChange(newRating)
        }
    }

    return (
        <View style={styles.container}>
            {[...Array(5)].map((_, index) => {
                const starNumber = index + 1
                return (
                    <TouchableOpacity
                        key={starNumber}
                        onPress={() => handleStarPress(starNumber)} >
                        <FontAwesome
                            name={starNumber <= rating ? 'star' : 'star-o'}
                            size={32}
                            color="#FFD700"
                            style={styles.star} />
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export const StarRatingShow = ({ rating }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75
    const higher = rating % 1 > 0.75 && rating % 1 < 1
    return (
        <View style={styles.container}>
            {[...Array(5)].map((_, index) => {
                const starNumber = index + 1
                return (
                    <FontAwesome
                        key={starNumber}
                        name={ starNumber <= fullStars || (starNumber == fullStars + 1 && higher) ? 'star' : (starNumber == fullStars + 1 && hasHalfStar) ? 'star-half-o' : 'star-o'}
                        size={SIZES.extraLarge}
                        color="#FFD700"
                        style={styles.star} />
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    star: {
        margin: 5,
    },
})
