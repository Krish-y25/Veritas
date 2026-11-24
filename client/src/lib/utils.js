import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard utility function for merging Tailwind CSS classes with clsx.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
