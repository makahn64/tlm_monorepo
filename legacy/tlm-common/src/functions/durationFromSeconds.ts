export function durationFromSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds/60);
  const seconds = Math.floor(totalSeconds - minutes * 60);
  return `${minutes}:${seconds<10?'0':''}${seconds}`;
}
