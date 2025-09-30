
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
    lastActivityAt: Date | null;
    goalReachedAt: Date | null;
    goalPartialReachedAt: Date | null; // for things like partial strike
    
    // stats
    partialStrike?: number;
    fullStrike?: number;   
    totalCounter?: number;    

    bestPartialStrike?: number;
    bestFullStrike?: number;   
    



}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  createdAt: Date;
}

export interface DailyStats {
    id: string; // dateId YYYYMMDD
    date: Date; // actual date
    teamTotal: number;
    users: Record<string, number>; // userId -> total
    createdAt: Date;
    goalCounterUser: number;
    goalCounterChallenge: number;
}