
export interface Challenge {
    id: string;
    name: string;
    publicUuid: string;
    adminUuid: string;
    interval_hrs: number;
    counter: number;
    goalCounterUser: number;
    goalCounterChallenge: number;
    createdAt: Date;
    startedAt: Date;
}

export interface User {
    id: string;
    name: string;
    counter: number;
}