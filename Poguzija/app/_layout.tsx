import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { DarkTheme, DefaultTheme, SplashScreen, Stack, ThemeProvider } from 'expo-router'
import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { COLORS } from '../constants/Colors'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MyUser } from '../model/model'
import { SignIn, SignOut } from '../service/AuthService'
import { GetCurrentUser } from '../service/AuthService'
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
    signOutFn: () => void
}

interface SchedulerContextType {
    refreshScheduler: boolean,
    setRefreshScheduler: Dispatch<SetStateAction<boolean>>
}

export const UserContext = createContext<UserContextType>({ user: undefined, signInFn: async () => { }, signOutFn: () => { } })
export const SchedulerContext = createContext<SchedulerContextType>({ refreshScheduler: false, setRefreshScheduler: () => { } })

function RootLayoutNav() {
    const colorScheme = useColorScheme()
    const [user, setUser] = useState<MyUser>()
    const [refreshScheduler, setRefreshScheduler] = useState(true)
    useEffect(() => {
        getCurrentUserFn()
    }, [])
    const getCurrentUserFn = async () => {
        const user = await GetCurrentUser()
        setUser(user)
    }

    const signInFn = async () => {
        const user = await SignIn()
        setUser(user)
    }

    const signOutFn = () => {
        setUser(undefined)
        SignOut()
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={theme}>
            <UserContext.Provider value={{ user, signInFn, signOutFn }}>
            <SchedulerContext.Provider value={{ refreshScheduler, setRefreshScheduler }}>
            <AlertNotificationRoot colors={[{ card: COLORS.dark, label: COLORS.white }]}>
            <I18nextProvider i18n={i18n}>
                <Stack >
                    <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />
                    <Stack.Screen name="(foodRecipesItem)/foodRecipesItem/[foodRecipesItemId]" options={{ headerShown: false, }}/>
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
        </GestureHandlerRootView>
    )
}
