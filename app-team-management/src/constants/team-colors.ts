export const TEAM_TONES = [
  'green',
  'yellow',
  'blue',
  'purple',
  'orange',
  'pink',
  'cyan',
  'red',
] as const;

export type TeamTone = (typeof TEAM_TONES)[number];
