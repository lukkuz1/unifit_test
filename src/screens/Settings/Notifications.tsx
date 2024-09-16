import React, { useState } from 'react';
import { Text, StyleSheet, Switch, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from 'src/constants/Colors';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';

export default function Notifications() {
    const darkMode = useDarkModeToggle();
    const [pushNotifications, setPushNotifications] = useState(true);
    const [soundNotifications, setSoundNotifications] = useState(true);
    const [vibrationNotifications, setVibrationNotifications] = useState(true);
    const [priorityNotifications, setPriorityNotifications] = useState('high');

    const togglePushNotifications = () => {
        setPushNotifications(!pushNotifications);
    };

    const toggleSoundNotifications = () => {
        setSoundNotifications(!soundNotifications);
    };

    const toggleVibrationNotifications = () => {
        setVibrationNotifications(!vibrationNotifications);
    };

    const changePriorityNotifications = (value) => {
        setPriorityNotifications(value);
    };

    return (
        <LinearGradient colors={darkMode ? [Colors.DarkBackgroundGradientLower, Colors.DarkBackgroundGradientUpper] : [Colors.BackgroundGradientUpper, Colors.BackgroundGradientLower]} style={styles.container}>
            <Text style={styles.label}>Notifications</Text>
            
            {/* Push Notifications */}
            <View style={styles.notificationOption}>
                <Text style={styles.optionText}>Push Notifications</Text>
                <Switch
                    trackColor={{ false: Colors.Gray, true: Colors.Blue }}
                    thumbColor={pushNotifications ? Colors.White : Colors.Gray}
                    ios_backgroundColor={Colors.Gray}
                    onValueChange={togglePushNotifications}
                    value={pushNotifications}
                />
            </View>

            {/* Sound Notifications */}
            <View style={styles.notificationOption}>
                <Text style={styles.optionText}>Sound Notifications</Text>
                <Switch
                    trackColor={{ false: Colors.Gray, true: Colors.Blue }}
                    thumbColor={soundNotifications ? Colors.White : Colors.Gray}
                    ios_backgroundColor={Colors.Gray}
                    onValueChange={toggleSoundNotifications}
                    value={soundNotifications}
                />
            </View>

            {/* Vibration Notifications */}
            <View style={styles.notificationOption}>
                <Text style={styles.optionText}>Vibration Notifications</Text>
                <Switch
                    trackColor={{ false: Colors.Gray, true: Colors.Blue }}
                    thumbColor={vibrationNotifications ? Colors.White : Colors.Gray}
                    ios_backgroundColor={Colors.Gray}
                    onValueChange={toggleVibrationNotifications}
                    value={vibrationNotifications}
                />
            </View>

            {/* Priority Notifications */}
            <View style={styles.notificationOption}>
                <Text style={styles.optionText}>Priority Notifications</Text>
                <Switch
                    trackColor={{ false: Colors.Gray, true: Colors.Blue }}
                    thumbColor={priorityNotifications === 'high' ? Colors.White : Colors.Gray}
                    ios_backgroundColor={Colors.Gray}
                    onValueChange={(value) => changePriorityNotifications(value ? 'high' : 'low')}
                    value={priorityNotifications === 'high'}
                />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 20,
        color: Colors.EntryLighterWhite,
        fontSize: 24,
        fontWeight: "700",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginVertical: 10,
    },
    optionText: {
        color: Colors.EntryLighterWhite,
        fontSize: 18,
    },
});
