import { GoogleSignin } from "@react-native-google-signin/google-signin"
import * as SecureStore from 'expo-secure-store'
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithRedirect } from "firebase/auth"
import { auth } from "./firebase"
import { GetOrAddUser } from "./UserService"
import { MyUser } from "../model/model"

async function signIn(): Promise<MyUser> {
    try {
        await GoogleSignin.hasPlayServices()
        const user = await GoogleSignin.signIn()
        const credential = GoogleAuthProvider.credential(user.idToken)
        await signInWithCredential(auth, credential)
        if(!auth.currentUser) return 
        return await GetOrAddUser(user, auth.currentUser)
    } catch (e) {
        throw e
    }
}

function signOut() {
    try {
        GoogleSignin.revokeAccess()
        GoogleSignin.signOut()
        SecureStore.deleteItemAsync('signedUser')
    } catch (e) {
        throw e
    }
}


async function getCurrentUser() : Promise<MyUser> {
    let userValue = await SecureStore.getItemAsync('signedUser')
    console.log("Current user: " + userValue)
    return userValue != null ? JSON.parse(userValue) : null
}

export {
    signIn,
    signOut,
    getCurrentUser
}