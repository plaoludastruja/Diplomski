import { Dimensions, FlatList, Modal, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { MaterialIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, SIZES } from '../../constants/Colors'

interface ImagePreviewModalProps {
    visible: boolean
    images: string[]
    initialIndex: number
    onClose: () => void
}

const SWIPE_CLOSE_DISTANCE = 120
const SWIPE_CLOSE_VELOCITY = 800

export const ImagePreviewModal = ({ visible, images, initialIndex, onClose }: ImagePreviewModalProps) => {
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    const insets = useSafeAreaInsets()
    const translateY = useSharedValue(0)

    const panGesture = Gesture.Pan()
        .activeOffsetY([-15, 15])
        .failOffsetX([-15, 15])
        .onUpdate((event) => {
            translateY.value = event.translationY
        })
        .onEnd((event) => {
            if (Math.abs(event.translationY) > SWIPE_CLOSE_DISTANCE || Math.abs(event.velocityY) > SWIPE_CLOSE_VELOCITY) {
                scheduleOnRN(onClose)
            }
            translateY.value = withSpring(0)
        })

    const backgroundStyle = useAnimatedStyle(() => ({
        opacity: interpolate(Math.abs(translateY.value), [0, screenHeight / 2], [1, 0.3], Extrapolation.CLAMP),
    }))

    const contentStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }))

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <GestureHandlerRootView style={styles.flex}>
                <Animated.View style={[StyleSheet.absoluteFill, styles.background, backgroundStyle]} />
                <Pressable style={[styles.closeButton, { top: insets.top + SIZES.base }]} onPress={onClose}>
                    <MaterialIcons name="close" color={COLORS.white} size={1.4 * SIZES.tabIcon} />
                </Pressable>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.flex, contentStyle]}>
                        <FlatList
                            key={initialIndex}
                            data={images}
                            keyExtractor={(uri, index) => `${index}-${uri}`}
                            horizontal
                            pagingEnabled
                            initialScrollIndex={initialIndex}
                            getItemLayout={(_, index) => ({ length: screenWidth, offset: screenWidth * index, index })}
                            showsHorizontalScrollIndicator={false}
                            style={styles.flex}
                            renderItem={({ item }) => (
                                <Image source={{ uri: item }} style={{ width: screenWidth, height: screenHeight }} contentFit="contain" transition={300} />
                            )}
                        />
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    background: {
        backgroundColor: 'rgba(0, 0, 0, 0.80)',
    },
    closeButton: {
        position: 'absolute',
        right: SIZES.extraLarge,
        zIndex: 1,
    },
})
