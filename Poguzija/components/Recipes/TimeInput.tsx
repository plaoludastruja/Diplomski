import { MaterialIcons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { SIZES, COLORS } from "../../constants/Colors"

interface TimeInputProps {
    time: { hours: string, minutes: string }
    onTimeChange: (time: { hours: string, minutes: string, all: string }) => void
    refresh: boolean
}

export const TimeInput = ({ time, onTimeChange, refresh }: TimeInputProps) => {
    const [hours, setHours] = useState('')
    const [minutes, setMinutes] = useState('')

    useEffect(() => {
        setHours(time.hours || '')
        setMinutes(time.minutes || '')
        // eslint-disable-next-line react-hooks/exhaustive-deps -- resync only on explicit refresh trigger, not on every keystroke via time prop
    }, [refresh])

    const handleHoursChange = (text: string) => {
        const correctTime = text.replace(/[^0-9]/g, '')
        setHours(correctTime)
        onTimeChange({hours: correctTime, minutes: minutes, all: `${correctTime}${minutes}`})
    }

    const handleMinutesChange = (text: string) => {
        const correctTime = text.replace(/[^0-9]/g, '')
        setMinutes(correctTime)
        onTimeChange({hours: hours, minutes: correctTime, all: `${hours}${correctTime}`})
    }

    return (
        <View style={styles.inputContainer}>
            <MaterialIcons name="timelapse" style={styles.icon} />
            <BottomSheetTextInput
                style={styles.smallTextInput}
                value={hours}
                onChangeText={handleHoursChange}
                maxLength={2}
                keyboardType='numeric'
                placeholder="00"
            />
            <Text style={styles.textInputTime}>h</Text>
            <BottomSheetTextInput
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
        padding: SIZES.base,
    },
    smallTextInput: {
        textAlign: 'center',
        color: COLORS.dark,
        fontSize: SIZES.large,
    },
    icon: {
        marginRight: 10,
        color: COLORS.lightDark,
        fontSize: SIZES.extraLarge,
    },
})
