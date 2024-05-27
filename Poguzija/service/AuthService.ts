import { GoogleSignin } from "@react-native-google-signin/google-signin"
import * as SecureStore from 'expo-secure-store'
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"
import { auth } from "./firebase"
import { setUserMandatoryData } from "./UserService"
import { MyUser } from "../model/model"

async function signIn() : Promise<MyUser> {
    try {
        await GoogleSignin.hasPlayServices()
        const user = await GoogleSignin.signIn()
        const credential = GoogleAuthProvider.credential(user.idToken)
        signInWithCredential(auth, credential)
        const myUser = await setUserMandatoryData(user)
        return myUser
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

export {
    signIn,
    signOut
}