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
import type { Activity } from "../types/domain.ts"
import { normalizeDate } from "./util.ts";


export async function logActivity(challengeId: string,
    data: Omit<Activity, "id" | "createdAt | userId | userName">) {
    const ref = collection(db, "challenges", challengeId, "activities");
    const created = serverTimestamp();
    console.log("logging", data);
    await addDoc(ref, {
        ...data,
        createdAt: created
    });

    return {
        ...data,
        id: ref.id,
        createdAt: normalizeDate(created),

    };
}