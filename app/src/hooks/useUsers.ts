import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import type { User } from "../types/domain";
import { normalizeDate } from "../firebase/util";

// hook for all users in a challenge

export function useUsers(challengeId: string) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!challengeId) return;

    const ref = collection(db, "challenges", challengeId, "users");
    return onSnapshot(ref, (snap) => {
      const list = snap.docs.map(
        (doc) => ({ id: doc.id, ...(doc.data() as Omit<User, "id">), 
          lastActivityAt: normalizeDate(doc.data().lastActivityAt)
         })
      );
      setUsers(list);
    });
  }, [challengeId]);

  return users;
}