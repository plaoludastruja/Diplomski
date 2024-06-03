import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "./firebase"
import { v4 as uuidv4 } from 'uuid'
import { StorageFolder } from "../model/model"

async function UploadFoodRecipesImages(selectedImages: string[]): Promise<string[]> {
    const urls = []
    const folder = StorageFolder.FoodRecipesImages
    for (var selectedImage of selectedImages) {
        const url = await uploadImage(selectedImage, folder)
        urls.push(url)
    }
    return urls
}

async function uploadImage(selectedImage: string, folder: string): Promise<string> {
    const imageName = generateUniqueName()
    const imageRef = ref(storage, `${folder}/${imageName}`)
    const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
            resolve(xhr.response)
        }
        xhr.onerror = function () {
            reject(new TypeError('Network request failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', selectedImage, true)
        xhr.send(null)
    })
    await uploadBytes(imageRef, blob)
    const url = await getDownloadURL(imageRef)
    return url
}

function generateUniqueName() {
    const guid = uuidv4()
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    const formattedDate = `${year}${month}${day}_${hours}${minutes}${seconds}`
    const uniqueName = `${guid}_${formattedDate}`
    return uniqueName
}

export {
    UploadFoodRecipesImages,
}
