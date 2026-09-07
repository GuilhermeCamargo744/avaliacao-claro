const POSTGRES_TIMESTAMP =
  /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.(\d+))?(?:(Z)|([+-]\d{2})(?::?(\d{2}))?)?$/;

// A API devolve timestamptz cru do Postgres, que o Hermes não parseia.
export const toIsoTimestamp = (value: string) => {
  const match = POSTGRES_TIMESTAMP.exec(value.trim());
  if (!match) return value;

  const [, date, time, fraction, zulu, offsetHours, offsetMinutes] = match;
  const milliseconds = fraction ? `.${fraction.slice(0, 3).padEnd(3, '0')}` : '.000';
  const zone = zulu ?? (offsetHours ? `${offsetHours}:${offsetMinutes ?? '00'}` : 'Z');

  return `${date}T${time}${milliseconds}${zone}`;
};
