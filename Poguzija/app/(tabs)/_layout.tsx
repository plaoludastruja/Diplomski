import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs, useRouter } from 'expo-router'
import { Pressable, useColorScheme } from 'react-native'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../../constants/Colors'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../../locales/_translationKeys'

export default function TabLayout() {
    const colorScheme = useColorScheme()
    const router = useRouter()
    const { t } = useTranslation()
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.tint,
                tabBarInactiveTintColor: COLORS.lightDark,
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.light,
                    borderTopEndRadius: SIZES.tabIcon,
                    borderTopStartRadius: SIZES.tabIcon,
                    paddingTop: SIZES.base
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t(TranslationKeys.Tab.FOOD),
                    tabBarIcon: ({ color }) => <Ionicons name="fast-food" size={SIZES.tabIcon} color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: t(TranslationKeys.Tab.SEARCH),
                    tabBarIcon: ({ color }) => <Ionicons name="search" size={SIZES.tabIcon} color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="addRecipes"
                options={{
                    title: t(TranslationKeys.Tab.CREATE_RECIPE),
                    tabBarIcon: ({ color }) => <MaterialIcons name="create" size={SIZES.tabIcon} color={color} />,
                    headerShown: false,
                    tabBarButton: ({ ref, ...props }) => (
                        <Pressable {...props} onPress={() => router.push('/addRecipe')} />
                    ),
                }}
            />
            <Tabs.Screen
                name="scheduler"
                options={{
                    title: t(TranslationKeys.Tab.MEAL_PLAN),
                    tabBarIcon: ({ color }) => <Ionicons name="calendar" size={SIZES.tabIcon} color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="fridge"
                options={{
                    title: t(TranslationKeys.Tab.MY_FRIDGE),
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="fridge" size={SIZES.tabIcon} color={color} />,
                    headerShown: false
                }}
            />
        </Tabs>
    )
}
