import {useEffect, useState} from "react";
import {db} from "../firebase/config";
import {doc, onSnapshot} from "firebase/firestore";
import type {Challenge} from "../types/domain";
import {findChallengeDocId} from "../firebase/challenge.ts";

export function useChallenge(id: string) {
    const [challenge, setChallenge] = useState<Challenge | null>(null);

    useEffect(() => {
        if (!id) return;

        const ref = doc(db, "challenges", id);
        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                console.log("does exist");
                setChallenge({
                    id: snap.id,
                    name: data.name,
                    adminUrl: data.adminUrl,
                    counter: data.counter,
                    cratedAt: data.createdAt?.toDate(),
                    goalCounterUser: data.goalCounterUser,
                    goalCounterChallenge: data.goalCounterChallenge,
                    interval_hrs: data.interval_hrs,
                    startedAt: data.startedAt?.toDate(),
                    userUrl: data.userUrl,
                } as Challenge);
            } else {
                console.log("does not exist");
                setChallenge(null);
            }
        });
        return () => unsub();
    }, [id]);

    return challenge;
}


export function useChallengeByAnyId(anyId: string | null) {
    const [docId, setDocId] = useState<string | null>(null);

    useEffect(() => {
        if (!anyId) return;
        let active = true;
        findChallengeDocId(anyId).then((resolved) => {
            if (active) setDocId(resolved);
        });
        return () => {
            active = false;
        };
    }, [anyId]);

    return useChallenge(docId ?? "");
}
