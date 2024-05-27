import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from 'firebase/firestore/lite'


// TODO: Replace the following with your app's Firebase project configuration
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
const auth = getAuth(app)
const storage = getStorage(app)

export {
    app,
    db,
    auth,
    storage
}