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
const RegisterImage = require('../../assets/images/registerImage.png')

const renderMyRecipes = () => <MyRecipes />
const renderMyFridge = () => <MyFridge />

export default function FridgeScreen() {
    const { user, signInFn } = useContext(UserContext)
    const [index, setIndex] = useState(0)
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "679997496367-v24ck2ikahtou5jd89fa870fp9s83plt.apps.googleusercontent.com"
        })
    }, [])
    
    const [routes] = useState([
        { key: 'myRecipes', title: 'My Recipes' },
        { key: 'myFridge', title: 'My Fridge' },
    ])

    const renderScene = SceneMap({
        myRecipes: renderMyRecipes,
        myFridge: renderMyFridge,
    })

    const renderLabel = (props:any) => (
        <Text
            style={{ backgroundColor: COLORS.light, color: COLORS.tint, }}
        />
    )
    const renderTabBar = useCallback((props:any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: COLORS.tint }}
            style={{ backgroundColor: COLORS.light, color: COLORS.tint, }}
            labelStyle={{ color: COLORS.tint,  }}
        />
    ), [])
    
    return (
        <BackgroundSafeAreaView>
            { user ? (
            <>
                <View style={styles.container}>
                    <ProfileInfo />
                    <Text style={styles.subtitleText}>My kitchen</Text>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        renderTabBar={renderTabBar}
                    />
                </View>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Suggest what to cook</Text>
                </Pressable>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Find my random recipe</Text>
                </Pressable>
            </>) 
            :(
            <>
                <ProfileInfo />
                <Image source={RegisterImage} style={[{ width: screenWidth, height: screenHeight / 2 }]} />
                <Pressable style={styles.button}
                    onPress={() => { signInFn()
                }}>
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
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