import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.tint,
                tabBarInactiveTintColor: COLORS.lightDark,
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.light,
                    borderTopWidth: 0,
                    height: 2.5 * SIZES.tabIcon,
                    borderTopEndRadius: SIZES.tabIcon,
                    borderTopStartRadius: SIZES.tabIcon,
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Hrana',
                    tabBarIcon: ({ color }) => <Ionicons name="fast-food" size={SIZES.tabIcon} color={color} />,
                    headerShown: false,
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome
                                        name="info-circle"
                                        size={25}
                                        color={COLORS.gray}
                                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
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
    );
}
