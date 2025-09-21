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

import { normalizeDate } from "./util.ts";


// -------------------------------------
// Challenge
// -------------------------------------

export async function addChallenge(
    data: Omit<Challenge, "id" | "createdAt" | "lastResetAt">
) {
    const ref = collection(db, "challenges");
    const docRef = await addDoc(ref, {
        ...data,
        createdAt: serverTimestamp(),
        lastResetAt: serverTimestamp(),
        resetTimeStr: "00:00",
    });

    return {
        ...data,
        id: docRef.id,
        lastResetAt: normalizeDate(data.lastResetAt),
        createdAt: normalizeDate(data.createdAt),
    };
}

export async function updateChallenge(
    challengeId: string,
    data: Partial<Omit<Challenge, "id">>
) {
    const ref = doc(db, "challenges", challengeId);
    await updateDoc(ref, data);
}

export async function deleteChallenge(challengeId: string) {
    const ref = doc(db, "challenges", challengeId);
    await deleteDoc(ref);
}
