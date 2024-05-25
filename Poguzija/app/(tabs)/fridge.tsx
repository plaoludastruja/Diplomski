import { Button, View, Text, StyleSheet, Image } from 'react-native';
import { useEffect, useState } from 'react';
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import { GoogleSignin, GoogleSigninButton, User } from '@react-native-google-signin/google-signin';
import { signIn, signOut } from '../../service/AuthService';
import { getCurrentUser } from '../../service/UserService';
import { MyUser } from '../../model/model';
import { AddIngredientsData } from '../../service/HelperService';

export default function FridgeScreen() {
    const [user, setUser] = useState<MyUser>();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "679997496367-v24ck2ikahtou5jd89fa870fp9s83plt.apps.googleusercontent.com"
        })
        getCurrentUserFn();
    }, [])

    const getCurrentUserFn = async () => {
        const user = await getCurrentUser();
        setUser(user);
    }

    const signInFn = async () => {
        const user = await signIn();
        setUser(user);
    }

    const signOutFn = () => {
        setUser(undefined);
        signOut();
    }

    const addData = () => {
        AddIngredientsData()
    }

    return (
        <BackgroundSafeAreaView>

            <View>
            <Button title='Add ingredients data' onPress={addData} />
                {user && <Text style={styles.buttonText}>{JSON.stringify(user)}</Text>}
                {user && <Image source={{ uri: user.profilePhoto }} style={styles.image} />}
                {user ?
                    (<Button title='Logout' onPress={signOutFn} />) :
                    (<GoogleSigninButton size={GoogleSigninButton.Size.Standard} color={GoogleSigninButton.Color.Light} onPress={signInFn} />)
                }
            </View>
        </BackgroundSafeAreaView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 30,
        height: 30,
        borderRadius: 18,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});