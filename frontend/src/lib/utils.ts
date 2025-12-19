import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// This function merges tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}