import { View, TextInput, Pressable, Text, StyleSheet, TextInputProps , Platform, ScrollView, KeyboardAvoidingView, Alert, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/Colors';

interface InputWithIconProps extends TextInputProps {
    icon: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
}


const TextInputIcon: React.FC<InputWithIconProps> = ({icon, placeholder, value, onChangeText, ...textInputProps }) => {
    return (
        <View style={styles.inputContainer}>
            <MaterialIcons name=icon size={24} color="black" style={styles.icon} />
            <TextInput
                style={styles.textInput}
                placeholder="Serving size"
                value={servingSize}
                onChangeText={text => setServingSize(text)}
                keyboardType='numeric'
            />
        </View>
    );
}
export default TextInputIcon;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%',
        justifyContent: 'center'
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    images: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 280,
        marginBottom: 2*SIZES.extraLarge
    },
    image: {
        height: 280,
        borderRadius: SIZES.extraLarge,
        marginTop: SIZES.extraLarge
    },
    input: {
        width: '95%',
        height: 60,
        backgroundColor: COLORS.light,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        height: 60,
        backgroundColor: COLORS.light,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large
    },
    textInput: {
        width: '100%',
        color: COLORS.tint,
        fontSize: SIZES.large
    },
    icon: {
        marginRight: 10,
    },
});
