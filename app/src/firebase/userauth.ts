import { db, auth} from "./config.ts"

import {
    doc,
    setDoc,
    getDoc,
    addDoc, deleteDoc,
    updateDoc,
    serverTimestamp,
    increment,
} from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { UserAuth, Challenge } from "../types/domain.ts"
import type { Auth } from "firebase/auth";

// -------------------------------------
// User
// -------------------------------------

// const uid = auth?.currentUser?.uid;
export async function getUserAuth(challengeId: string, userAuth: string): Promise<UserAuth | null> {  
  const ref = doc(db, "challenges", challengeId, "auth", userAuth);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() as UserAuth : null;
}

export async function addUserAuth(challengeId: string, authId: string, data: UserAuth): Promise<UserAuth>  {
  const ref = doc(db, "challenges", challengeId, "auth", authId);

  await setDoc(ref, {
    ...data,
  });

  return {
    id: authId,
    ...data,
  } as UserAuth;
}
