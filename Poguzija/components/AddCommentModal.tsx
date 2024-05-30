import { Text, StyleSheet, View, Modal, Pressable, TextInput, FlatList } from 'react-native'
import { useState } from 'react'
import { COLORS, SIZES } from '../constants/Colors'

export const AddCommentModal = ({ visible, onAdd, onClose }) => {
    const [text, setText] = useState('')
    const handleClose = () => {
        onClose()
    }

    const handleOnAdd = () => {
        onAdd(text)
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
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write a comment..."
                        value={text}
                        autoComplete='off'
                        onChangeText={text => {
                            setText(text)
                        }}
                    />
                    <Pressable style={ styles.button } onPress={ handleOnAdd }>
                        <Text style={ styles.buttonText }>Comment</Text>
                    </Pressable>
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
        height: '50%',
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
    textInput: {
        width: '100%',
        height: '70%',
        margin: SIZES.medium,
        padding: SIZES.base,
        color: COLORS.tint,
        fontSize: SIZES.large,
        backgroundColor: COLORS.lightDark,
        borderRadius: SIZES.extraLarge
    },
})

