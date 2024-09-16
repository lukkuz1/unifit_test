import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Colors from 'src/constants/Colors';

const StoreItem = ({ store, onPress }) => {
    return (
        <View style={styles.rewardRectangle}>
            <Pressable style={styles.container} onPress={() => onPress(store)}>
                <Image source={{ uri: store.logo_url }} style={styles.logo} />
                <Text style={styles.name}>{store.store_name}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: 200,
        height: 200,
        margin: 10,
        borderRadius: 20,
        backgroundColor: Colors.StoreItemBackground,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        color: Colors.StoreNameText,
        marginTop: 10,
        fontSize: 21,
        fontWeight: "bold",
        textAlign: 'center',
    },
    rewardRectangle: {
        width: 200,
        height: 200,
        margin: 10,
        borderRadius: 10,
        borderColor: Colors.TransparentRectangleBorder,
        borderWidth: 1.3,
        backgroundColor: Colors.TransparentRectangle,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default StoreItem;
