import { Hono } from "hono";
import { hc } from "hono/client";
import { and, count, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { LoadDB, DB, setDB, db } from "@/db/db";
import { lap, race, runner, user, userRace } from "@/db/schema";
import { Context } from "hono";
import { errorHandler } from "./errors";
import { requireAuthCookie, authUser } from "./security";
import { runnerRef } from "./runner";

export type ApiEnv = {
  Bindings: CloudflareBindings;
  Variables: {
    db: DB;
  };
};

type Lap = typeof lap.$inferSelect;
export interface LapData extends Omit<Lap, "timestamp"> {
  timestamp: string;
}

export interface RaceData {
  id: string;
  name: string;
}

export type RunnerData = typeof runner.$inferSelect;

export interface ScanResult {
  runner: RunnerData;
  race: RaceData;
  lapCount: number;
}

export type ApiContext = Context<ApiEnv>;
export type ApiType = ReturnType<typeof createAPI>;
export type ApiClient = ReturnType<typeof hc<ApiType>>;

export const createAPI = (loadDB: LoadDB) =>
  new Hono<ApiEnv>()
    .use(setDB(loadDB))
    .use(requireAuthCookie)
    .onError(errorHandler)
    .get("/laps", async (c) => {
      const result = await db(c)
        .select({
          id: lap.id,
          runner: lap.runner,
          timestamp: lap.timestamp,
        })
        .from(lap)
        .innerJoin(user, eq(user.selectedRace, lap.race))
        .where(eq(user.sub, authUser(c).sub));
      return c.json(result);
    })
    .get("/races", async (c) => {
      const rows = await db(c)
        .select({ id: race.id, name: race.name })
        .from(userRace)
        .innerJoin(race, eq(race.id, userRace.race))
        .where(eq(userRace.user, authUser(c).sub));
      return c.json<RaceData[]>(rows);
    })
    .post("/races", async (c) => {
      const { name } = await c.req.json<{ name: string }>();
      if (!name?.trim())
        throw new HTTPException(400, { message: "name is required" });

      const id = crypto.randomUUID();
      await db(c).insert(race).values({ id, name });
      await db(c)
        .insert(userRace)
        .values({ user: authUser(c).sub, race: id });
      await db(c)
        .update(user)
        .set({ selectedRace: id })
        .where(eq(user.sub, authUser(c).sub));

      return c.json<RaceData>({ id, name });
    })
    .get("/races/selected", async (c) => {
      const [row] = await db(c)
        .select({ id: race.id, name: race.name })
        .from(user)
        .innerJoin(race, eq(race.id, user.selectedRace))
        .where(eq(user.sub, authUser(c).sub));

      return c.json<RaceData | null>(row ?? null);
    })
    .post("/races/:id/join", async (c) => {
      const id = c.req.param("id");
      const [found] = await db(c)
        .select({ id: race.id, name: race.name })
        .from(race)
        .where(eq(race.id, id));
      if (!found) throw new HTTPException(404, { message: "Race not found" });

      await db(c)
        .insert(userRace)
        .values({ user: authUser(c).sub, race: id })
        .onConflictDoNothing();
      await db(c)
        .update(user)
        .set({ selectedRace: id })
        .where(eq(user.sub, authUser(c).sub));

      return c.json<RaceData>(found);
    })
    .post("/runners/scan", async (c) => {
      const { data } = await c.req.json<{ data: string }>();
      if (!data?.trim())
        throw new HTTPException(400, { message: "data is required" });

      const [selected] = await db(c)
        .select({ id: race.id, name: race.name })
        .from(user)
        .innerJoin(race, eq(race.id, user.selectedRace))
        .where(eq(user.sub, authUser(c).sub));
      if (!selected)
        throw new HTTPException(400, { message: "No race selected" });

      const ref = await runnerRef(data);
      await db(c)
        .insert(runner)
        .values({ ref, info: data })
        .onConflictDoNothing();
      await db(c)
        .insert(lap)
        .values({ runner: ref, race: selected.id, timestamp: new Date() });

      const [runnerRow] = await db(c)
        .select()
        .from(runner)
        .where(eq(runner.ref, ref));
      const [{ lapCount }] = await db(c)
        .select({ lapCount: count() })
        .from(lap)
        .where(and(eq(lap.runner, ref), eq(lap.race, selected.id)));

      return c.json<ScanResult>({
        runner: runnerRow!,
        race: selected,
        lapCount,
      });
    });
