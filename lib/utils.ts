import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const playerPositionAbbreviations: Record<string, string> = {
  GOALKEEPER: 'BR',
  DEFENDER: 'OBR',
  MIDFIELDER: 'POM',
  FORWARD: 'N',
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPlayerPositionAbbreviation(position: string) {
  return playerPositionAbbreviations[position] || position;
}
