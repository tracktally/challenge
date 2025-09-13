import { db } from "./config.ts"

import {
    doc,
    setDoc,
    addDoc, deleteDoc,
    updateDoc,
    serverTimestamp,
    increment,
} from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { User, Challenge } from "../types/domain.ts"

import { v4 as uuidv4 } from "uuid";

// -------------------------------------
// User
// -------------------------------------
export async function addUser(
    challengeId: string,
    data: Omit<User, "id">
) {
    const ref = collection(db, "challenges", challengeId, "users");
    const docRef = await addDoc(ref, {
        ...data,
    });
    return {
        id: docRef.id,
        ...data,
    };
}

export async function updateUser(
    challengeId: string,
    userId: string,
    data: Partial<Omit<User, "id">>
) {
    const ref = doc(db, "challenges", challengeId, "users", userId);
    await updateDoc(ref, data);
}

export async function incrementChallenge(challengeId: string, userId: string, inc: number) {
    const ref = doc(db, "challenges", challengeId, "users", userId);
    await updateDoc(ref, { counter: increment(inc) });

    const ref2 = doc(db, "challenges", challengeId);
    await updateDoc(ref2, { counter: increment(inc) });
}

export async function deleteUser(challengeId: string, userId: string) {
    const ref = doc(db, "challenges", challengeId, "users", userId);
    await deleteDoc(ref);
}