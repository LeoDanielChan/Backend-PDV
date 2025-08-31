export const timeStringToDate = (timeString: string): Date => {
  const timeParts = timeString.split(':');
  if (timeParts.length < 2) {
    throw new Error('Formato de hora inválido. Use HH:MM o HH:MM:SS');
  }

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    throw new Error('Hora, minutos o segundos fuera de rango válido');
  }

  const date = new Date(1970, 0, 1);
  date.setHours(hours, minutes, seconds, 0);
  return date;
};

export const dateToTimeString = (date: Date): string => {
  return date.toTimeString().slice(0, 8);
};

export const dateToShortTimeString = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};