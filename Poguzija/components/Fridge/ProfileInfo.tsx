import { Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { useContext, useRef } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { COLORS, SIZES } from '../../constants/Colors'
import { OptionsBottomSheet, OptionsBottomSheetRef } from '../Common/OptionsBottomSheet'
import { UserContext } from '../../app/_layout'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../../locales/_translationKeys'

export const ProfileInfo = () => {
    const { user, signInFn, signOutFn } = useContext(UserContext)
    const router = useRouter()
    const {t} = useTranslation()
    const optionsSheetRef = useRef<OptionsBottomSheetRef>(null)
    const options = user ?
        [
            { title: t(TranslationKeys.Settings.SETTINGS), code: 'settings' },
            { title: t(TranslationKeys.Button.LOG_OUT), code: 'signOut' },
        ]
        :
        [
            { title: t(TranslationKeys.Settings.SETTINGS), code: 'settings' },
            { title: t(TranslationKeys.Button.LOG_IN), code: 'signIn' },
        ]

    const handleOpenBookmarks = () => { router.push(`/bookmark`) }
    const handleOpenSettings = () => { router.push(`/settings`) }

    const handleAuthAction = async (action: () => Promise<void>) => {
        try {
            await action()
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        }
    }

    const handleSelect = (code: string) => {
        switch (code) {
            case 'signIn': { handleAuthAction(signInFn); break; }
            case 'signOut': { handleAuthAction(signOutFn); break; }
            case 'settings': { handleOpenSettings(); break; }
        }
    }

    return (
        <View style={styles.header}>
            {user && <FontAwesome name="bookmark-o" color={COLORS.lightDark} style={styles.icon} size={1.2 * SIZES.tabIcon} onPress={handleOpenBookmarks}/>}
            <Pressable style={styles.image} onPress={() => optionsSheetRef.current?.present()}>
                {user ?
                    <Image source={{ uri: user.profilePhoto }} style={styles.image} contentFit="cover" transition={300} /> :
                    <MaterialCommunityIcons name="dots-vertical" color={COLORS.lightDark} style={styles.image} size={1.2 * SIZES.tabIcon} />}
            </Pressable>
            <OptionsBottomSheet ref={optionsSheetRef} options={options} onSelect={handleSelect} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        width: '100%',
        height: 2 * SIZES.extraLarge,
    },
    image: {
        alignSelf: 'center',
        width: 1.2 * SIZES.tabIcon,
        height: 1.2 * SIZES.tabIcon,
        borderRadius: SIZES.small,
        marginEnd: SIZES.base,
    },
    icon: {
        alignSelf: 'center',
        width: 1.2 * SIZES.tabIcon,
        marginEnd: SIZES.base,
    },
})
