CREATE TABLE "lap" (
	"id" serial PRIMARY KEY,
	"runner_ref" uuid NOT NULL,
	"race_id" uuid NOT NULL,
	"timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "race" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runner" (
	"ref" uuid PRIMARY KEY,
	"info" json
);
--> statement-breakpoint
CREATE TABLE "user" (
	"sub" text PRIMARY KEY,
	"name" text NOT NULL,
	"selected_race_id" uuid
);
--> statement-breakpoint
CREATE TABLE "user_race" (
	"user_sub" text,
	"race_id" uuid,
	CONSTRAINT "user_race_pkey" PRIMARY KEY("user_sub","race_id")
);
--> statement-breakpoint
CREATE INDEX "runner_ref_idx" ON "lap" ("runner_ref");--> statement-breakpoint
ALTER TABLE "lap" ADD CONSTRAINT "lap_runner_ref_runner_ref_fkey" FOREIGN KEY ("runner_ref") REFERENCES "runner"("ref");--> statement-breakpoint
ALTER TABLE "lap" ADD CONSTRAINT "lap_race_id_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_selected_race_id_race_id_fkey" FOREIGN KEY ("selected_race_id") REFERENCES "race"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "user_race" ADD CONSTRAINT "user_race_user_sub_user_sub_fkey" FOREIGN KEY ("user_sub") REFERENCES "user"("sub") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_race" ADD CONSTRAINT "user_race_race_id_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE CASCADE;
