import { differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';

export function calculateAge(dateString: string): string {
  const birthDate = new Date(dateString);
  const today = new Date();

  const weeks = differenceInWeeks(today, birthDate);
  const months = differenceInMonths(today, birthDate);
  const years = differenceInYears(today, birthDate);

  // 0-8 weeks
  if (weeks <= 8) {
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  }

  // 8 weeks to 1 year - show half months
  if (months < 12) {
    const halfMonth = weeks % 4 >= 2 ? 0.5 : 0;
    const monthValue = Math.floor(months) + halfMonth;
    return `${monthValue} ${monthValue === 1 ? 'month' : 'months'}`;
  }

  // 1-2 years - show full months
  if (months < 24) {
    return `${months} months`;
  }

  // 2-10 years - show half years
  if (years < 10) {
    const monthsAfterYear = months % 12;
    const halfYear = monthsAfterYear >= 6 ? 0.5 : 0;
    const yearValue = Math.floor(years) + halfYear;
    return `${yearValue} ${yearValue === 1 ? 'year' : 'years'}`;
  }

  // 10+ years - show full years
  return `${years} ${years === 1 ? 'year' : 'years'}`;
}
