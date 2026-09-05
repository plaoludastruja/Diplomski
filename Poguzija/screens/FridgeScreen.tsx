//ok
import { useContext } from 'react'
import { UserContext } from '../app/_layout'
import { BackgroundSafeAreaView } from '../components/Common/BackgroundSafeAreaView'
import { MyKitchen } from '../components/Fridge/MyKitchen'
import { SignInSection } from '../components/Fridge/SignInSection'

export default function FridgeScreen() {
    const { user } = useContext(UserContext)

    return (
        <BackgroundSafeAreaView>
            {user ? <MyKitchen /> : <SignInSection />}
        </BackgroundSafeAreaView>
    )
}
