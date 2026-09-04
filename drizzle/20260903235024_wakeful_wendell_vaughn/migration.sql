CREATE TABLE "group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lap" (
	"id" serial PRIMARY KEY,
	"runner_ref" uuid NOT NULL,
	"timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runner" (
	"ref" uuid PRIMARY KEY,
	"info" json,
	"group_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX "runner_ref_idx" ON "lap" ("runner_ref");--> statement-breakpoint
ALTER TABLE "lap" ADD CONSTRAINT "lap_runner_ref_runner_ref_fkey" FOREIGN KEY ("runner_ref") REFERENCES "runner"("ref");--> statement-breakpoint
ALTER TABLE "runner" ADD CONSTRAINT "runner_group_id_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id");