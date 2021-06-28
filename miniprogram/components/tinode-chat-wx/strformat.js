// Convert seconds to minutes:seconds, i.e. 156 sec -> 2:36.
export function secondsToTime(seconds) {
  const min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  sec = sec < 10 ? `0${sec}` : sec;
  return `${min}:${sec}`;
}