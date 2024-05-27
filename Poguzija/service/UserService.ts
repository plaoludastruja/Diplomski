import { User } from "@react-native-google-signin/google-signin"
import * as SecureStore from 'expo-secure-store'
import { db } from "./firebase"
import { getDoc, doc, serverTimestamp, setDoc, QueryDocumentSnapshot } from "firebase/firestore/lite"
import { DatabaseCollection, MyUser } from "../model/model"
import { v4 as uuidv4 } from 'uuid'
import { AddRecipesScheduler } from "./SchedulerService"

async function setUserMandatoryData(user: User) {
    let userAdded = await GetUser(user.user.id)
    if(!userAdded) {
        const recipeSchedulerId = uuidv4()
        AddRecipesScheduler(recipeSchedulerId, user.user.id)
        userAdded = await AddNewUser(user, recipeSchedulerId)
    }    
    const userValue = JSON.stringify(userAdded)
    SecureStore.setItemAsync('signedUser', userValue)
    return userAdded
}


export async function getCurrentUser() : Promise<MyUser> {
    let userValue = await SecureStore.getItemAsync('signedUser')
    console.log("Current user: " + userValue)
    return userValue != null ? JSON.parse(userValue) : null
}

async function AddNewUser(user: User, recipeSchedulerId: string) : Promise<MyUser> {
    const myUser: MyUser = {
        id: user.user.id,
        email: user.user.email,
        name: user.user.givenName || '',
        surname: user.user.familyName || '',
        fullName: user.user.name || '',
        profilePhoto: user.user.photo || '',
        aditionalUserData: {
            recipeSchedulerId: recipeSchedulerId
        },
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

export const userConverter = {
    toFirestore: (user: MyUser) => {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            aditionalUserData: {
                recipeSchedulerId: user.aditionalUserData.recipeSchedulerId
            },
            createdAt: serverTimestamp()
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as MyUser
        return { ...data, id: snapshot.id }
    }
}

export {
    setUserMandatoryData
}