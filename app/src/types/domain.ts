
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
    cutOffDays: number; // days of inactivity before marked inactive

    // stats
    partialStreak?: number;
    fullStreak?: number;   
    totalCounter?: number;    
    bestPartialStreak?: number;
    bestFullStreak?: number;   
}

export interface User {
    id: string;
    name: string;
    counter: number;
    lastActivityAt: Date | null;
    goalReachedAt: Date | null;
    goalPartialReachedAt: Date | null; // for things like partial streak
    
    // stats
    partialStreak?: number;
    fullStreak?: number;   
    totalCounter?: number;    
    bestPartialStreak?: number;
    bestFullStreak?: number;   
}

// challenge/{id}/auth/{id}
export interface UserAuth {
    id: string;
    userId: string;
    provider: string;
    userName: string;
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