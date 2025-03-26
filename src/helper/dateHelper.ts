import { format } from 'date-fns';

/**
 * Return the current date without time.
 * @returns Date in format YYYY-MM-DDD like 2023-12-25
 */
export const getFormattedDate = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};
