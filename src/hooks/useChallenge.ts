import { useEffect, useState } from "react";
import { doc, onSnapshot, query, where, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Challenge, User } from "../types/domain";

export function useChallengeByUuid(uuid: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const ref = collection(db, "challenges");

    // Query for publicUuid
    const qPublic = query(ref, where("publicUuid", "==", uuid));
    const unsubPublic = onSnapshot(qPublic, (snap) => {
      if (!snap.empty) {
        const doc = snap.docs[0];
        const data = doc.data() as Challenge;
        // TODO: We should not leak admin UUID here!
        setChallenge({ id: doc.id, ...data });
        setIsAdmin(false);
      }
    });

    // Query for adminUuid
    const qAdmin = query(ref, where("adminUuid", "==", uuid));
    const unsubAdmin = onSnapshot(qAdmin, (snap) => {
      if (!snap.empty) {
        const doc = snap.docs[0];
        const data = doc.data() as Challenge;

        setChallenge({ id: doc.id, ...data });
        setIsAdmin(true);
      }
    });

    return () => {
      unsubPublic();
      unsubAdmin();
    };
  }, [uuid]);

  return { challenge, isAdmin };
}

export function useChallenge(challengeId: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const ref = doc(db, "challenges", challengeId);
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setChallenge({ id: snap.id, ...(snap.data() as Omit<Challenge, "id">) });
      } else {
        setChallenge(null);
      }
    });
  }, [challengeId]);

  return challenge;
}