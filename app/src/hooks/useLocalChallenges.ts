import { useState, useEffect, useCallback } from "react";

// operations to store challenge to local storage (in browser)
export interface LocalChallenge {
    challengeId: string;
    publicUuid: string;
    adminUuid: string;
    name: string;
    userId: string;
    userName: string;
    url: string;
}

export type LocalChallenges = Record<string, LocalChallenge>; // keyed by challengeId

const STORAGE_KEY = "LocalChallenges";

function loadFromStorage(): LocalChallenges {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveToStorage(data: LocalChallenges) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useLocalChallenges() {
    const [localChallenges, setLocalChallenges] = useState<LocalChallenges>({});

    useEffect(() => {
        setLocalChallenges(loadFromStorage());
    }, []);

    const addLocalChallenge = useCallback((entry: LocalChallenge) => {
        setLocalChallenges((prev) => {
            const updated = { ...prev, [entry.challengeId]: entry };
            saveToStorage(updated);
            return updated;
        });
    }, []);

    const removeLocalChallenge = useCallback((challengeId: string) => {
        setLocalChallenges((prev) => {
            const updated = { ...prev };
            delete updated[challengeId];
            saveToStorage(updated);
            return updated;
        });
    }, []);

    const updateLocalChallenge = useCallback(
        (challengeId: string, updates: Partial<LocalChallenge>) => {
            setLocalChallenges((prev) => {
                if (!prev[challengeId]) return prev; // nothing to update
                const updatedEntry = { ...prev[challengeId], ...updates };
                const updated = { ...prev, [challengeId]: updatedEntry };
                saveToStorage(updated);
                return updated;
            });
        },
        []
    );

    const getChallenge = useCallback(
        (challengeId: string): LocalChallenge | null =>
            localChallenges[challengeId] ?? null,
        [localChallenges]
    );

    return {
        localChallenges,
        addLocalChallenge,
        removeLocalChallenge,
        getChallenge,
        updateLocalChallenge
    };
}