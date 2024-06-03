import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { COLORS } from '../constants/Colors'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MyUser } from '../model/model'
import { signIn, signOut } from '../service/AuthService'
import { getCurrentUser } from '../service/AuthService'

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

export const UserContext = createContext<UserContextType>({ user: undefined, signInFn: async () => {}, signOutFn: () => {} })
export const SchedulerContext = createContext<SchedulerContextType>({refreshScheduler: false,setRefreshScheduler: () => {}})

function RootLayoutNav() {
    const colorScheme = useColorScheme()
    const [user, setUser] = useState<MyUser>()
    const [refreshScheduler, setRefreshScheduler] = useState(true)
    useEffect(() => {
        getCurrentUserFn()
    }, [])
    const getCurrentUserFn = async () => {
        const user = await getCurrentUser()
        setUser(user)
    }

    const signInFn = async () => {
        const user = await signIn()
        setUser(user)
    }

    const signOutFn = () => {
        setUser(undefined)
        signOut()
    }

    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={theme}>
                <UserContext.Provider value={{ user, signInFn, signOutFn }}>
                <SchedulerContext.Provider value={{ refreshScheduler, setRefreshScheduler }}>
                    <Stack >
                        <Stack.Screen name="(tabs)" options={{
                            headerShown: false,
                            navigationBarColor: COLORS.light,
                        }} />
                        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="(foodRecipesItem)/foodRecipesItem/[foodRecipesItemId]" options={{ headerShown: false, }}/>
                        <Stack.Screen name="(addRecipe)/addRecipe" options={{ headerShown: false, }}/>
                        <Stack.Screen name="(scheduler)/addToScheduler/[addToSchedulerByDay]" options={{ headerShown: true, headerTitle: 'Choose recipe' }}/>
                        <Stack.Screen name="(bookmark)/bookmark" options={{ headerShown: false, }}/>
                        <Stack.Screen name="(comments)/comments/[commentRecipeId]" options={{ headerShown: false, }}/>
                    </Stack>
                </SchedulerContext.Provider>
                </UserContext.Provider>
            </ThemeProvider>
        </GestureHandlerRootView>
                
    )
}
