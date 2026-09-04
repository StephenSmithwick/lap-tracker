import { Hono, MiddlewareHandler } from "hono";
import { hc } from "hono/client";
import { LoadDB, DB, setDB, db } from "@/db/db";
import { lap } from "@/db/schema";
import { Context } from "hono";
import { errorHandler } from "./errors";

export type ApiEnv = {
  Variables: {
    db: DB;
  };
};

export type ApiContext = Context<ApiEnv>;
export type ApiType = ReturnType<typeof createAPI>;
export type ApiClient = ReturnType<typeof hc<ApiType>>;

export const createAPI = (loadDB: LoadDB) =>
  new Hono<ApiEnv>()
    .use(setDB(loadDB))
    .onError(errorHandler)
    .get("/laps", async (c) => {
      const result = await db(c).select().from(lap);

      return c.json(result);
    });
