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

export const FALLBACK_TEAM_TONE: TeamTone = 'green';

// Espelho de --color-team-* em src/styles/theme.css.
export const TEAM_TONE_HEX: Record<TeamTone, string> = {
  green: '#00b37e',
  yellow: '#c9a227',
  blue: '#7fb5e3',
  purple: '#8b5cf6',
  orange: '#f97316',
  pink: '#ec4899',
  cyan: '#06b6d4',
  red: '#ef4444',
};

const TONE_BY_HEX = new Map<string, TeamTone>(
  TEAM_TONES.map((tone) => [TEAM_TONE_HEX[tone].toLowerCase(), tone] as const),
);

export const teamToneToHex = (tone: TeamTone): string => TEAM_TONE_HEX[tone];

export const teamToneFromHex = (colorHex: string | null | undefined): TeamTone =>
  TONE_BY_HEX.get(colorHex?.toLowerCase() ?? '') ?? FALLBACK_TEAM_TONE;
