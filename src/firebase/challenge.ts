import {db} from "./config.ts"

import {
    doc,
    setDoc,
    updateDoc,
    serverTimestamp,
    increment,
} from "firebase/firestore";
import {collection, query, where, getDocs} from "firebase/firestore";
import type {Challenge} from "../types/domain";

import {v4 as uuidv4} from "uuid";

export async function createChallenge(name: string) {
    const idUser = uuidv4();
    const idAdmin = uuidv4();
    const urlUser = `/challenge/${idUser}`;
    const urlAdmin = `/challenge/${idAdmin}-admin`;
    const id = idUser;

    // @ts-ignore
    const c: Challenge = {
        id: id,
        name: name,
        adminUrl: urlAdmin,
        userUrl: urlUser,
        counter: 0,
        goalCounterUser: 100,
        goalCounterChallenge: 1000,
        interval_hrs: 24,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as Challenge;

    const ref = doc(db, "challenges", id);
    await setDoc(ref, {
        ...c,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    return c;
}

export async function findChallengeDocId(id: string): Promise<string | null> {
    let q = query(collection(db, "challenges"), where("userUrl", "==", id));
    let snap = await getDocs(q);

    if (snap.empty) {
        q = query(collection(db, "challenges"), where("adminUrl", "==", id));
        snap = await getDocs(q);

        if (snap.empty) return null;
    }

    return snap.docs[0].id;
}

export async function incrementChallengeCounter(id: string, value: number) {
    const ref = doc(db, "challenges", id);
    await updateDoc(ref, {
        counter: increment(value),
        updatedAt: serverTimestamp(),
    });
}

export async function updateChallenge(id: string, data: Partial<Challenge>) {
    const ref = doc(db, "challenges", id);
    console.log("Updating challenge:", id, data);
    await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}