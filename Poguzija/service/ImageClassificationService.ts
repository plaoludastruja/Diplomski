import * as FileSystem from 'expo-file-system/legacy'
import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'

export interface CheckImageContentResult {
    approved: boolean
    reason?: 'not_food' | 'unsafe'
}

const checkImageContent = httpsCallable<{ imageBase64: string }, CheckImageContentResult>(functions, 'checkImageContent')

async function ValidateRecipeImage(imageUri: string): Promise<CheckImageContentResult> {
    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' })
    const result = await checkImageContent({ imageBase64 })
    return result.data
}

export {
    ValidateRecipeImage,
}
