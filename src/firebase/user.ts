import {db} from "./config.ts"

import {collection, doc, serverTimestamp, addDoc, setDoc,} from "firebase/firestore";

import type {Challenge, User} from "../types/domain";

export async function createUser(challengeId: string,
                                 userName: string) {
    const usersRef = collection(db, "challenges", challengeId, "users");
    const u: User = {
        name: userName,
        lastUpdatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        counter: 0,
    } as User;

    const docRef = await addDoc(usersRef, u);

    return {
        id: docRef.id,
        ...u,
    } as User;
}