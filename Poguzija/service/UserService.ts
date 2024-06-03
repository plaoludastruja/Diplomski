import * as SecureStore from 'expo-secure-store'
import { auth, db } from "./firebase"
import { getDoc, doc, serverTimestamp, setDoc, QueryDocumentSnapshot } from "firebase/firestore/lite"
import { AdditionalUserData, DatabaseCollection, MyUser } from "../model/model"
import { v4 as uuidv4 } from 'uuid'
import { AddRecipesScheduler } from "./SchedulerService"
import { AddFridge } from "./FridgeService"
import { AddBookmark } from "./BookmarkService"
import { User as AuthUser } from 'firebase/auth'
import { User } from "@react-native-google-signin/google-signin"


async function GetOrAddUser(user: User, authUser: AuthUser) {
    let userAdded = await GetUser(authUser.uid)
    if(!userAdded) { 
        AddRecipesScheduler(authUser.uid)
        AddFridge(authUser.uid)
        AddBookmark(authUser.uid)
        userAdded = await AddNewUser(user, authUser)
    }    
    const userValue = JSON.stringify(userAdded)
    SecureStore.setItemAsync('signedUser', userValue)
    return userAdded
}

async function AddNewUser(user: User, authUser: AuthUser) : Promise<MyUser> {
    const myUser: MyUser = {
        id: authUser.uid,
        email: user.user.email,
        name: user.user.givenName || '',
        surname: user.user.familyName || '',
        fullName: user.user.name || '',
        profilePhoto: user.user.photo || '',
        createdAt: serverTimestamp()
    }
    setDoc(doc(db, DatabaseCollection.users, myUser.id), myUser)
    console.log('Data added at AddNewUser()')
    return myUser 
}

async function GetUser(id: string): Promise<MyUser> {
    const data = await getDoc(doc(db, DatabaseCollection.users, id).withConverter(userConverter))
    console.log('Data fetched at GetUser()')
    if (data.exists()) {
        const user = data.data()
        return user
    }
    return
}

const userConverter = {
    toFirestore: (user: MyUser) => {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            createdAt: serverTimestamp()
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as MyUser
        return { ...data, id: snapshot.id }
    }
}

export {
    GetOrAddUser,
    userConverter
}