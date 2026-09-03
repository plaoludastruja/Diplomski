import { Text, StyleSheet, View, Image } from 'react-native'
import { memo } from 'react'
import { Comment } from '../model/model'
import { COLORS, SIZES } from '../constants/Colors'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

export const CardComment = memo(({ commentData }: { commentData: Comment }) => {
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
})

CardComment.displayName = 'CardComment'

const styles = StyleSheet.create({
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
    textInput: {
        width: '100%',
        color: COLORS.white,
        fontSize: SIZES.large,
        textAlign: 'left',
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
        color: COLORS.light,
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
