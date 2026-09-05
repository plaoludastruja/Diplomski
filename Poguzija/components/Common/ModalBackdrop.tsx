import { ReactNode } from 'react'
import { Modal, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'

interface ModalBackdropProps {
    children: ReactNode
    visible: boolean
    onClose: () => void
    cardStyle?: StyleProp<ViewStyle>
}

export const ModalBackdrop = ({ children, visible, onClose, cardStyle }: ModalBackdropProps) => {
    const handleOnClose = () => {
        onClose()
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleOnClose}>
            <Pressable style={styles.centeredView} onPress={handleOnClose}>
                <Pressable style={[styles.modalView, cardStyle]}>
                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        borderRadius: SIZES.extraLarge,
        padding: SIZES.small,
        alignItems: 'center',
        shadowColor: COLORS.dark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})
