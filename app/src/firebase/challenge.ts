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
import { normalizeDate } from "./util.ts";


// -------------------------------------
// Challenge
// -------------------------------------

export async function addChallenge(
    data: Omit<Challenge, "id" | "publicUuid" | "adminUuid" | "createdAt" | "lastResetAt">
) {
    const idUser = uuidv4();
    const idAdmin = uuidv4();

    const ref = collection(db, "challenges");
    const docRef = await addDoc(ref, {
        ...data,
        publicUuid: idUser,
        adminUuid: idAdmin,
        createdAt: serverTimestamp(),
        lastResetAt: serverTimestamp(),
        resetTimeStr: "00:00",
    });

    return {
        ...data,
        id: docRef.id,
        publicUuid: idUser,
        adminUuid: idAdmin,
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
