const TIME_LOCALE_OPTIONS = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
} as const;

export const convertMinutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
};

export const convertSecondsToTimeString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) return `${hours}시간 ${mins}분`;
  else if (mins > 0) return `${mins}분 ${secs}초`;
  else return `${secs}초`;
};

export const convertISOToTimeString = (isoString: string): string => {
  const date = new Date(isoString);

  return date.toLocaleTimeString([], TIME_LOCALE_OPTIONS);
};

export const convertISOToTimeRangeString = (
  start: string,
  end: string
): string => {
  const startTime = convertISOToTimeString(start);
  const endTime = convertISOToTimeString(end);

  return `${startTime} ~ ${endTime}`;
};

export const convertDateToString = (date: Date): string =>
  date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, "-")
    .replace(/\./g, "");
