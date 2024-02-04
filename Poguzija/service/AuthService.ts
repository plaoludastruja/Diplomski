import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import * as SecureStore from 'expo-secure-store';

async function signIn() : Promise<User> {
    try {
        await GoogleSignin.hasPlayServices();
        const user = await GoogleSignin.signIn();
        const userValue = JSON.stringify(user);
        SecureStore.setItemAsync('signedUser', userValue);
        return user;
    } catch (e) {
        throw e;
    }
}

function signOut() {
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    SecureStore.deleteItemAsync('signedUser');
}

async function getCurrentUser() : Promise<User> {
    let userValue = await SecureStore.getItemAsync('signedUser');
    console.log("Current user: " + userValue);
    return userValue != null ? JSON.parse(userValue) : null;
}

export {
    signIn,
    signOut,
    getCurrentUser
}