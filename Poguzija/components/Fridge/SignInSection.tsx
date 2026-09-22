import { useContext, useState } from 'react'
import { UserContext } from '../../app/_layout'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { ProfileInfo } from './ProfileInfo'
import { PillButton } from '../Common/PillButton'
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
        } finally {
            setSigningIn(false)
        }
    }

    return (
        <>
            <ProfileInfo />
            <View style={styles.containerRegister}>
                <Image source={RegisterImage} style={[{ width: '100%', height: screenHeight / 2 }]} contentFit="contain" transition={300} />
                <PillButton onPress={handleSignIn} loading={signingIn}>{t(TranslationKeys.Button.LOG_IN)}</PillButton>
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
})
