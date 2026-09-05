import { StyleSheet, View, TextInput } from 'react-native'
import { useState } from 'react'
import { COLORS, SIZES } from '../../constants/Colors'
import { ModalBackdrop } from '../Common/ModalBackdrop'
import { PillButton } from '../Common/PillButton'
import { StarRating } from '../Recipes/StarRating'
import { FontAwesome } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../../locales/_translationKeys'

interface AddCommentModalProps {
    visible: boolean
    onAdd: (text: string, rating: number) => void
    onClose: () => void
}

export const AddCommentModal = ({ visible, onAdd, onClose }: AddCommentModalProps) => {
    const {t} = useTranslation()
    const [text, setText] = useState('')
    const [rating, setRating] = useState(0)
    const handleOnClose = () => {
        onClose()
    }

    const handleOnAdd = () => {
        onAdd(text, rating)
        setText('')
        setRating(0)
        onClose()
    }

    return (
            <ModalBackdrop visible={visible} onClose={handleOnClose} cardStyle={styles.card}>
                <View style={styles.inputContainer}>
                    <FontAwesome name="comments" style={styles.icon} />
                    <TextInput
                        style={styles.commentInput}
                        placeholder={t(TranslationKeys.Review.WRITE_REVIEW)}
                        multiline={true}
                        value={text}
                        autoComplete='off'
                        maxLength={250}
                        onChangeText={text => setText(text)}
                    />
                </View>
                <StarRating ratingValue={rating} onRatingChange={setRating} />
                <View style={styles.bottomContainer}>
                    <PillButton onPress={ handleOnAdd }>{t(TranslationKeys.Review.CREATE_REVIEW)}</PillButton>
                </View>
            </ModalBackdrop>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.dark,
    },
    commentInput: {
        width: '86%',
        marginRight: 10,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        minHeight: 60,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.extraLarge,
        marginVertical: SIZES.small,
        padding: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    icon: {
        marginRight: 10,
        color: COLORS.lightDark,
        fontSize: SIZES.extraLarge,
    },
    bottomContainer: {
        width: '100%',
        alignItems: 'center',
    },
})
