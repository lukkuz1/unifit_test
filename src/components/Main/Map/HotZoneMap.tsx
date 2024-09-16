import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import ShoeSVG from 'src/assets/svg/map-shoe.svg';
import Colors from 'src/constants/Colors';

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Function to calculate distance between two coordinates (user and hot zone) using the Haversine formula
function calculateDistance(coord1, coord2) {
  const R = 6371e3; // Earth's radius in meters
  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.location.latitude);
  const deltaLat = toRadians(coord2.location.latitude - coord1.latitude);
  const deltaLon = toRadians(coord2.location.longitude - coord1.longitude);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const defaultRegion = {
  latitude: 54.899543,
  longitude: 23.967050,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const defaultZoom = {
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

const mapStyle = [
  {
    "featureType": "all",
    "elementType": "all",
    "stylers": [
      { "visibility": "on" }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      { "visibility": "off" }
    ]
  }
];

const HotZoneMap = ({ shouldCenterOnHotZone, location, hotZones = [], selectedHotZone, onHotZoneCentered, onHotZonePress, onMapInteraction, hasLocationPermission, locationPermissionDenied, shouldCenterOnUser, onUserCentered }) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: location?.coords?.latitude || defaultRegion.latitude,
    longitude: location?.coords?.longitude || defaultRegion.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mapReady, setMapReady] = useState(false);
  const [shouldFollowUser, setShouldFollowUser] = useState(false);
  const [hotZoneMessage, setHotZoneMessage] = useState('');
  const [initialCenterDone, setInitialCenterDone] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [prevCenterHotZones, setPrevCenterHotZones] = useState(new Set());

  // Centers on the user's location once when it is first received
  useEffect(() => {
    // Checks if initial centering hasn't been done and location is available
    if (!initialCenterDone && location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        ...defaultZoom,
      }, 1000);

      setInitialCenterDone(true);
    }
  }, [location]);

  // Listen for location changes. If shouldFollowUser is true, recenter the map.
  useEffect(() => {
    if (shouldFollowUser && location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      }, 1000);
    }
  }, [location, shouldFollowUser]);

  // Centers the map on the selected hot zone
  useEffect(() => {
    if (selectedHotZone && mapRef.current && shouldCenterOnHotZone) {
      setShouldFollowUser(false);
      const radiusInKilometers = selectedHotZone.radius / 1000;

      // Delta values in degrees
      const deltaDegrees = radiusInKilometers * 0.008983; // Change in degrees per kilometer
      const latitudeDelta = deltaDegrees * 2; // Double the radius to get full circle width

      // Longitude delta, adjusted by the cosine of the latitude
      const longitudeDelta = deltaDegrees * 2 / Math.cos(selectedHotZone.location.latitude * Math.PI / 180);

      mapRef.current.animateToRegion({
        latitude: selectedHotZone.location.latitude,
        longitude: selectedHotZone.location.longitude,
        latitudeDelta,
        longitudeDelta,
      }, 1000);

      onHotZoneCentered();
    }
  }, [selectedHotZone, shouldCenterOnHotZone, onHotZoneCentered]);
  // Check if the user is in a hot zone
  useEffect(() => {
    if (shouldCenterOnUser && location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        ...defaultZoom,
      }, 1000);
      onUserCentered();
    }
  }, [shouldCenterOnUser, location, onUserCentered]);

  useEffect(() => {
    if (!location || !location.coords) {
      setHotZoneMessage(locationPermissionDenied ? 'Please enable your location to fully use the map features.' : 'Waiting for location...');
      return;
    }

    const currentCenterHotZones = new Set();
    let userIsInHotZone = false;
    for (const hotZone of hotZones) {
      const distance = calculateDistance(location.coords, hotZone);
      if (distance <= hotZone.radius) {
        userIsInHotZone = true;
        setHotZoneMessage(`You are in the '${hotZone.name}' hot zone!`);

        if (distance <= hotZone.center_radius) {
          currentCenterHotZones.add(hotZone.name);
          if (!prevCenterHotZones.has(hotZone.name)) {
            setModalContent({
              title: `You reached the ${hotZone.name} hot zone!`,
              message: `${hotZone.center_message}\n\n${hotZone.description}`
            });
            setModalVisible(true);
          }
        }
        break;
      }
    }

    setPrevCenterHotZones(currentCenterHotZones);

    if (!userIsInHotZone) {
      setHotZoneMessage('');
    }
  }, [location, mapReady, hotZones, locationPermissionDenied]);

  const handleUserInteraction = () => {
    setShouldFollowUser(false);
    onMapInteraction();
  };

  const handleMarkerPress = (name) => {
    const hotZone = hotZones.find(zone => zone.name === name);
    if (hotZone) {
      if (location && location.coords) {
        const distance = calculateDistance(location.coords, hotZone);
        if (distance <= hotZone.center_radius) {
          setModalContent({
            title: `You reached the ${hotZone.name} hot zone!`,
            message: `${hotZone.center_message}\n\n${hotZone.description}`
          });
        } else {
          setModalContent({
            title: hotZone.name,
            message: hotZone.description,
          });
        }
      } else {
        setModalContent({
          title: hotZone.name,
          message: hotZone.description,
        });
      }
      setModalVisible(true);
    }
  };

  return (
    <View style={[styles.container]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={styles.map}
        onRegionChange={setRegion}
        onRegionChangeComplete={newRegion => setRegion(newRegion)}
        onPress={handleUserInteraction}
        onPanDrag={handleUserInteraction}
        onLayout={() => setMapReady(true)}
        toolbarEnabled={false}
      >
        {location && (
          <Marker coordinate={location.coords} title="You are here" anchor={{ x: 0.5, y: 0.5 }}>
            <ShoeSVG width={45} height={45} />
          </Marker>
        )}

        {hotZones.map((hotZone, index) => (
          <React.Fragment key={index}>
            <Circle
              center={{
                latitude: hotZone.location.latitude,
                longitude: hotZone.location.longitude,
              }}
              radius={hotZone.radius}
              fillColor="rgba(255,0,0,0.3)"
              strokeColor="rgba(13,7,7,0.64)"
            />
            <Marker
              coordinate={{
                latitude: hotZone.location.latitude,
                longitude: hotZone.location.longitude,
              }}
              title={hotZone.name}
              onPress={() => handleMarkerPress(hotZone.name)}
            />
            <Circle
              center={{
                latitude: hotZone.location.latitude,
                longitude: hotZone.location.longitude,
              }}
              radius={hotZone.center_radius}
              fillColor="rgba(255,0,0,0.25)"
              strokeColor="rgba(13,7,7,0.64)"
            />
          </React.Fragment>
        ))}
      </MapView>
      {hotZoneMessage && (
        <View style={styles.hotZoneMessageContainer}>
          <Text style={styles.hotZoneMessageText}>{hotZoneMessage}</Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{modalContent.title}</Text>
            <Text>{modalContent.message}</Text>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  hotZoneMessageContainer: {
    position: 'absolute',
    borderRadius: 15,
    top: 100,
    left: 10,
    right: 10,
    alignItems: 'center',
    backgroundColor: Colors.BackgroundGradientLower,
    padding: 10,
  },
  hotZoneMessageText: {
    color: 'white',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  boldText: {
    fontWeight: 'bold',
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

export default HotZoneMap;
