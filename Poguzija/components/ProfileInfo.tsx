import { Text, StyleSheet, View, Image, Pressable, TextInput } from 'react-native'
import React, { Component, FC, useContext, useEffect, useState } from 'react'
import { Ingredient, MyComponentProps, MyUser } from '../model/model'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLORS, SIZES } from '../constants/Colors'
import SelectDropdown from 'react-native-select-dropdown'
import { UserContext } from '../app/_layout'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useRouter } from 'expo-router'
import i18next from 'i18next'
import * as SecureStore from 'expo-secure-store'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../locales/_translationKeys'

const ProfileInfo = () => {
    const { user, signInFn, signOutFn } = useContext(UserContext)
    const router = useRouter()
    const {t} = useTranslation()
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "679997496367-v24ck2ikahtou5jd89fa870fp9s83plt.apps.googleusercontent.com"
        })
    }, [])
    const emojisWithIcons = user ? 
        [
            { title: t(TranslationKeys.Settings.SETTINGS), code: 'settings' },
            { title: t(TranslationKeys.Button.LOG_OUT), code: 'signOut' },
        ]
        :
        [
            { title: t(TranslationKeys.Settings.SETTINGS), code: 'settings' },
            { title: t(TranslationKeys.Button.LOG_IN), code: 'signIn' },
        ]
    
    const handleOpenBookmarks = () => {
        router.push(`/bookmark`)
    }

    const handleOpenSettings = () => {
        router.push(`/settings`)
    }
    
    return (
        <View style={styles.header}>
            {user && <FontAwesome name="bookmark-o" color={COLORS.lightDark} style={styles.image} size={1.2 * SIZES.tabIcon} onPress={handleOpenBookmarks}/>}
            <SelectDropdown
                data={emojisWithIcons}
                onSelect={(selectedItem, index) => {
                    switch(selectedItem.code){
                        case 'signIn': {signInFn(); break;}
                        case 'signOut': {signOutFn(); break;}
                        case 'settings': { handleOpenSettings(); break;} 
                    }
                }}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View style={styles.image}>
                            {user ?
                                <Image source={{ uri: user.profilePhoto }} style={styles.image} /> : 
                                <MaterialCommunityIcons name="dots-vertical" color={COLORS.lightDark} style={styles.image} size={1.2 * SIZES.tabIcon} />}
                        </View>
                    )
                }}
                renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{ ...styles.dropdownItemStyle }}>
                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                        </View>
                    )
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
            />
        </View>
        
    )
}


const styles = StyleSheet.create({
    header: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        width: '100%',
        height: 2 * SIZES.extraLarge,
    },
    image: {
        alignSelf: 'center',
        width: 1.2 * SIZES.tabIcon,
        height: 1.2 * SIZES.tabIcon,
        borderRadius: SIZES.large,
        marginEnd: SIZES.base,
    },


    dropdownMenuStyle: {
        width: 'auto',
        padding: SIZES.base,
        paddingEnd: 0,
        marginStart: -145,
        marginTop: -30,
        borderRadius: SIZES.base,
        borderTopEndRadius: 0,
    },
    dropdownItemStyle: {
        paddingHorizontal: SIZES.medium,
        alignItems: 'flex-end',
        paddingVertical: SIZES.base,
        width: '100%'
    },
    dropdownItemTxtStyle: {
        flex: 1,
        width: '100%',
        textAlign: 'right',
        fontSize: SIZES.large,
        fontWeight: '500',
        color: COLORS.lightDark,
    },
})

export default ProfileInfo