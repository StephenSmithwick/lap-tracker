import { Hono } from "hono";
import { hc } from "hono/client";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { LoadDB, DB, setDB, db } from "@/db/db";
import { lap, race, user, userRace } from "@/db/schema";
import { Context } from "hono";
import { errorHandler } from "./errors";
import { requireAuthCookie, authUser } from "./security";

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
    });
