import { Pressable, Text, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { memo } from 'react'
import { useRouter } from 'expo-router'
import { Comment, MyUser } from '../../model/model'
import { COLORS, SIZES } from '../../constants/Colors'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

export const CardComment = memo(({ commentData, author }: { commentData: Comment, author?: MyUser }) => {
    const router = useRouter()

    const handleOpenAuthor = () => {
        if (!author) return
        router.push(`/authorRecipes/${author.id}`)
    }

    return (
        <View style={styles.containerComment}>
            <View style={styles.containerAuthor}>
                <Pressable onPress={handleOpenAuthor}>
                    {author?.profilePhoto ?
                        <Image source={{ uri: author.profilePhoto }} style={styles.image} contentFit="cover" transition={300} /> :
                        <FontAwesome6 name="bowl-food" color={COLORS.light} style={styles.image} size={1.2 * SIZES.tabIcon} />}
                </Pressable>
                <View>
                    <Text style={styles.textInputName}>{author?.name}</Text>
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
        borderRadius: SIZES.small,
        marginEnd: SIZES.base,
    },
})
