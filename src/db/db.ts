import { ApiContext, ApiEnv } from "@/api";
import { drizzle } from "drizzle-orm/neon-http";
import { MiddlewareHandler } from "hono";
interface ENV {
  DATABASE_URL: string;
}

export type DB = ReturnType<typeof createNeonDB>;
export type LoadDB = (env?: ENV) => Promise<DB>;

const createNeonDB = (url: string) => drizzle(url);
export const neonDB: LoadDB = async (env) => createNeonDB(env!.DATABASE_URL);

export const db = (c: ApiContext) => c.var.db;

export function setDB(loadDB: LoadDB): MiddlewareHandler<ApiEnv> {
  return async (c: any, next) => {
    c.set("db", await loadDB(c.env));
    await next();
  };
}
