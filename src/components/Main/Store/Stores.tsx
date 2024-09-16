import React, { useEffect, useState } from "react";
import { ScrollView } from 'react-native';
import StoreItem from 'src/components/Main/Store/StoreItem';
import StoreModal from 'src/components/Main/Store/StoreModal';
import firebaseServices from 'src/services/firebase';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


const { auth, db } = firebaseServices;

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      const storesCol = collection(db, 'stores');
      const storesSnapshot = await getDocs(storesCol);
      const storesData = storesSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, prizes: data.prizes || [] };
      });
      const storesWithImages = await fetchImageUrls(storesData);
      setStores(storesWithImages);
    };

    fetchStores();
  }, []);

  const fetchImageUrls = async (stores) => {
    const storage = getStorage();
    const updatedStores = await Promise.all(stores.map(async (store) => {
      const storageRef = ref(storage, store.logo_url);
      const downloadUrl = await getDownloadURL(storageRef);
      return { ...store, logo_url: downloadUrl };
    }));
    return updatedStores;
  };

  const handleSelectStore = async (store) => {
    try {
      const storeRef = doc(db, 'stores', store.id);
      const storePrizesCol = collection(db, 'store_prizes');
      const q = query(storePrizesCol, where("store", "==", storeRef));
      const storePrizesSnapshot = await getDocs(q);
      const storePrizesData = storePrizesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Attaches the fetched prizes to the selected store object
      setSelectedStore({ ...store, prizes: storePrizesData });
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching prizes for store:", error);
    }
  };

  return (
    <>
      {stores.map(store => (
        <StoreItem key={store.id} store={store} onPress={handleSelectStore} />
      ))}
      {selectedStore && (
        <StoreModal
          store={selectedStore}
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
}
