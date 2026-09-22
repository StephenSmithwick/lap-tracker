import {
  pgTable,
  uuid,
  timestamp,
  serial,
  index,
  json,
  text,
  primaryKey,
} from "drizzle-orm/pg-core";

export const race = pgTable("race", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});
export const runner = pgTable("runner", {
  ref: uuid("ref").primaryKey(),
  info: json("info"),
});
export const lap = pgTable(
  "lap",
  {
    id: serial("id").primaryKey(),
    runner: uuid("runner_ref")
      .notNull()
      .references(() => runner.ref),
    race: uuid("race_id")
      .notNull()
      .references(() => race.id),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  },
  (table) => [index("runner_ref_idx").on(table.runner)],
);

export const user = pgTable("user", {
  sub: text("sub").primaryKey(),
  name: text("name").notNull(),
  selectedRace: uuid("selected_race_id").references(() => race.id, {
    onDelete: "set null",
  }),
});

export const userRace = pgTable(
  "user_group",
  {
    user: text("user_sub")
      .notNull()
      .references(() => user.sub, { onDelete: "cascade" }),
    race: uuid("race_id")
      .notNull()
      .references(() => race.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.user, table.race] })],
);
