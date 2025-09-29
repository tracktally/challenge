import { useEffect, useState } from "react";
import { collection, limit, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Activity } from "../types/domain.ts";

// listen to updates in Activities

function floorTo5Min(date: Date): number {
  return Math.floor(date.getTime() / (5 * 60 * 1000)) * (5 * 60 * 1000);
}

export function useActivities(challengeId: string, lastN = 10,) {
  const [logs, setLogs] = useState<Activity[]>([]);

  useEffect(() => {
    const ref = collection(db, "challenges", challengeId, "activities");
    const q = query(ref, orderBy("createdAt", "desc"), limit(lastN)); // newest first
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Activity, "id" | "createdAt">),
        createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
      }));

      const grouped = new Map<string, Activity>();

      for (const entry of list) {
        const bucket = floorTo5Min(entry.createdAt);
        const key = `${entry.userId}-${bucket}`;

        if (!grouped.has(key)) {
          grouped.set(key, { ...entry, createdAt: new Date(bucket) });
        } else {
          const existing = grouped.get(key)!;
          grouped.set(key, {
            ...existing,
            amount: existing.amount + entry.amount, // sum amounts
          });
        }
      }

      // Convert back to array, sort newest first
      const groupedList = Array.from(grouped.values()).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      setLogs(groupedList.slice(0, lastN)); // return top N buckets

    //   setLogs(list);
    });
  }, [challengeId, lastN]);

  return logs;
}

