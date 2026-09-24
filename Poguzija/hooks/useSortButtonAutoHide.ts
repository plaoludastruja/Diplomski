import { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

const HIDDEN_POSITION = -200
const VISIBLE_DURATION = 5000

export function useSortButtonAutoHide() {
    const [positionAnimation] = useState(() => new Animated.Value(HIDDEN_POSITION))
    const lastScrollY = useRef(0)
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isVisible = useRef(false)

    const showSortButton = useCallback(() => {
        if (hideTimer.current) clearTimeout(hideTimer.current)
        if (!isVisible.current) {
            isVisible.current = true
            Animated.timing(positionAnimation, { toValue: 0, duration: 300, useNativeDriver: true }).start()
        }
        hideTimer.current = setTimeout(() => {
            isVisible.current = false
            Animated.timing(positionAnimation, { toValue: HIDDEN_POSITION, duration: 300, useNativeDriver: true }).start()
        }, VISIBLE_DURATION)
    }, [positionAnimation])

    const hideSortButton = useCallback(() => {
        if (hideTimer.current) {
            clearTimeout(hideTimer.current)
            hideTimer.current = null
        }
        if (isVisible.current) {
            isVisible.current = false
            Animated.timing(positionAnimation, { toValue: HIDDEN_POSITION, duration: 300, useNativeDriver: true }).start()
        }
    }, [positionAnimation])

    useEffect(() => () => {
        if (hideTimer.current) clearTimeout(hideTimer.current)
    }, [])

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPos = event.nativeEvent.contentOffset.y
        if (currentScrollPos <= 0) {
            showSortButton()
        } else if (currentScrollPos > lastScrollY.current) {
            hideSortButton()
        } else if (currentScrollPos < lastScrollY.current) {
            showSortButton()
        }
        lastScrollY.current = currentScrollPos
    }, [showSortButton, hideSortButton])

    return { positionAnimation, handleScroll, showSortButton, hideSortButton }
}
