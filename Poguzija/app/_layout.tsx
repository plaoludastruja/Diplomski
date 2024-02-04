import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS } from '../constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export { ErrorBoundary, } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)', };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.gray
    }
};

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={theme}>
                    <Stack >
                        <Stack.Screen name="(tabs)" options={{
                            headerShown: false,
                            navigationBarColor: COLORS.light,
                        }} />
                        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                        <Stack.Screen name="foodRecipesItem/[foodRecipesItem]" options={{ headerShown: false, }}/>
                        <Stack.Screen name="addRecipe" options={{ headerShown: false, }}/>
                    </Stack>
                </ThemeProvider>
            </GestureHandlerRootView>
                
    );
}
