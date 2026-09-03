import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { hc } from "hono/client";
import { LoadDB, DB } from "@/db/db";
import { lap } from "@/db/schema";
import { NeonDbError } from "@neondatabase/serverless";
import { Context } from "hono";

type ApiEnv = {
  Variables: {
    db: DB;
  };
};
export type ApiContext = Context<ApiEnv>;
const db = (c: ApiContext) => c.var.db;

export const createAPI = (loadDB: LoadDB) =>
  new Hono<{
    Variables: { db: DB };
  }>()
    .use(async (c: any, next) => {
      c.set("db", await loadDB(c.env));
      await next();
    })
    .onError((err, c) => {
      if (err instanceof HTTPException) {
        return err.getResponse();
      } else if (err instanceof NeonDbError) {
        console.error("Database query failed:", err);
        return c.json({ message: "Failed to connect to database" }, 500);
      }
      console.error(err);
      return c.text("Internal Server Error", 500);
    })
    .get("/laps", async (c) => {
      const result = await db(c).select().from(lap);

      return c.json(result);
    });

export type ApiType = ReturnType<typeof createAPI>;
export type ApiClient = ReturnType<typeof hc<ApiType>>;
