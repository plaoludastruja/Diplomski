import { initializeApp } from 'firebase/app'
import { initializeAuth } from "@firebase/auth"
// @ts-expect-error
import { getReactNativePersistence } from "@firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from 'firebase/firestore/lite'
import { getFunctions } from 'firebase/functions'
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
    apiKey: "AIzaSyB-nLesxYZ-QvNS2Mbb4oWmYg6XTFuEheE",
    authDomain: "guzonja-85a45.firebaseapp.com",
    projectId: "guzonja-85a45",
    storageBucket: "guzonja-85a45.appspot.com",
    messagingSenderId: "679997496367",
    appId: "1:679997496367:web:48e3906eb4941ddee9bada"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})
const storage = getStorage(app)
const functions = getFunctions(app)

export {
    app,
    db,
    auth,
    storage,
    functions
}
