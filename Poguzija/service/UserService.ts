import { db } from './firebase'
import { getDoc, doc, serverTimestamp, setDoc, QueryDocumentSnapshot } from 'firebase/firestore/lite'
import { DatabaseCollection, MyUser } from '../model/model'
import { AddRecipesScheduler } from './SchedulerService'
import { AddFridge } from './FridgeService'
import { AddBookmark } from './BookmarkService'
import { User as AuthUser } from 'firebase/auth'
import { User } from '@react-native-google-signin/google-signin'
import { SetCurrentUser } from './AuthService'


async function GetOrAddUser(user: User, authUser: AuthUser) {
    let userAdded = await GetUser(authUser.uid)
    if (!userAdded) {
        AddUserAdditionalData(authUser.uid)
        userAdded = await AddUser(user, authUser)
    }
    SetCurrentUser(userAdded)
    return userAdded
}

async function AddUser(user: User, authUser: AuthUser): Promise<MyUser> {
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
    return myUser
}

async function GetUser(id: string): Promise<MyUser> {
    const data = await getDoc(doc(db, DatabaseCollection.users, id).withConverter(userConverter))
    if (data.exists()) {
        const user = data.data()
        return user
    }
    return
}

function AddUserAdditionalData(uid: string) {
    AddRecipesScheduler(uid)
    AddFridge(uid)
    AddBookmark(uid)
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
