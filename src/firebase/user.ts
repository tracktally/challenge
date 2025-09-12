import {db} from "./config.ts"

import {collection, doc, serverTimestamp, addDoc, setDoc, getDocs} from "firebase/firestore";

import type {Challenge, User} from "../types/domain";
import { updateDoc, increment } from "firebase/firestore";

export async function createUser(challengeId: string,
                                 userName: string) {
    const usersRef = collection(db, "challenges", challengeId, "users");
    const u: User = {
        name: userName,
        lastUpdatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        counter: 0,
        goalReachedAt: null, 
    } as User;

    const docRef = await addDoc(usersRef, u);

    return {
        id: docRef.id,
        ...u,
    } as User;
}

export async function getUsersOfChallenge(challengeId: string) {
    const usersRef = collection(db, "challenges", challengeId, "users");
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users;
}

export async function incrementUserCounter(challengeId: string, userId: string, value: number, challengeGoal: number) {
    const ref = doc(db, "challenges", challengeId, "users", userId);

    
    await updateDoc(ref, {
        counter: increment(value),
        updatedAt: serverTimestamp(),
    });
}

export function getUserCounter(challengeId: string, userId: string): Promise<number> {
    const ref = doc(db, "challenges", challengeId, "users", userId);
    const snapshot = getDocs(ref);
    console.log("User snapshot: ", snapshot);
    return snapshot.exists() ? (snapshot.data().counter || 0) : 0;
}

export async function setGoalReachedAt(challengeId: string, userId: string) {
    const ref = doc(db, "challenges", challengeId, "users", userId);
    await updateDoc(ref, {
        goalReachedAt: serverTimestamp(),
    });
}