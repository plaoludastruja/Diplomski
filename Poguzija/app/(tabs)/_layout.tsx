import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs, useRouter } from 'expo-router'
import { Pressable, useColorScheme } from 'react-native'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../../constants/Colors'

export default function TabLayout() {
    const colorScheme = useColorScheme()
    const router = useRouter()
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
                    title: 'Hrana',
                    tabBarIcon: ({ color }) => <Ionicons name="fast-food" size={SIZES.tabIcon} color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Pretraga',
                    tabBarIcon: ({ color }) => <Ionicons name="search" size={SIZES.tabIcon} color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="addRecipes"
                options={{
                    title: 'Kreiraj recept',
                    tabBarIcon: ({ color }) => <MaterialIcons name="create" size={SIZES.tabIcon} color={color} />,
                    headerShown: false
                }}
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault()
                        router.push(`/addRecipe`)
                    },
                })}
            />
            <Tabs.Screen
                name="scheduler"
                options={{
                    title: 'Plan jela',
                    tabBarIcon: ({ color }) => <Ionicons name="calendar" size={SIZES.tabIcon} color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="fridge"
                options={{
                    title: 'Moj frižider',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="fridge" size={SIZES.tabIcon} color={color} />,
                    headerShown: false
                }}
            />
        </Tabs>
    )
}
