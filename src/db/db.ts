import { ApiContext, ApiEnv } from "@/api";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePGlite } from "drizzle-orm/pglite";
import { MiddlewareHandler } from "hono";

interface ENV {
  DATABASE_URL: string;
}

export type DB = ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePGlite>;
export type LoadDB = (env?: ENV) => Promise<DB>;

export const neonDB: LoadDB = async (env) => drizzleNeon(env!.DATABASE_URL);

export const db = (c: ApiContext) => c.var.db;

export function setDB(loadDB: LoadDB): MiddlewareHandler<ApiEnv> {
  return async (c, next) => {
    c.set("db", await loadDB(c.env));
    await next();
  };
}
