const RACE_PREFIX = "race:";

// Race QR codes are tagged so a scan can tell a race apart from a racer
// without knowing anything else about the racer QR format.
export function raceQrData(raceId: string): string {
  return `${RACE_PREFIX}${raceId}`;
}

export function parseRaceId(qrData: string): string | undefined {
  return qrData.startsWith(RACE_PREFIX)
    ? qrData.slice(RACE_PREFIX.length)
    : undefined;
}
