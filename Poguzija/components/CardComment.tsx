import { Text, StyleSheet, View, Image } from 'react-native'
import { Comment } from '../model/model'
import { COLORS, SIZES } from '../constants/Colors'
import { FC } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

export const CardComment: FC<{ commentData: Comment}> = ({ commentData }): JSX.Element => {
    return (
        <View style={styles.containerComment}>
            <View style={styles.containerAuthor}>
                {commentData.authorProfilePhoto ?
                                    <Image source={{ uri: commentData.authorProfilePhoto }} style={styles.image} /> : 
                                    <FontAwesome6 name="bowl-food" color={COLORS.light} style={styles.image} size={1.2 * SIZES.tabIcon} />}
                <View>
                <Text style={styles.textInputName}>{commentData.authorName}</Text>
                <Text style={styles.textInputDate}>{` ${commentData.createdAt.toDate().getDate()}.${commentData.createdAt.toDate().getMonth()}.${commentData.createdAt.toDate().getFullYear()}.`}</Text>
                </View>
                
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.textInput}>       {commentData.text}</Text>
            </View>
        </View>
        
    )
}


const styles = StyleSheet.create({
    flex: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },   
    containerAuthor: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 60,
    },     
    containerComment: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: COLORS.dark,
        borderTopEndRadius: SIZES.extraLarge,
        borderTopStartRadius: SIZES.extraLarge,
        borderBottomStartRadius: SIZES.extraLarge,
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.small,
    }, 
    textContainer: {
        width: '100%',
        paddingHorizontal: SIZES.small,
        paddingBottom: SIZES.medium,
    },   
    infoContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        backgroundColor: COLORS.dark,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    textInput: {
        width: '100%',
        color: COLORS.light,
        fontSize: SIZES.large,
        textAlign: 'left'
    },
    textInputName: {
        width: '100%',
        marginRight: 10,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    textInputDate: {
        width: '100%',
        marginRight: 10,
        color: COLORS.darkLight,
        fontSize: SIZES.font,
    },
    image: {
        alignSelf: 'center',
        width: 1.2 * SIZES.tabIcon,
        height: 1.2 * SIZES.tabIcon,
        borderRadius: SIZES.large,
        marginEnd: SIZES.base,
    },
})
