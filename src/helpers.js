export function getDateStr(daysFromToday = "0") {
  const date = new Date();

  // x-model gives string → convert to number
  const days = Number(daysFromToday);

  date.setDate(date.getDate() + days);

  return date.toISOString().split('T')[0];
}
