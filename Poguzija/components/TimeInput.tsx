import { MaterialIcons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { TextInput, View, Text, StyleSheet } from "react-native"
import { SIZES, COLORS } from "../constants/Colors"


export const TimeInput = ({ time, onTimeChange, refresh }) => {
    const [hours, setHours] = useState('')
    const [minutes, setMinutes] = useState('')

    useEffect(() => {
        setHours(time.hours || '')
        setMinutes(time.minutes || '')
    }, [refresh])

    const handleHoursChange = (text) => {
        setHours(text.replace(/[^0-9]/g, ''))
        onTimeChange({hours: text, minutes: minutes, all: `${text}${minutes}`})
    }

    const handleMinutesChange = (text) => {
        setMinutes(text.replace(/[^0-9]/g, ''))
        onTimeChange({hours: hours, minutes: text, all: `${hours}${text}`})
    }

    return (
        <View style={styles.inputContainer}>
            <MaterialIcons name="timelapse" style={styles.icon} />
            <TextInput
                style={styles.smallTextInput}
                value={hours}
                onChangeText={handleHoursChange}
                maxLength={2}
                keyboardType='numeric'
                placeholder="00"
            />
            <Text style={styles.textInputTime}>h</Text>
            <TextInput
                style={styles.smallTextInput}
                value={minutes}
                onChangeText={handleMinutesChange}
                maxLength={2}
                keyboardType='numeric'
                placeholder="00"
            />
            <Text style={styles.textInputTime}>min</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        minHeight: 60,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        padding: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    textInputTime: {
        color: COLORS.tint,
        fontSize: SIZES.large,
        padding: SIZES.base
    },
    smallTextInput: {
        textAlign: 'center',
        color: COLORS.dark,
        fontSize: SIZES.large,
    },
    icon: {
        marginRight: 10,
        color: COLORS.lightDark,
        fontSize: SIZES.extraLarge
    },
})