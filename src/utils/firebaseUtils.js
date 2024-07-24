// src/utils/firebaseUtils.js
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
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

export const getUserTags = async (userId, tagType) => {
  const userTagsRef = doc(db, "userTags", userId);
  const docSnap = await getDoc(userTagsRef);

  if (docSnap.exists()) {
    return docSnap.data()[tagType] || [];
  } else {
    return [];
  }
};

export const addUserTag = async (userId, tagType, tag) => {
  const userTagsRef = doc(db, "userTags", userId);

  try {
    await updateDoc(userTagsRef, {
      [tagType]: arrayUnion(tag),
    });
  } catch (error) {
    if (error.code === "not-found") {
      await setDoc(userTagsRef, {
        [tagType]: [tag],
      });
    } else {
      throw error;
    }
  }
};

export const getPhotobook = async (photobookId) => {
  const docRef = doc(db, "photobooks", photobookId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Photobook not found");
  }
};

export const updatePhotobook = async (photobookId, updateData) => {
  const docRef = doc(db, "photobooks", photobookId);
  await updateDoc(docRef, updateData);
};
