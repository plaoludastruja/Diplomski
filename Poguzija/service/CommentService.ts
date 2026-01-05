import { QueryDocumentSnapshot, addDoc, collection, getDocs, query, serverTimestamp } from "firebase/firestore/lite"
import { Comment, DatabaseCollection } from "../model/model"
import { db } from "./firebase"
import { GetCurrentUser } from "./AuthService"

async function GetCommentsForRecipe(recipeId: string) {
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes, recipeId, DatabaseCollection.comments).withConverter(commentConverter)))
    const commentsData = data.docs.map(doc => (doc.data()))
    return commentsData
}

async function AddComment(recipeId: string, comment: Partial<Comment>) {
    const user = await GetCurrentUser()
    if (!user) return
    addDoc(collection(db, DatabaseCollection.recipes, recipeId, DatabaseCollection.comments).withConverter(commentConverter), comment)
}

const commentConverter = {
    toFirestore: (comment: Comment) => {
        return {
            authorName: comment.authorName,
            authorProfilePhoto: comment.authorProfilePhoto,
            text: comment.text,
            createdAt: serverTimestamp()
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as Comment
        return { ...data, id: snapshot.id }
    }
}

export {
    GetCommentsForRecipe,
    AddComment,
}
