import { createAPI } from "@/api";
import { inMemoryDB } from "@/test/inMemoryDB";
import { testClient } from "hono/testing";
import { expect, describe, it } from "vitest";
import { group, runner, lap } from "./db/schema";

async function setup() {
  const db = await inMemoryDB();
  const api = createAPI(async () => db);
  const client = testClient(api);
  return { db, client };
}

describe("laps.$get", () => {
  it("returns recorded laps", async () => {
    const { db, client } = await setup();
    await db.insert(group).values({
      id: "00000000-0000-0000-0000-000000000000",
      name: "Test group",
    });
    await db.insert(runner).values({
      ref: "00000000-0000-0000-0000-000000000001",
      groupId: "00000000-0000-0000-0000-000000000000",
    });
    await db.insert(lap).values({
      runnerRef: "00000000-0000-0000-0000-000000000001",
      timestamp: new Date("2026-09-02T11:30:00.000Z"),
    });

    const res = await client.laps.$get();

    expect(await res.json()).toEqual([
      {
        id: 1,
        runnerRef: "00000000-0000-0000-0000-000000000001",
        timestamp: "2026-09-02T11:30:00.000Z",
      },
    ]);
  });
});
