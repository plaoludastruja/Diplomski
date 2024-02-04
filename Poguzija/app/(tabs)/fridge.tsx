import { Button, View, Text, StyleSheet, Image } from 'react-native';
import { useEffect, useState } from 'react';
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import { GoogleSignin, GoogleSigninButton, User } from '@react-native-google-signin/google-signin';
import { getCurrentUser, signIn, signOut } from '../../service/AuthService';

export default function FridgeScreen() {
    const [user, setUser] = useState<User>();

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

    return (
        <BackgroundSafeAreaView>
            <View>
                {user && <Text style={styles.buttonText}>{JSON.stringify(user.user)}</Text>}
                {user && <Image source={{ uri: user.user.photo }} style={styles.image} />}
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