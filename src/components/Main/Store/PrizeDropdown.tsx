import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import Colors from 'src/constants/Colors';
import { useUser } from "src/hooks/useUser";

const PrizeDropdown = ({ prize, toggleExpand, isOpen }) => {
  const user = useUser();
  const [imageUrl, setImageUrl] = useState(null);
  const [redeemed, setRedeemed] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      checkRedeemed();
      if (prize.image_url) {
        fetchImageUrl();
      }
    }
  }, [isOpen]);

  const fetchImageUrl = async () => {
    const storage = getStorage();
    const imageRef = ref(storage, prize.image_url);
    try {
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
    } catch (error) {
      console.error("Failed to load image", error);
      setImageUrl(null);
    }
  };

  const checkRedeemed = async () => {
    setLoading(true);
    const db = getFirestore();
    const userRef = doc(db, "user_prizes", user.user.uid);
    const prizeRef = doc(userRef, "prizes", prize.id);

    const prizeDoc = await getDoc(prizeRef);

    if (prizeDoc.exists()) {
      const redeemedPrize = prizeDoc.data();
      const codeRef = redeemedPrize.prize_code;

      const codeDoc = await getDoc(doc(db, codeRef));
      if (codeDoc.exists()) {
        setRedeemed(true);
        setRedeemedCode(codeDoc.data().code);
      } else {
      }
    } else {
    }
    setLoading(false);
  };

  const handleRedeem = (prize) => {
    if (user.totalPoints < prize.required_points) {
      Alert.alert("Insufficient Points", "You do not have enough points to redeem this prize.");
    } else {
      Alert.alert(
        "Confirm Redemption",
        `Are you sure you want to spend ${prize.required_points} points to redeem this prize?\nYour current balance: ${user.totalPoints.toFixed(0)}`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => redeemPrize(prize) }
        ]
      );
    }
  };

  const redeemPrize = async (prize) => {
    const newPoints = user.totalPoints - prize.required_points;
    const db = getFirestore();
    try {
      setRedeemed(true);

      await user.updatePoints(newPoints);

      const prizeDocRef = doc(db, "store_prizes", prize.id);
      const prizeDoc = await getDoc(prizeDocRef);
      if (!prizeDoc.exists()) {
        console.error("No such prize!");
        return;
      }

      const prizeData = prizeDoc.data();
      const prizeInstructions = prizeData.prize_instructions;

      const codesCollectionRef = collection(prizeDocRef, "codes");
      const codesSnapshot = await getDocs(codesCollectionRef);
      if (codesSnapshot.empty) {
        console.error("No codes available for this prize!");
        return;
      }

      const codeDoc = codesSnapshot.docs[0];
      const codeData = codeDoc.data();
      const prizeCode = codeData.code;

      const userPrizesRef = doc(db, "user_prizes", user.user.uid);
      const prizeRef = doc(userPrizesRef, "prizes", prize.id);

      await setDoc(prizeRef, {
        prize_code: `/store_prizes/${prize.id}/codes/${codeDoc.id}`,
        redeemed_on: new Date(),
      });

      const newQuantity = codeData.available_quantity - 1;
      await updateDoc(codeDoc.ref, { available_quantity: newQuantity });

      setRedeemedCode(prizeCode);

      Alert.alert("Success", `Prize redeemed successfully!\n\nPrize Code: ${prizeCode}\n\nInstructions: ${prizeInstructions}`);
    } catch (error) {
      setRedeemed(false); // Revert redeemed state if there was an error
      Alert.alert("Error", "Failed to redeem prize. Please try again.");
      console.error("Error redeeming prize: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => toggleExpand(prize.id)} 
        style={[
          styles.prizeHeader, 
          isOpen ? styles.prizeHeaderOpen : styles.prizeHeaderClosed
        ]}
      >
        <Text>{prize.prize_name}</Text>
        <Text>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.prizeDetails}>
          <Text>{prize.prize_instructions}</Text>
          {imageUrl && (
            <Image
              style={styles.prizeImage}
              source={{ uri: imageUrl }}
              resizeMode="contain"
            />
          )}

          {loading ? (
            <ActivityIndicator size="small" color={Colors.BackgroundGradientLower} />
          ) : (
            <Pressable
              onPress={() => {
                if (redeemed) {
                  Alert.alert("Prize Code", `You have already redeemed this prize.\n\nPrize Code: ${redeemedCode}`);
                } else {
                  handleRedeem(prize);
                }
              }}
              style={[
                styles.redeemButton,
                redeemed ? styles.redeemButtonRedeemed : (user.totalPoints < prize.required_points ? styles.redeemButtonDisabled : {})
              ]}
              disabled={loading || (user.totalPoints < prize.required_points && !redeemed)}
            >
              <Text style={styles.redeemButtonNameText}>
                {redeemed ? "Already redeemed" : "Redeem"}
              </Text>
              <Text style={styles.redeemButtonPointsText}>{prize.required_points} points</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  prizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  prizeHeaderOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  prizeHeaderClosed: {
    borderRadius: 5,
  },
  prizeDetails: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  prizeImage: {
    width: '100%',
    height: 200,
    marginTop: 10
  },
  redeemButton: {
    marginTop: 20,
    width: '60%',
    backgroundColor: Colors.BackgroundGradientLower,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  redeemButtonNameText: {
    color: 'white',
    fontSize: 14,
  },
  redeemButtonPointsText: {
    color: 'white',
    fontSize: 10,
  },
  redeemButtonDisabled: {
    backgroundColor: 'grey',
  },
  redeemButtonRedeemed: {
    backgroundColor: Colors.StoreRedeemedPrizeButton,
  },
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: Colors.BackgroundGradientUpper,
    padding: 10,
  },
});

export default PrizeDropdown;
