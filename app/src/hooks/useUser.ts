import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import type { User } from "../types/domain";
import { normalizeDate } from "../firebase/util";

// hook for user

export function useUser(challengeId: string, userId: string) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!challengeId || !userId) return;

    const ref = doc(db, "challenges", challengeId, "users", userId);
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setUser({ id: snap.id, ...(snap.data() as Omit<User, "id">),
          lastActivityAt: normalizeDate(snap.data().lastActivityAt)
         });
      } else {
        setUser(null);
      }
    });
  }, [challengeId, userId]);

  return user;
}