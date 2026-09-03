import { drizzle } from "drizzle-orm/neon-http";
interface ENV {
  DATABASE_URL: string;
}

export type DB = ReturnType<typeof drizzle>;
export type LoadDB = (env?: { DATABASE_URL: string }) => Promise<DB>;
export const neonDB: LoadDB = async (env?: ENV) => {
  return drizzle(env!.DATABASE_URL);
};
