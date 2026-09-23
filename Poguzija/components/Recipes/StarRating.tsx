import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { SIZES } from '../../constants/Colors'

interface StarRatingProps {
    ratingValue: number
    onRatingChange?: (rating: number) => void
}

export const StarRating = ({ ratingValue, onRatingChange }: StarRatingProps) => {
    const handleStarPress = (newRating: number) => {
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
                            name={starNumber <= ratingValue ? 'star' : 'star-o'}
                            size={32}
                            color="#FFD700"
                            style={styles.star} />
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export const StarRatingShow = ({ rating }: { rating: number | string }) => {
    const numericRating = Number(rating)
    const fullStars = Math.floor(numericRating)
    const hasHalfStar = numericRating % 1 >= 0.25 && numericRating % 1 <= 0.75
    const higher = numericRating % 1 > 0.75 && numericRating % 1 < 1
    return (
        <View style={styles.container}>
            {[...Array(5)].map((_, index) => {
                const starNumber = index + 1
                return (
                    <FontAwesome
                        key={starNumber}
                        name={ starNumber <= fullStars || (starNumber === fullStars + 1 && higher) ? 'star' : (starNumber === fullStars + 1 && hasHalfStar) ? 'star-half-o' : 'star-o'}
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
