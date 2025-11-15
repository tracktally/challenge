
export function normalizeDate(value: any): Date | null {
  if (!value) return null;

  // Firestore Timestamp object
  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  // Firestore { seconds, nanoseconds } object
  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000 + (value.nanoseconds || 0) / 1e6);
  }

  // Already a Date
  if (value instanceof Date) {
    return value;
  }

  // String or number → try to parse
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

// Default sort for users
export function sortUserByProgress(a: {
  goalReachedAt?: Date,
  counter?: number;
  lastActivityAt?: Date
}, b: {
    goalReachedAt?: Date,
    counter?: number;
    lastActivityAt?: Date
  }): number {
  const aTime = normalizeDate(a.goalReachedAt)?.getTime() ?? null;
  const bTime = normalizeDate(b.goalReachedAt)?.getTime() ?? null;

  // goal reached
  if (aTime && bTime) return aTime - bTime;
  if (aTime && !bTime) return -1;
  if (!aTime && bTime) return 1;

  // counter
  if (a.counter !== b.counter) {
    return b.counter - a.counter;
  }

  // last activity: newer first
  const aAct = normalizeDate(a.lastActivityAt)?.getTime() ?? 0;
  const bAct = normalizeDate(b.lastActivityAt)?.getTime() ?? 0;
  return bAct - aAct;
}

export function getResetDates(challenge: {
    interval_hrs?: number;
    resetTimeStr?: string;
    lastResetAt?: Date;
}, now: Date = new Date()): {
    lastResetDate: Date;
    nextResetDate: Date;
} {

    const toPosIntegerOrDefault = (v: unknown, def: number): number =>
        Number.isInteger(v) && (v as number) > 0 ? (v as number) : def;

    const isValidDate = (d: unknown): d is Date =>
        d instanceof Date && !Number.isNaN(d.getTime());

    const yesterdayMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
    );

    /* Sanitation. Work with these instead of challenge */
    const intervalHrs = toPosIntegerOrDefault(challenge?.interval_hrs, 24);
    const resetTimeStr = (challenge?.resetTimeStr ?? '').trim() || '00:00';
    const lastResetDate = isValidDate(challenge?.lastResetAt)
        ? challenge.lastResetAt
        : yesterdayMidnight;

    const [h, m] = resetTimeStr.split(':').map(Number);
    lastResetDate.setHours(h ?? 0, m ?? 0, 0, 0);

    const nextResetDate = new Date(lastResetDate);
    nextResetDate.setHours(nextResetDate.getHours() + intervalHrs);

    return { lastResetDate, nextResetDate };
}

