import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Linking, Modal, Text, Pressable, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from 'src/constants/Colors';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import HotZoneMap from 'src/components/Main/Map/HotZoneMap';
import HotZoneDropdown from 'src/components/Main/Map/HotZoneDropdown';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { collection, getDocs } from 'firebase/firestore';
import firebaseServices from 'src/services/firebase';
import useDarkModeToggle from 'src/hooks/useDarkModeToggle';
import { useNavigation } from '@react-navigation/native';
import MapBackground from "src/assets/png/map-background.png";
import FootstepsIcon from "src/assets/svg/footsteps.svg";
import CenterSVG from 'src/assets/svg/map-center.svg';
import { useUser } from "src/hooks/useUser";

const { auth, db } = firebaseServices;

const useFetchHotZones = () => {
  const [hotZones, setHotZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotZones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hot_zones"));
        const zones = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHotZones(zones);
      } catch (err) {
        console.error("Error fetching hot zones:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotZones();
  }, []);

  return { hotZones, loading, error };
};

const MapPage = () => {
  const [location, setLocation] = useState(null);
  const [selectedHotZoneName, setSelectedHotZoneName] = useState("");
  const [shouldCenterOnHotZone, setShouldCenterOnHotZone] = useState(false);
  const [shouldCenterOnUser, setShouldCenterOnUser] = useState(false);
  const { hotZones, loading, error } = useFetchHotZones();
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const selectedHotZone = hotZones.find(zone => zone.name === selectedHotZoneName);

  const darkMode = useDarkModeToggle();
  const navigation = useNavigation();
  const user = useUser();

  const [modalVisible, setModalVisible] = useState(false);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setHasLocationPermission(false);
      setLocationPermissionDenied(true);
      Alert.alert(
        "Location Permission",
        "Location permission is required to use the map features. Would you like to go to settings to enable it?",
        [
          {
            text: "No",
            onPress: () => setLocationPermissionDenied(true),
          },
          {
            text: "Yes",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return false;
    }
    setHasLocationPermission(true);
    setLocationPermissionDenied(false);
    return true;
  };

  useEffect(() => {
    (async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );

      return () => subscription?.remove();
    })();
  }, []);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        // Re-request location updates when coming back to this page
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5,
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );
        return () => subscription?.remove();
      }
    });

    return unsubscribeFocus;
  }, [navigation]);

  const handleHotZoneSelectionChange = (selectedHotZone) => {
    setSelectedHotZoneName(selectedHotZone.name);
    setShouldCenterOnHotZone(true);
  };

  // Method to be called by HotZoneMap after centering a hot zone
  const onHotZoneCentered = () => {
    setShouldCenterOnHotZone(false);
  };

  // Reset selection to show the placeholder in the dropdown
  const resetHotZoneSelection = () => {
    setSelectedHotZoneName("");
  };

  const centerOnUser = () => {
    setShouldCenterOnUser(true);
  };


  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={MapBackground} style={styles.backgroundImage}>
        <View style={styles.headerContainer}>
          <View style={styles.dropdownWrapperHeader}>
            <HotZoneDropdown
              hotZones={hotZones}
              selectedHotZoneName={selectedHotZoneName}
              onHotZoneSelectionChange={handleHotZoneSelectionChange}
            />
          </View>
          <TouchableOpacity style={styles.infoButton} onPress={showModal}>
            <Text style={styles.buttonText}>?</Text>
          </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.safeAreaView}>
          <View style={[styles.mapContainer, { paddingBottom: 15 }]}>
            <HotZoneMap
              location={location}
              hotZones={hotZones}
              selectedHotZone={selectedHotZone}
              onHotZonePress={(name) => setSelectedHotZoneName(name)}
              shouldCenterOnHotZone={shouldCenterOnHotZone}
              onHotZoneCentered={onHotZoneCentered}
              onMapInteraction={resetHotZoneSelection}
              hasLocationPermission={hasLocationPermission}
              locationPermissionDenied={locationPermissionDenied}
              shouldCenterOnUser={shouldCenterOnUser}
              onUserCentered={() => setShouldCenterOnUser(false)}
            />
          </View>
        </SafeAreaView>
        <TouchableOpacity onPress={centerOnUser} style={styles.centerButton}>
          <CenterSVG width={35} height={35} />
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType={"fade"}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', alignItems: "center", justifyContent: "center" }}>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={hideModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Hot Zones</Text>
              <Text style={styles.modalText}>
                Hot zones are special areas where you earn extra points for walking. They are located around specific places or stores.
                {"\n\n"}
                Reach the center of a hot zone, marked by a marker, for a chance to win special prizes!
              </Text>
              <Pressable onPress={hideModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeAreaView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '15%',
    backgroundColor: Colors.HeaderGreen,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 5,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  dropdownWrapperHeader: {
    flex: 1,
    marginRight: 10,
  },
  infoButton: {
    backgroundColor: Colors.HeaderDarkerGreen,
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    position: 'absolute',
    right: 20,
    bottom: 130,
    padding: 8,
    backgroundColor: Colors.HeaderDarkerGreen,
    borderRadius: 15,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { height: 0, width: 0 },
    zIndex: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4682B4',
  },
  modalText: {
    color: '#4682B4',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Colors.BackgroundGradientLower,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default MapPage;
