/** Convert "YYYY-MM-DD HH:MM:SS" (24h) to "YYYY-MM-DD hh:MM:SS AM/PM" (12h) */
export function formatTime(time: string | undefined): string {
  if (!time) return "—";
  const [datePart, timePart] = time.split(" ");
  if (!timePart) return time;
  const [hoursStr, minutes, seconds] = timePart.split(":");
  let hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${datePart} ${hours}:${minutes}:${seconds} ${ampm}`;
}
