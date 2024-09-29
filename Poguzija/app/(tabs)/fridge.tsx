import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native'
import { useCallback, useContext, useEffect, useState } from 'react'
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView'
import { COLORS, SIZES } from '../../constants/Colors'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import ProfileInfo from '../../components/ProfileInfo'
import { UserContext } from '../_layout'
import MyRecipes from '../../components/MyRecipes'
import MyFridge from '../../components/MyFridge'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { TranslationKeys } from '../../locales/_translationKeys'
import { useTranslation } from 'react-i18next'
import i18n from '../../locales/_i18n'
const RegisterImage = require('../../assets/images/registerImage.png')

const renderMyRecipes = () => <MyRecipes />
const renderMyFridge = () => <MyFridge />

export default function FridgeScreen() {
    const { user, signInFn } = useContext(UserContext)
    const [index, setIndex] = useState(0)
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    const { t } = useTranslation()

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "679997496367-v24ck2ikahtou5jd89fa870fp9s83plt.apps.googleusercontent.com"
        })
    }, [])

    useEffect(() => {
        setRoutes([
            { key: 'myRecipes', title: t(TranslationKeys.Fridge.MY_RECIPES) },
            { key: 'myFridge', title: t(TranslationKeys.Fridge.MY_FRIDGE) },
        ])
    }, [i18n.language])

    const [routes, setRoutes] = useState([
        { key: 'myRecipes', title: t(TranslationKeys.Fridge.MY_RECIPES) },
        { key: 'myFridge', title: t(TranslationKeys.Fridge.MY_FRIDGE) },
    ])

    const renderScene = SceneMap({
        myRecipes: renderMyRecipes,
        myFridge: renderMyFridge,
    })

    const renderTabBar = useCallback((props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: COLORS.tint }}
            style={{ backgroundColor: COLORS.light, color: COLORS.tint, }}
            labelStyle={{ color: COLORS.tint, }}
        />
    ), [])

    return (
        <BackgroundSafeAreaView>
            {user ? (
                <>
                    <View style={styles.container}>
                        <ProfileInfo />
                        <Text style={styles.subtitleText}>{t(TranslationKeys.Fridge.MY_KITCHEN)}</Text>
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            renderTabBar={renderTabBar}
                        />
                    </View>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>{t(TranslationKeys.Fridge.SUGGEST_RECIPE)}</Text>
                    </Pressable>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>{t(TranslationKeys.Fridge.RANDOM_RECIPE)}</Text>
                    </Pressable>
                </>)
                : (
                    <>
                        <ProfileInfo />
                        <View style={styles.containerRegister}>
                            <Image source={RegisterImage} style={[{ width: screenWidth, height: screenHeight / 2 }]} />
                            <Pressable style={styles.button} onPress={() => { signInFn() }}>
                                <Text style={styles.buttonText}>{t(TranslationKeys.Button.LOG_IN)}</Text>
                            </Pressable>
                        </View>
                        
                    </>
                )}
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '95%',
    },
    containerRegister: {
        flex: 1,
        width: '95%',
        alignItems: 'center'
    },
    subtitleText: {
        width: '95%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        paddingHorizontal: SIZES.base,
        elevation: 2,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.large,
    },
    button: {
        textAlign: 'center',
        justifyContent: 'center',
        width: '85%',
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        marginVertical: SIZES.base,
        elevation: 2,
    },
})