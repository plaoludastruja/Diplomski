import { StyleSheet } from 'react-native'
import { Pagination } from 'react-native-reanimated-carousel'
import { SharedValue } from 'react-native-reanimated'
import { COLORS, SIZES } from '../../constants/Colors'

interface CarouselPaginationProps {
    count: number
    progress: SharedValue<number>
    top: number
}

export const CarouselPagination = ({ count, progress, top }: CarouselPaginationProps) => {
    return (
        <Pagination
            count={count}
            progress={progress}
            containerStyle={[styles.container, { top }]}
            dotStyle={styles.dot}
            activeDotStyle={styles.dotActive}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        gap: SIZES.base,
    },
    dot: {
        width: SIZES.base,
        height: SIZES.base,
        borderRadius: SIZES.base,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    dotActive: {
        backgroundColor: COLORS.white,
    },
})
