import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a YYYY-MM-DD string using the browser's local calendar date.
 * `date.toISOString()` converts to UTC first, which silently rolls back
 * to the previous day during early-morning hours in timezones ahead of
 * UTC (e.g. Sri Lanka, UTC+5:30) — always use this for "today" defaults.
 */
export function toLocalDateInputValue(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns a YYYY-MM-DDTHH:mm:ss string using local wall-clock time.
 * The backend's `/range` endpoints (attendance, labour, loads, expenses,
 * ammonia, rubber) parse `from`/`to` as naive `LocalDateTime` with no
 * timezone conversion, and stored timestamps are the naive local values
 * the user typed in — so range boundaries must be serialized the same
 * way. `date.toISOString()` converts to UTC first, which shifts the
 * boundary by the local UTC offset (e.g. -5:30 in Sri Lanka) and silently
 * drops or includes the wrong records.
 */
export function toLocalDateTimeString(date: Date): string {
  return `${toLocalDateInputValue(date)}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}
