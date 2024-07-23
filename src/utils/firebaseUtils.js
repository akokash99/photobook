// src/utils/firebaseUtils.js
import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getCountFromServer } from "firebase/firestore";
export const addDummyPhotobooks = async (userId) => {
  const photobooksCollection = collection(db, "photobooks");

  const dummyData = [
    { title: "Summer Vacation 2023", createdAt: new Date(), userId: userId },
    { title: "Family Reunion", createdAt: new Date(), userId: userId },
    { title: "My Wedding", createdAt: new Date(), userId: userId },
  ];

  for (const book of dummyData) {
    await addDoc(photobooksCollection, book);
  }
};

export const getUserPhotobooks = async (userId) => {
  const photobooksCollection = collection(db, "photobooks");
  const q = query(photobooksCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getPhotobookCount = async (userId) => {
  const photobooksCollection = collection(db, "photobooks");
  const q = query(photobooksCollection, where("userId", "==", userId));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};
