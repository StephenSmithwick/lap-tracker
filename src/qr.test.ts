import { describe, expect, it } from "vitest";
import { raceQrData, parseRaceId } from "./qr";

describe("raceQrData/parseRaceId", () => {
  it("round-trips a race id", () => {
    expect(parseRaceId(raceQrData("abc-123"))).toEqual("abc-123");
  });

  it("returns undefined for data without the race prefix", () => {
    expect(parseRaceId("abc-123")).toBeUndefined();
    expect(parseRaceId("Bib 42")).toBeUndefined();
  });
});
