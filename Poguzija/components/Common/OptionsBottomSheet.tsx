import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, SIZES } from '../../constants/Colors'

export interface OptionItem {
    title: string
    code: string
}

export interface OptionsBottomSheetRef {
    present: () => void
}

interface OptionsBottomSheetProps {
    options: OptionItem[]
    onSelect: (code: string) => void
}

export const OptionsBottomSheet = forwardRef<OptionsBottomSheetRef, OptionsBottomSheetProps>(({ options, onSelect }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const insets = useSafeAreaInsets()

    useImperativeHandle(ref, () => ({
        present: () => bottomSheetModalRef.current?.present(),
    }))

    const handleSelect = useCallback((code: string) => {
        bottomSheetModalRef.current?.dismiss()
        onSelect(code)
    }, [onSelect])

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ), [])

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            bottomInset={insets.bottom}
            backgroundStyle={styles.background}
            handleIndicatorStyle={styles.handleIndicator}
            backdropComponent={renderBackdrop}
        >
            <BottomSheetView style={styles.container}>
                {options.map((option, index) => (
                    <View key={option.code}>
                        {index > 0 && <View style={styles.separator} />}
                        <Pressable style={styles.item} onPress={() => handleSelect(option.code)}>
                            <Text style={styles.itemText}>{option.title}</Text>
                        </Pressable>
                    </View>
                ))}
            </BottomSheetView>
        </BottomSheetModal>
    )
})

OptionsBottomSheet.displayName = 'OptionsBottomSheet'

const styles = StyleSheet.create({
    background: {
        backgroundColor: COLORS.lightDark,
    },
    handleIndicator: {
        backgroundColor: COLORS.white,
    },
    container: {
        paddingHorizontal: SIZES.medium,
        paddingBottom: SIZES.extraLarge,
    },
    item: {
        paddingVertical: SIZES.medium,
    },
    separator: {
        height: 3 * StyleSheet.hairlineWidth,
        width: '75%',
        alignSelf: 'center',
        backgroundColor: COLORS.tint,
        opacity: 0.5,
    },
    itemText: {
        color: COLORS.white,
        fontSize: SIZES.large,
        fontWeight: '500',
        textAlign: 'center',
    },
})
