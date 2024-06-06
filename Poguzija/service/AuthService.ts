import { GoogleSignin } from '@react-native-google-signin/google-signin'
import * as SecureStore from 'expo-secure-store'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from './firebase'
import { GetOrAddUser } from './UserService'
import { MyUser } from '../model/model'

async function SignIn(): Promise<MyUser> {
    try {
        await GoogleSignin.hasPlayServices()
        const user = await GoogleSignin.signIn()
        const credential = GoogleAuthProvider.credential(user.idToken)
        await signInWithCredential(auth, credential)
        if (!auth.currentUser) return
        return await GetOrAddUser(user, auth.currentUser)
    } catch (e) {
        throw e
    }
}

function SignOut() {
    try {
        GoogleSignin.revokeAccess()
        GoogleSignin.signOut()
        SecureStore.deleteItemAsync('signedUser')
    } catch (e) {
        throw e
    }
}

function SetCurrentUser(userAdded: MyUser) {
    const userValue = JSON.stringify(userAdded)
    SecureStore.setItemAsync('signedUser', userValue)
}

async function GetCurrentUser(): Promise<MyUser> {
    let userValue = await SecureStore.getItemAsync('signedUser')
    return userValue != null ? JSON.parse(userValue) : null
}

export {
    SignIn,
    SignOut,
    GetCurrentUser,
    SetCurrentUser
}
