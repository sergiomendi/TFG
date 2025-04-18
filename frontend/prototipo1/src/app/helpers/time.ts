export function unixToShortDate(unixTimestamp: number): string {
  return new Date(unixTimestamp * 1000).toLocaleDateString();
}
export function getCurrentDayUnix(): number {
  return Math.floor(Date.now() / 1000);
}
