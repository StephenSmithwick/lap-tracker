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

describe("races", () => {
  it("lists only races the user belongs to", async () => {
    const { client, seed } = await setup();
    await seed({
      user: [{ sub: "user", name: "user" }],
      race: [
        { id: uuid(1), name: "Spring 5k" },
        { id: uuid(2), name: "Other race" },
      ],
      userRace: [{ user: "user", race: uuid(1) }],
    });

    const res = await client.races.$get({}, await headers("user"));

    expect(await res.json()).toEqual([{ id: uuid(1), name: "Spring 5k" }]);
  });

  it("creates a race, grants access, and selects it", async () => {
    const { client, seed } = await setup();
    await seed({ user: [{ sub: "user", name: "user" }] });

    const createRes = await client.races.$post(
      { json: { name: "Spring 5k" } },
      await headers("user"),
    );
    expect(createRes.status).toBe(200);
    const created = await createRes.json();
    expect(created).toMatchObject({ name: "Spring 5k" });

    const selectedRes = await client.races.selected.$get(
      {},
      await headers("user"),
    );
    expect(await selectedRes.json()).toEqual(created);
  });

  it("rejects creating a race without a name", async () => {
    const { client, seed } = await setup();
    await seed({ user: [{ sub: "user", name: "user" }] });

    const res = await client.races.$post(
      { json: { name: "" } },
      await headers("user"),
    );
    expect(res.status).toBe(400);
  });

  it("previews a race by id without granting access or selecting it", async () => {
    const { client, seed } = await setup();
    await seed({
      user: [{ sub: "user", name: "user" }],
      race: [{ id: uuid(3), name: "Trail Run" }],
    });

    const res = await client.races[":id"].$get(
      { param: { id: uuid(3) } },
      await headers("user"),
    );
    expect(await res.json()).toEqual({ id: uuid(3), name: "Trail Run" });

    const selectedRes = await client.races.selected.$get(
      {},
      await headers("user"),
    );
    expect(await selectedRes.json()).toBeNull();
  });

  it("404s previewing an unknown race id", async () => {
    const { client, seed } = await setup();
    await seed({ user: [{ sub: "user", name: "user" }] });

    const res = await client.races[":id"].$get(
      { param: { id: uuid(9) } },
      await headers("user"),
    );
    expect(res.status).toBe(404);
  });

  it("joins an existing race and makes it the user's selected race", async () => {
    const { client, seed } = await setup();
    await seed({
      user: [{ sub: "user", name: "user" }],
      race: [{ id: uuid(3), name: "Trail Run" }],
    });

    const res = await client.races[":id"].join.$post(
      { param: { id: uuid(3) } },
      await headers("user"),
    );
    expect(await res.json()).toEqual({ id: uuid(3), name: "Trail Run" });

    const selectedRes = await client.races.selected.$get(
      {},
      await headers("user"),
    );
    expect(await selectedRes.json()).toEqual({ id: uuid(3), name: "Trail Run" });
  });

  it("404s when joining an unknown race id", async () => {
    const { client, seed } = await setup();
    await seed({ user: [{ sub: "user", name: "user" }] });

    const res = await client.races[":id"].join.$post(
      { param: { id: uuid(9) } },
      await headers("user"),
    );
    expect(res.status).toBe(404);
  });
});

describe("runners.scan", () => {
  it("creates a runner, records a lap, and returns the lap count", async () => {
    const { client, seed } = await setup();
    await seed({
      race: [{ id: uuid(0), name: "Spring 5k" }],
      user: [{ sub: "user", name: "user", selectedRace: uuid(0) }],
    });

    const res = await client.runners.scan.$post(
      { json: { data: "bib:42" } },
      await headers("user"),
    );
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.race).toEqual({ id: uuid(0), name: "Spring 5k" });
    expect(body.lapCount).toBe(1);
    expect(body.runner.info).toEqual("bib:42");
  });

  it("keeps the same runner and original info on repeat scans, incrementing the lap count", async () => {
    const { client, seed } = await setup();
    await seed({
      race: [{ id: uuid(0), name: "Spring 5k" }],
      user: [{ sub: "user", name: "user", selectedRace: uuid(0) }],
    });

    const first = await client.runners.scan.$post(
      { json: { data: "bib:42" } },
      await headers("user"),
    );
    const second = await client.runners.scan.$post(
      { json: { data: "bib:42" } },
      await headers("user"),
    );

    const firstBody = await first.json();
    const secondBody = await second.json();
    expect(secondBody.runner.ref).toEqual(firstBody.runner.ref);
    expect(secondBody.runner.info).toEqual("bib:42");
    expect(secondBody.lapCount).toBe(2);
  });

  it("400s when no race is selected", async () => {
    const { client, seed } = await setup();
    await seed({ user: [{ sub: "user", name: "user" }] });

    const res = await client.runners.scan.$post(
      { json: { data: "bib:42" } },
      await headers("user"),
    );
    expect(res.status).toBe(400);
  });

  it("400s for empty data", async () => {
    const { client, seed } = await setup();
    await seed({
      race: [{ id: uuid(0), name: "Spring 5k" }],
      user: [{ sub: "user", name: "user", selectedRace: uuid(0) }],
    });

    const res = await client.runners.scan.$post(
      { json: { data: "" } },
      await headers("user"),
    );
    expect(res.status).toBe(400);
  });
});
