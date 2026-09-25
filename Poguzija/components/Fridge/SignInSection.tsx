import { useContext, useState } from 'react'
import { UserContext } from '../../app/_layout'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { ProfileInfo } from './ProfileInfo'
import { GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { TranslationKeys } from '../../locales/_translationKeys'

const RegisterImage = require('../../assets/images/registerImage.png')

export const SignInSection = () => {
    const { t } = useTranslation()
    const { signInFn } = useContext(UserContext)
    const screenHeight = Dimensions.get('window').height
    const [signingIn, setSigningIn] = useState(false)

    const handleSignIn = async () => {
        if (signingIn) return
        setSigningIn(true)
        try {
            await signInFn()
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setSigningIn(false)
        }
    }

    return (
        <>
            <ProfileInfo />
            <View style={styles.containerRegister}>
                <Image source={RegisterImage} style={[{ width: '100%', height: screenHeight / 2 }]} contentFit="contain" transition={300} />
                <GoogleSigninButton
                    style={styles.googleButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Light}
                    onPress={handleSignIn}
                    disabled={signingIn} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    containerRegister: {
        flex: 1,
        width: '95%',
        alignItems: 'center',
    },
    googleButton: {
        width: 240,
        height: 48,
    },
})
