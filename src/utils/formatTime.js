export const formatTime = (timeInMs) => {
  const pad = (num, size = 2) => num.toString().padStart(size, "0");

  const hours = Math.floor(timeInMs / 3600000);
  const minutes = Math.floor((timeInMs % 3600000) / 60000);
  const seconds = Math.floor((timeInMs % 60000) / 1000);
  const milliseconds = Math.floor((timeInMs % 1000) / 10);

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
};
