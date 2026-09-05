import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin'
import * as SecureStore from 'expo-secure-store'
import { GoogleAuthProvider, signInWithCredential, signInAnonymously, linkWithCredential } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from './firebase'
import { GetOrAddUser } from './UserService'
import { MyUser } from '../model/model'

async function EnsureAnonymousSession() {
    if (!auth.currentUser) {
        await signInAnonymously(auth)
    }
}

function GetCurrentAuthUid(): string | undefined {
    return auth.currentUser?.uid
}

async function SignIn(): Promise<MyUser | undefined> {
    try {
        let user
        await GoogleSignin.hasPlayServices()
        const response = await GoogleSignin.signIn()
        if (isSuccessResponse(response)) {
            user = response.data
        }else {
            return
        }
        const credential = GoogleAuthProvider.credential(user.idToken)
        if (auth.currentUser?.isAnonymous) {
            try {
                await linkWithCredential(auth.currentUser, credential)
            } catch (linkError) {
                if (linkError instanceof FirebaseError && linkError.code === 'auth/credential-already-in-use') {
                    await signInWithCredential(auth, credential)
                } else {
                    throw linkError
                }
            }
        } else {
            await signInWithCredential(auth, credential)
        }
        if (!auth.currentUser) return
        return await GetOrAddUser(user, auth.currentUser)
    } catch (e) {
        throw e
    }
}

async function SignOut() {
    try {
        await GoogleSignin.revokeAccess()
        await GoogleSignin.signOut()
        await SecureStore.deleteItemAsync('signedUser')
        await auth.signOut()
        await EnsureAnonymousSession()
    } catch (e) {
        throw e
    }
}

function SetCurrentUser(userAdded: MyUser) {
    const userValue = JSON.stringify(userAdded)
    SecureStore.setItemAsync('signedUser', userValue)
}

async function GetCurrentUser(): Promise<MyUser | null> {
    let userValue = await SecureStore.getItemAsync('signedUser')
    return userValue != null ? JSON.parse(userValue) : null
}

export {
    SignIn,
    SignOut,
    GetCurrentUser,
    SetCurrentUser,
    EnsureAnonymousSession,
    GetCurrentAuthUid
}
