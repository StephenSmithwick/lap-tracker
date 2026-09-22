import type { LapData } from "@/api";
import { vi } from "vitest";

export function testLap(overrides: Partial<LapData> = {}): LapData {
  return {
    id: 1,
    runnerRef: "00000000-0000-0000-0000-000000000001",
    timestamp: "1970-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function uuid(id: number) {
  const end = `${id}`.padStart(12, "0");
  return `00000000-0000-0000-0000-${end}`;
}

export const jsonResponse = (json: unknown) =>
  new Response(JSON.stringify(json));

export const mockJSONRequest = (object: unknown) =>
  vi.fn().mockResolvedValue(jsonResponse(object));
