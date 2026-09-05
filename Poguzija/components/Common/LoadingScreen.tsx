import { ActivityIndicator } from 'react-native'
import { BackgroundSafeAreaView } from './BackgroundSafeAreaView'
import { COLORS } from '../../constants/Colors'

export const LoadingScreen = () => {
    return (
        <BackgroundSafeAreaView>
            <ActivityIndicator size="large" color={COLORS.tint} />
        </BackgroundSafeAreaView>
    )
}
