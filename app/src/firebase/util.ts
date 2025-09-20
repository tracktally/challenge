
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