import { Hono } from "hono";
import { hc } from "hono/client";
import { eq } from "drizzle-orm";
import { LoadDB, DB, setDB, db } from "@/db/db";
import { lap, runner, user, userRace } from "@/db/schema";
import { Context } from "hono";
import { errorHandler } from "./errors";
import { requireAuthCookie, authUser } from "./security";

export type ApiEnv = {
  Bindings: CloudflareBindings;
  Variables: {
    db: DB;
  };
};

type LapRow = typeof lap.$inferSelect;
export interface LapData extends Omit<LapRow, "timestamp"> {
  timestamp: string;
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
          runnerRef: lap.runner,
          timestamp: lap.timestamp,
        })
        .from(lap)
        .innerJoin(user, eq(user.selectedRace, lap.race))
        .where(eq(user.sub, authUser(c).sub));
      return c.json(result);
    });
