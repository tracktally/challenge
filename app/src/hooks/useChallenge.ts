import { useEffect, useState } from "react";
import { doc, onSnapshot, query, where, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Challenge, User } from "../types/domain";
import { normalizeDate } from "../firebase/util";

// fetch a challenge by id
export function useChallenge(challengeId: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const ref = doc(db, "challenges", challengeId);
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setChallenge({ 
          ...(snap.data() as Omit<Challenge, "id">) ,
          id: snap.id, 
          createdAt: normalizeDate(snap.data().createdAt),
          lastResetAt: normalizeDate(snap.data().lastResetAt),
          });
      } else {
        setChallenge(null);
      }
    });
  }, [challengeId]);

  return challenge;
}