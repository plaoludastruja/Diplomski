import { StyleSheet, Image } from 'react-native'
const PlaceholderImage = require('../assets/images/food.jpg')

const ImageViewer = (selectedImage: {selectedImage: string | null}) => {
  const imageSource = selectedImage ? { selectedImage } : PlaceholderImage

  return <Image source={imageSource} style={styles.image} />
}

export default ImageViewer

const styles = StyleSheet.create({  
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
})
