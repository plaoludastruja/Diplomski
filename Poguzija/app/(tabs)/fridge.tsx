import { Button, View, Text, StyleSheet, Image } from 'react-native';
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
const isdev = false;

export default function FridgeScreen() {
    const [error, setError] = useState();
    const [userInfo, setUserInfo] = useState();

    /*useEffect(() => {
        if(isdev){
            GoogleSignin.configure({
                webClientId: "679997496367-v24ck2ikahtou5jd89fa870fp9s83plt.apps.googleusercontent.com"
            })
        }
    }, [])

    const signin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const user = await GoogleSignin.signIn();
            setUserInfo(user);
            setError();
        }catch (e) {
            setError(e);
        }
    }

    const logout = () => {
        GoogleSignin.revokeAccess();
        GoogleSignin.signOut();
        setUserInfo();
    }*/

    return (
        <BackgroundSafeAreaView>
            {isdev && <View>
                <Text>{JSON.stringify(error)}</Text>
                {userInfo && <Text style={styles.buttonText}>{JSON.stringify(userInfo.user)}</Text>}
                {userInfo && <Image source={{ uri: userInfo.user.photo }} style={styles.image} />}
                {/* userInfo ? 
                    (<Button title='Logout' onPress={logout} />) : 
                    (<GoogleSigninButton size={GoogleSigninButton.Size.Standard} color={GoogleSigninButton.Color.Light} onPress={signin}/>)
            */}
            </View>}
        </BackgroundSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: 300,
        height: 250,
        borderRadius: 18,
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        paddingLeft: 10,
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        width: '100%'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    iconButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 250,
    },
    iconButtonLabel: {
        color: '#fff',
        marginTop: 12,
    },
    flex: {
        flex: 1,
        width: '100%',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});