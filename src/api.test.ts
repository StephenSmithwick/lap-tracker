import { createAPI } from "@/api";
import { dbSeed, inMemoryDB } from "@/test/inMemoryDB";
import { testClient } from "hono/testing";
import { expect, describe, it } from "vitest";
import { randomBytes } from "node:crypto";
import { sign } from "hono/jwt";
import { uuid } from "@/test/fixtures";

const JWT_SECRET = randomBytes(32).toString("hex");

const headers = async (sub: string) => ({
  headers: {
    Cookie: `auth_token=${await sign({ sub }, JWT_SECRET)}`,
  },
});

async function setup() {
  const db = await inMemoryDB();
  const client = testClient(
    createAPI(async () => db),
    { JWT_SECRET },
  );
  const seed = dbSeed(db);

  return { db, client, seed };
}

describe("laps.$get", () => {
  it("returns laps from group the user is focussed on", async () => {
    const { client, seed } = await setup();
    const jan1970 = new Date("1970-01-01T00:00:00Z");
    const jan2020 = new Date("2020-01-01T12:00:00Z");
    await seed({
      race: [
        { id: uuid(0), name: "focus race" },
        { id: uuid(1), name: "Other race" },
      ],
      user: [{ sub: "user", name: "user", selectedRace: uuid(0) }],
      runner: [{ ref: uuid(1), info: { name: "tom" } }],
      lap: [
        { timestamp: jan2020, runner: uuid(1), race: uuid(0) },
        { timestamp: jan1970, runner: uuid(1), race: uuid(1) },
      ],
    });
    const res = await client.laps.$get({}, await headers("user"));

    expect(await res.json()).toEqual([
      {
        id: 1,
        runner: "00000000-0000-0000-0000-000000000001",
        timestamp: "2020-01-01T12:00:00.000Z",
      },
    ]);
  });
});
