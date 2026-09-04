import {
  pgTable,
  uuid,
  timestamp,
  serial,
  index,
  json,
  text,
} from "drizzle-orm/pg-core";

export const group = pgTable("group", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});
export const runner = pgTable("runner", {
  ref: uuid("ref").primaryKey(),
  info: json("info"),
  groupId: uuid("group_id")
    .notNull()
    .references(() => group.id),
});
export const lap = pgTable(
  "lap",
  {
    id: serial("id").primaryKey(),
    runnerRef: uuid("runner_ref")
      .notNull()
      .references(() => runner.ref),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  },
  (table) => [index("runner_ref_idx").on(table.runnerRef)],
);
