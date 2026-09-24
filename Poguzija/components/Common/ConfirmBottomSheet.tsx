import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'
import { ALERT_COLORS, COLORS, SIZES } from '../../constants/Colors'
import { TranslationKeys } from '../../locales/_translationKeys'
import { PillButton } from './PillButton'

export interface ConfirmBottomSheetRef {
    present: (onConfirm: () => void) => void
}

interface ConfirmBottomSheetProps {
    title: string
    message: string
    confirmText?: string
}

export const ConfirmBottomSheet = forwardRef<ConfirmBottomSheetRef, ConfirmBottomSheetProps>(({ title, message, confirmText }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const onConfirmRef = useRef<() => void>(() => {})
    const { t } = useTranslation()

    useImperativeHandle(ref, () => ({
        present: (onConfirm: () => void) => {
            onConfirmRef.current = onConfirm
            bottomSheetModalRef.current?.present()
        },
    }))

    const handleConfirm = useCallback(() => {
        bottomSheetModalRef.current?.dismiss()
        requestIdleCallback(() => onConfirmRef.current())
    }, [])

    const handleCancel = useCallback(() => {
        bottomSheetModalRef.current?.dismiss()
    }, [])

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ), [])

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            backgroundStyle={styles.background}
            handleIndicatorStyle={styles.handleIndicator}
            backdropComponent={renderBackdrop}
            enableDynamicSizing={true}
        >
            <BottomSheetView style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                <PillButton onPress={handleConfirm} style={styles.confirmButton}>{confirmText ?? t(TranslationKeys.Button.DELETE)}</PillButton>
                <Pressable onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>{t(TranslationKeys.Button.CANCEL)}</Text>
                </Pressable>
            </BottomSheetView>
        </BottomSheetModal>
    )
})

ConfirmBottomSheet.displayName = 'ConfirmBottomSheet'

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
        alignItems: 'center',
    },
    title: {
        color: COLORS.white,
        fontSize: SIZES.large,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: SIZES.base,
    },
    message: {
        color: COLORS.white,
        fontSize: SIZES.medium,
        textAlign: 'center',
        marginBottom: SIZES.medium,
    },
    confirmButton: {
        backgroundColor: ALERT_COLORS.danger,
    },
    cancelButton: {
        paddingVertical: SIZES.base,
    },
    cancelText: {
        color: COLORS.white,
        fontSize: SIZES.large,
        fontWeight: '500',
        textAlign: 'center',
    },
})
