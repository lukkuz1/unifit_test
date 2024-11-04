import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from 'src/constants/Colors';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';

export default function AboutUs() {
    const darkMode = useDarkModeToggle();
    return (
        //<LinearGradient colors={darkMode ? [Colors.DarkBackgroundGradientLower, Colors.DarkBackgroundGradientUpper] : [Colors.BackgroundGradientUpper, Colors.BackgroundGradientLower]} style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.heading}>Welcome to UniFit</Text>
                <View style={styles.separator} />
                <Text style={styles.subtitle}>Track. Achieve. Reward.</Text>
                <Text style={styles.paragraph}>
                    UniFit is more than just a fitness app; it's your companion on the journey to a healthier, happier you.
                </Text>
                <Text style={styles.paragraph}>
                    Designed with modern aesthetics and cutting-edge technology, UniFit empowers you to take control of your fitness goals and turn them into reality.
                </Text>
                <Text style={styles.paragraph}>
                    Whether you're a fitness enthusiast or just starting your wellness journey, UniFit offers intuitive features to track your progress, set personalized goals, and unlock rewards for your achievements.
                </Text>
                <Text style={styles.paragraph}>
                    Join our vibrant community of users and embark on a transformative experience towards better health and well-being. Let's make every step count!
                </Text>
            </ScrollView>
        //</LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
    },
    heading: {
        marginBottom: 10,
        color: Colors.EntryLighterWhite,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: 20,
        color: Colors.EntryLighterWhite,
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    paragraph: {
        marginBottom: 20,
        color: Colors.EntryLighterWhite,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    separator: {
        width: '50%',
        height: 1,
        backgroundColor: Colors.EntryLighterWhite,
        marginBottom: 20,
    },
    icon: {
        marginTop: 40,
    },
});
