// ne valja mi slika i dugme
import { useContext } from 'react'
import { UserContext } from '../../app/_layout'
import { View, Image, StyleSheet, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { ProfileInfo } from './ProfileInfo'
import { PillButton } from '../Common/PillButton'
import { TranslationKeys } from '../../locales/_translationKeys'

const RegisterImage = require('../../assets/images/registerImage.png')

export const SignInSection = () => {
    const { t } = useTranslation()
    const { signInFn } = useContext(UserContext)
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height

    return (
        <>
            <ProfileInfo />
            <View style={styles.containerRegister}>
                <Image source={RegisterImage} style={[{ width: screenWidth, height: screenHeight / 2 }]} />
                <PillButton onPress={signInFn}>{t(TranslationKeys.Button.LOG_IN)}</PillButton>
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
