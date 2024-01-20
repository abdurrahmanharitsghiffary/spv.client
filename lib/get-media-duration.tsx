export const getMediaDuration = (seconds: number) => {
  const date = new Date(seconds * 1000);
  const h = date.getUTCHours();
  const m = date.getUTCMinutes();
  const s = date.getUTCSeconds();

  const mm = m.toString().length > 1 ? m : `0${m}`;
  const ss = s.toString().length > 1 ? s : `0${s}`;

  return `${mm}:${ss}`;
};
