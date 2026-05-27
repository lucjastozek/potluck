import { DateTime } from "luxon";

function formatRelativeTime(dateTime: DateTime): string {
  const relative = dateTime.toRelative();

  if (!relative) {
    return dateTime.toLocaleString(DateTime.DATETIME_MED);
  }

  const secondsSinceCreation = Math.abs(dateTime.diffNow("seconds").seconds);

  if (secondsSinceCreation < 60) {
    return "just now";
  }

  return `${dateTime.toLocaleString(DateTime.DATETIME_MED)} • ${relative}`;
}

export function formatTimestamp(timestamp: string): string {
  const parsed = DateTime.fromISO(timestamp, { setZone: true });

  if (!parsed.isValid) {
    return timestamp;
  }

  return formatRelativeTime(parsed.toLocal());
}

export function formatDate(timestamp: string): string {
  const parsed = DateTime.fromISO(timestamp, { setZone: true });
  const dateTime = parsed.toLocal();

  return `${dateTime.toLocaleString(DateTime.DATETIME_MED)}`;
}

export function formatRelativeTimestamp(timestamp: string): string {
  const parsed = DateTime.fromISO(timestamp, { setZone: true });

  if (!parsed.isValid) return timestamp;

  const local = parsed.toLocal();
  const relative = local.toRelative();
  if (!relative) return local.toLocaleString(DateTime.DATETIME_MED);

  const secondsSinceCreation = Math.abs(local.diffNow("seconds").seconds);
  if (secondsSinceCreation < 60) return "just now";

  return relative;
}
