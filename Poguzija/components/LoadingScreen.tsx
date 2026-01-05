import { ActivityIndicator } from 'react-native'
import BackgroundSafeAreaView from './BackgroundSafeAreaView'
import { COLORS } from '../constants/Colors'

export default function LoadingScreen() {
    return (
        <BackgroundSafeAreaView>
            <ActivityIndicator size="large" color={COLORS.tint} />
        </BackgroundSafeAreaView>
    )
}
