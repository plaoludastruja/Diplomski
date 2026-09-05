//ok
import { useCallback, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import { useTranslation } from 'react-i18next'
import { ProfileInfo } from './ProfileInfo'
import { MyFridge } from './MyFridge'
import { MyRecipes } from './MyRecipes'
import { RecipeSuggestions } from './RecipeSuggestions'
import { SubtitleText } from '../Common/SubtitleText'
import { COLORS } from '../../constants/Colors'
import { TranslationKeys } from '../../locales/_translationKeys'

const renderMyRecipes = () => <MyRecipes />
const renderMyFridge = () => <MyFridge />
const renderScene = SceneMap({
    myRecipes: renderMyRecipes,
    myFridge: renderMyFridge,
})

export const MyKitchen = () => {
    const { t } = useTranslation()
    const [index, setIndex] = useState(0)
    const routes = [
        { key: 'myRecipes', title: t(TranslationKeys.Fridge.MY_RECIPES) },
        { key: 'myFridge', title: t(TranslationKeys.Fridge.MY_FRIDGE) },
    ]

    const renderTabBar = useCallback((props: any) => (
        <TabBar
            {...props}
            activeColor={COLORS.tint}
            inactiveColor={COLORS.tint}
            indicatorStyle={{ backgroundColor: COLORS.tint }}
            style={{ backgroundColor: COLORS.light }}
        />
    ), [])

    return (
        <View style={styles.root}>
            <View style={styles.container}>
                <ProfileInfo />
                <SubtitleText style={styles.subtitleText}>{t(TranslationKeys.Fridge.MY_KITCHEN)}</SubtitleText>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    renderTabBar={renderTabBar}
                />
            </View>
            <RecipeSuggestions />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: '95%',
    },
    subtitleText: {
        paddingVertical: 0,
    },
})
