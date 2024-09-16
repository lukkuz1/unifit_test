import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import Colors from 'src/constants/Colors';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';
import Stores from 'src/components/Main/Store/Stores'
import WalletIcon from "src/assets/svg/wallet.svg";
import FootstepsIcon from "src/assets/svg/footsteps.svg";
import { useUser } from "src/hooks/useUser";
import StoreBackground from "src/assets/png/store-background.png";


export default function Store() {
  const darkMode = useDarkModeToggle();
  const user = useUser();

  return (
    <View style={styles.container}>
      <ImageBackground source={StoreBackground} style={styles.backgroundImage}>
        <View style={{ height: '18%', backgroundColor: Colors.HeaderGreen, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: "hidden", elevation: 5, }}>
          <View style={{ height: 60, width: 185, backgroundColor: Colors.HeaderDarkerGreen, borderRadius: 50, marginTop: 50, marginLeft: 20, flexDirection: "row", elevation: 5 }}>
            <View style={{ height: 45, width: 45, backgroundColor: Colors.HeaderGreen, borderRadius: 50, marginTop: 8, marginLeft: 8 }}>
              <WalletIcon height={37} style={{ marginLeft: 4, marginTop: 4 }} />
            </View>
            <Text style={{ color: Colors.White, fontSize: 24, alignSelf: "center", margin: "auto" }}>{user.totalPoints.toFixed(0)}</Text>
          </View>
          <View style={{
            position: "absolute", height: 215, width: 215, backgroundColor: Colors.HeaderGreen,
            marginLeft: 215, marginTop: 30, borderRadius: 200, borderColor: Colors.HeaderDarkerGreen, borderWidth: 10
          }}>
            <FootstepsIcon height={100} style={{ marginLeft: 35, marginTop: 15 }} />
          </View>
        </View>
        <ScrollView style={{ maxHeight: '85%' }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} showsVerticalScrollIndicator={false}>
          <Stores />
          <View style={{ marginBottom: 10 }}></View>
        </ScrollView>

      </ImageBackground>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  text: {
    color: Colors.MainText,
    fontSize: 16,
    fontWeight: "300",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
