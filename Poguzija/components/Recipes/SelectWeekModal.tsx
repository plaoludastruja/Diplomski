import { StyleSheet } from 'react-native'
import { Day } from '../../model/model'
import { COLORS } from '../../constants/Colors'
import { ModalBackdrop } from '../Common/ModalBackdrop'
import { SelectableListItem } from '../Common/SelectableListItem'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../../locales/_translationKeys'

interface SelectWeekModalProps {
    visible: boolean
    onClose: (day?: string | null) => void
}

export const SelectWeekModal = ({ visible, onClose }: SelectWeekModalProps) => {
    const { t } = useTranslation()

    const handleOnClose = () => {
        onClose()
    }

    return (
        <ModalBackdrop visible={visible} onClose={handleOnClose} cardStyle={styles.card}>
            {Object.keys(Day)?.map((key, _) => (
                <SelectableListItem
                    key={key}
                    label={t(TranslationKeys.Day[key as keyof typeof TranslationKeys.Day]) || key}
                    onPress={() => onClose(key)}
                />
            ))}
        </ModalBackdrop>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.light,
    },
})
