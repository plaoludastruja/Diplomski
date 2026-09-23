import { QueryDocumentSnapshot, QueryConstraint, addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, startAfter } from "firebase/firestore/lite"
import { Comment, DatabaseCollection } from "../model/model"
import { db } from "./firebase"
import { GetCurrentUser } from "./AuthService"
import { COMMENTS_RESULT_LIMIT } from "../constants/Firestore"

async function GetCommentsForRecipe(recipeId: string, lastVisible: QueryDocumentSnapshot | undefined) {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(COMMENTS_RESULT_LIMIT)]
    if (lastVisible) {
        constraints.push(startAfter(lastVisible))
    }
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes, recipeId, DatabaseCollection.comments).withConverter(commentConverter), ...constraints))
    const commentsData = data.docs.map(doc => (doc.data()))
    const newLastVisible = data.docs[data.docs.length - 1] || null
    return { commentsData, newLastVisible }
}

async function AddComment(recipeId: string, comment: Partial<Comment>) {
    const user = await GetCurrentUser()
    if (!user) return
    addDoc(collection(db, DatabaseCollection.recipes, recipeId, DatabaseCollection.comments).withConverter(commentConverter), comment)
}

const commentConverter = {
    toFirestore: (comment: Comment) => {
        return {
            authorId: comment.authorId,
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
