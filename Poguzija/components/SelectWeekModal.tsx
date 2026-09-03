import { Text, StyleSheet, View, Modal, Pressable } from 'react-native'
import { Day } from '../model/model'
import { COLORS, SIZES } from '../constants/Colors'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../locales/_translationKeys'

interface SelectWeekModalProps {
    visible: boolean
    onClose: (day?: string | null) => void
}

export const SelectWeekModal = ({ visible, onClose }: SelectWeekModalProps) => {
    const {t} = useTranslation()

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={ () => onClose() }>
            <Pressable style={styles.centeredView} onPress={ () => onClose() }>
                <View style={styles.modalView}>
                    { Object.keys(Day)?.map((key, _) => (
                            <Pressable
                                style={ styles.buttonModal }
                                onPress={ () => onClose(key) }
                                key={key}>
                                <Text style={styles.textStyle}>{t(TranslationKeys.Day[key as keyof typeof TranslationKeys.Day]) || key}</Text>
                            </Pressable>
                        ))}
                </View>
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
        height: 'auto',
        width: '80%',
        backgroundColor: COLORS.light,
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
    buttonModal: {
        borderRadius: 20,
        padding: 10,
        marginVertical: 0.2 * SIZES.base,
        width: '100%',
        elevation: 2,
        backgroundColor: COLORS.tint,
    },
    textStyle: {
        width: '100%',
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
