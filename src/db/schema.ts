import {
  pgTable,
  uuid,
  timestamp,
  serial,
  index,
  json,
} from "drizzle-orm/pg-core";

export const runner = pgTable("runner", {
  ref: uuid("runner_ref").primaryKey(),
  info: json("info"),
});
export const lap = pgTable(
  "lap",
  {
    id: serial("id").primaryKey(),
    runner_ref: uuid("runner")
      .notNull()
      .references(() => runner.ref),
    lap: timestamp("time", { withTimezone: true }).notNull(),
  },
  (table) => [index("runner_idx").on(table.runner_ref)],
);
