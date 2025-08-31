export interface User {
    id: string;
    name: string;
    createdAt: Date;
    platform?: string;
    counter: number;
    lastUpdatedAt: Date;
}

export interface Challenge {
    id: string;
    name: string;
    adminUrl: string;
    userUrl: string;
    interval_hrs: number;
    counter: number;
    goalCounterUser: number;
    goalCounterChallenge: number;
    cratedAt: Date;
    startedAt: Date;
    users: User[];
}


// some ideas

// export interface UserHistory {
//     counter: number;
//     goalCounter: number;
//     date: Date;
// }
//
// export interface ProgressHistory {
//     count: number;
//     lastUpdatedAt: Date;
// }
//
// export interface ChallengeHistory {
//     date: Date;
//     users: ChallengeHistoryEntry[];
// }
//
// export interface ChallengeHistoryEntry {
//     date: Date;
//     userId: string;
//     name: string;
//     counter: number;
// }
