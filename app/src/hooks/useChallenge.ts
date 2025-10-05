import { useEffect, useState } from "react";
import { doc, onSnapshot, query, where, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Challenge, User } from "../types/domain";
import { normalizeDate } from "../firebase/util";
import type { FirebaseError } from "firebase/app";

// fetch a challenge by id
export function useChallenge(challengeId: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<FirebaseError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const ref = doc(db, "challenges", challengeId);
    return onSnapshot(ref, 
      (snap) => {
      if (snap.exists()) {
        setChallenge({ 
          ...(snap.data() as Omit<Challenge, "id">) ,
          id: snap.id, 
          createdAt: normalizeDate(snap.data().createdAt),
          lastResetAt: normalizeDate(snap.data().lastResetAt),
          });
          setLoading(false);
      } else {
        setChallenge(null);
        setLoading(false);
      }
    },
  (err) => {
    console.error("Error fetching challenge:", err);
    setError(err as FirebaseError);
    setChallenge(null); 
    setLoading(false);
  });
  }, [challengeId]);

  return {challenge, error, loading};
}