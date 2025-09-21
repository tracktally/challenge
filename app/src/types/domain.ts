
export interface Challenge {
    id: string;
    name: string;
    interval_hrs: number;
    counter: number;
    goalCounterUser: number;
    goalCounterChallenge: number;
    createdAt: Date;
    lastResetAt: Date;
    resetTimeStr: string   // HH:mm
}

export interface User {
    id: string;
    name: string;
    counter: number;
    goalReachedAt: Date | null;
    goalPartialReachedAt: Date | null; // for things like partial strike
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  createdAt: Date;
}