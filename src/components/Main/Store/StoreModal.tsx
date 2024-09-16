import React, { useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Colors from 'src/constants/Colors';
import PrizeDropdown from './PrizeDropdown';

const StoreModal = ({ store, isVisible, onClose }) => {
  const [expandedPrize, setExpandedPrize] = useState(null);

  const toggleExpand = (prizeId) => {
    setExpandedPrize(expandedPrize === prizeId ? null : prizeId);
  };

  const prizesList = store?.prizes || [];

  return (
    <>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType={"fade"}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', alignItems: "center", justifyContent: "center" }}>
        </View>
      </Modal>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.header}>{store.store_name}</Text>
              <Text style={{ marginBottom: 20 }}>{store.store_description}</Text>
              {prizesList.map(prize => (
                <PrizeDropdown
                  key={prize.id}
                  prize={prize}
                  toggleExpand={toggleExpand}
                  isOpen={expandedPrize === prize.id}
                />
              ))}
            </ScrollView>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    elevation: 6,
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
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

export default StoreModal;
