import { Button, View, Text, StyleSheet, Image, useWindowDimensions, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import { GoogleSignin, GoogleSigninButton, User } from '@react-native-google-signin/google-signin';
import { signIn, signOut } from '../../service/AuthService';
import { getCurrentUser } from '../../service/UserService';
import { FoodRecipes, Ingredient, MyUser } from '../../model/model';
import { AddIngredientsData, AddMeasurementUnitsData } from '../../service/HelperService';
import LoadingScreen from '../../components/LoadingScreen';
import { COLORS, SIZES } from '../../constants/Colors';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import CardFoodRecipes from '../../components/CardFoodRecipes';
import { GetAllFoodRecipes } from '../../service/service';
import AddIngredientsModal from '../../components/AddIngredientsModal';
import SelectDropdown from 'react-native-select-dropdown'


export default function FridgeScreen() {
    const addData = () => {
        AddMeasurementUnitsData()
    }
    const [user, setUser] = useState<MyUser>();

    const [food, setFood] = useState<FoodRecipes[]>([]);

    useEffect(() => {
        console.log('data')
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const foodRecipesData = await GetAllFoodRecipes();
            setFood(foodRecipesData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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

    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'myRecipes', title: 'My Recipes' },
        { key: 'myFridge', title: 'My Fridge' },
    ]);
    const FirstRoute = () => (
        <FlatList
            data={food}
            renderItem={({ item }) => <CardFoodRecipes data={item} route={''} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={styles.flex}
        />
    );
    const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);

    const handleAddIngredient = (ingredient: Ingredient) => {
        setSelectedIngredients([...selectedIngredients, ingredient]);
    };
    const SecondRoute = () => (
        <View>
            <Pressable style={styles.button} onPress={() => setIngredientsModalVisible(true)}>
                <Text style={styles.buttonText}>Add ingredients</Text>
            </Pressable>
            <AddIngredientsModal
                visible={ingredientsModalVisible}
                onAdd={handleAddIngredient}
                onClose={() => setIngredientsModalVisible(false)} />
        </View>


    );

    const renderScene = SceneMap({
        myRecipes: FirstRoute,
        myFridge: SecondRoute,
    });
    const renderLabel = props => (
        <Text
            style={{ backgroundColor: COLORS.light, color: COLORS.tint, }}


        />
    );
    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: COLORS.tint }}
            style={{ backgroundColor: COLORS.light, color: COLORS.tint, }}
            labelStyle={{ color: COLORS.tint, }}


        />
    );
    if (!user) return (
        <View />
    )
    const emojisWithIcons = [
        { title: 'happy', icon: 'emoticon-happy-outline' },
        { title: 'cool', icon: 'emoticon-cool-outline' },
        { title: 'lol', icon: 'emoticon-lol-outline' },
        { title: 'sad', icon: 'emoticon-sad-outline' },
        { title: 'cry', icon: 'emoticon-cry-outline' },
        { title: 'angry', icon: 'emoticon-angry-outline' },
        { title: 'confused', icon: 'emoticon-confused-outline' },
        { title: 'excited', icon: 'emoticon-excited-outline' },
        { title: 'kiss', icon: 'emoticon-kiss-outline' },
        { title: 'devil', icon: 'emoticon-devil-outline' },
        { title: 'dead', icon: 'emoticon-dead-outline' },
        { title: 'wink', icon: 'emoticon-wink-outline' },
        { title: 'sick', icon: 'emoticon-sick-outline' },
        { title: 'frown', icon: 'emoticon-frown-outline' },
    ];
    return (
        <BackgroundSafeAreaView>
            <View style={styles.container}>
                <SelectDropdown
                    data={emojisWithIcons}
                    onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index);
                    }}
                    renderButton={(selectedItem, isOpened) => {
                        return (
                            <View style={styles.header}>
                                {user && <Image source={{ uri: user.profilePhoto }} style={styles.image} />}
                            </View>
                        );
                    }}
                    renderItem={(item, index, isSelected) => {
                        return (
                            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                            </View>
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                />
                
                <Text style={styles.subtitleText}>My kitchen</Text>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    renderTabBar={renderTabBar}
                />

                <View>
                    {user ?
                        (<Button title='Logout' onPress={addData} />) :
                        (<GoogleSigninButton size={GoogleSigninButton.Size.Standard} color={GoogleSigninButton.Color.Light} onPress={signInFn} />)
                    }
                </View>
            </View>
        </BackgroundSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '95%',
    },
    header: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 5 * SIZES.extraLarge,
        height: 2 * SIZES.extraLarge,
    },
    image: {
        width: 1.2 * SIZES.tabIcon,
        height: 1.2 * SIZES.tabIcon,
        borderRadius: SIZES.large,
        margin: SIZES.base
    },
    subtitleText: {
        width: '85%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        marginBottom: 0.5 * SIZES.base,
        alignSelf: 'flex-start'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    flex: {
        flex: 1,
        width: '100%',
    },
    button: {
        textAlign: 'center',
        justifyContent: 'center',
        width: '85%',
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        marginVertical: SIZES.base,
        elevation: 2,
    },

    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});