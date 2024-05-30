import { Text, StyleSheet, View, Modal, Pressable, TextInput, FlatList } from 'react-native'
import { useState } from 'react'
import { COLORS, SIZES } from '../constants/Colors'
import { StarRating } from './StartRating'
import { FontAwesome } from '@expo/vector-icons'

export const AddCommentModal = ({ visible, onAdd, onClose }) => {
    const [text, setText] = useState('')
    const [rating, setRating] = useState(0)
    const handleClose = () => {
        onClose()
    }

    const handleOnAdd = () => {
        onAdd(text, rating)
        setText('')
        setRating(0)
        onClose()
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={ () => handleClose() }>
            <Pressable style={styles.centeredView} onPress={ () => handleClose() }>
                <View style={styles.modalView}>
                    <View style={styles.inputContainer}>
                        <FontAwesome name="comments" style={styles.icon} />
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Write a review..."
                            multiline={true}
                            value={text}
                            autoComplete='off'
                            maxLength={250}
                            onChangeText={text => setText(text)}
                        />
                    </View>
                    <View style={styles.bottomContainer}>
                        <StarRating ratingValue={rating} onRatingChange={setRating} />
                        <Pressable style={ styles.button } onPress={ handleOnAdd }>
                            <Text style={ styles.buttonText }>Comment</Text>
                        </Pressable>
                    </View>
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
        justifyContent: 'space-between',
        minHeight: '30%',
        width: '80%',
        backgroundColor: COLORS.dark,
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
    button: {
        textAlign: 'center',
        justifyContent: 'center',
        verticalAlign: 'bottom',
        width: '85%',
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        marginVertical: SIZES.base,
        elevation: 2,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.large,
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
        backgroundColor: COLORS.light,
        borderRadius: SIZES.extraLarge,
        marginVertical: SIZES.small,
        padding: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    icon: {
        marginRight: 10,
        color: COLORS.lightDark,
        fontSize: SIZES.extraLarge
    },
    bottomContainer: {
        width: '100%',
        alignItems: 'center',
    },
})

