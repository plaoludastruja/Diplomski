import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { DefaultTheme, SplashScreen, Stack, ThemeProvider } from 'expo-router'
import { createContext, useEffect, useState } from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { COLORS, ALERT_COLORS } from '../constants/Colors'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { MyUser } from '../model/model'
import { SignIn, SignOut, GetCurrentUser, EnsureAnonymousSession } from '../service/AuthService'
import { AlertNotificationRoot } from 'react-native-alert-notification'
import { I18nextProvider } from 'react-i18next'
import i18n from '../locales/_i18n'

export { ErrorBoundary, } from 'expo-router'

export const unstable_settings = { initialRouteName: '(tabs)', }

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    })

    useEffect(() => {
        if (error) throw error
    }, [error])

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) {
        return null
    }

    return <RootLayoutNav />
}

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.dark
    }
}

interface UserContextType {
    user: MyUser | undefined
    signInFn: () => Promise<void>
    signOutFn: () => Promise<void>
}

interface SchedulerContextType {
    refreshSchedulerTick: number,
    triggerSchedulerRefresh: () => void
}

export const UserContext = createContext<UserContextType>({ user: undefined, signInFn: async () => { }, signOutFn: async () => { } })
export const SchedulerContext = createContext<SchedulerContextType>({ refreshSchedulerTick: 0, triggerSchedulerRefresh: () => { } })

function RootLayoutNav() {
    const [user, setUser] = useState<MyUser>()
    const [refreshSchedulerTick, setRefreshSchedulerTick] = useState(0)
    const triggerSchedulerRefresh = () => setRefreshSchedulerTick(tick => tick + 1)

    const getCurrentUserFn = async () => {
        const user = await GetCurrentUser()
        setUser(user ?? undefined)
    }

    useEffect(() => {
        getCurrentUserFn()
        EnsureAnonymousSession()
    }, [])

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "679997496367-v24ck2ikahtou5jd89fa870fp9s83plt.apps.googleusercontent.com"
        })
    }, [])

    const signInFn = async () => {
        const user = await SignIn()
        setUser(user)
    }

    const signOutFn = async () => {
        setUser(undefined)
        await SignOut()
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
            <ThemeProvider value={theme}>
            <UserContext.Provider value={{ user, signInFn, signOutFn }}>
            <SchedulerContext.Provider value={{ refreshSchedulerTick, triggerSchedulerRefresh }}>
            <AlertNotificationRoot colors={[ALERT_COLORS, ALERT_COLORS]}>
            <I18nextProvider i18n={i18n}>
                <Stack >
                    <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />
                    <Stack.Screen name="(foodRecipesItem)/foodRecipesItem/[foodRecipesItemId]" options={{ headerShown: false, }}/>
                    <Stack.Screen name="(authorRecipes)/authorRecipes/[authorId]" options={{ headerShown: false, }}/>
                    <Stack.Screen name="(addRecipe)/addRecipe" options={{ headerShown: false, }}/>
                    <Stack.Screen name="(bookmark)/bookmark" options={{ headerShown: false, }}/>
                    <Stack.Screen name="(comments)/comments/[commentRecipeId]" options={{ headerShown: false, }}/>
                    <Stack.Screen name="(settings)/settings" options={{ headerShown: false, }}/>
                </Stack>
            </I18nextProvider>
            </AlertNotificationRoot>
            </SchedulerContext.Provider>
            </UserContext.Provider>
            </ThemeProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}
