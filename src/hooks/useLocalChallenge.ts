import {useState, useEffect} from "react";

const STORAGE_KEY = "joinedChallenges";

export interface LocalChallenge {
    id: string;
    name: string;
    adminUrl: string;
    userUrl: string;
    userId: string;
}

export function useLocalChallenge() {
    const [localChallenges, setLocalChallenges] = useState<LocalChallenge[]>([]);

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                setLocalChallenges(JSON.parse(raw));
            } catch {
                setLocalChallenges([]);
            }
        }
    }, []);

    function containsLocalChallenge(id: string): boolean {
        return localChallenges.filter((item) => item.id === id).length > 0;
    }

    // function saveLocalChallenge(challenge: LocalChallenge) {
    //     setLocalChallenges((prev) => {
    //         const next = [...prev, challenge];
    //         localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); // persist immediately
    //         return next;
    //     });
    // }

    function saveLocalChallenge(challenge: LocalChallenge) {
        setLocalChallenges((prev) => {
            const exists = prev.some((c) => c.id === challenge.id);

            let next;
            if (exists) {
                // update existing
                next = prev.map((c) => (c.id === challenge.id ? challenge : c));
            } else {
                // add new
                next = [...prev, challenge];
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }

    function getLocalChallenge(id: string): LocalChallenge | undefined {
        return localChallenges.find((c) => c.id === id);
    }

    function removeLocalChallenge(id: string) {
        setLocalChallenges((prev) => {
            const next = prev.filter((c) => c.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }

    return {
        localChallenges,
        saveLocalChallenge,
        setLocalChallenges,
        removeLocalChallenge,
        getLocalChallenge,
        containsLocalChallenge
    };
}
