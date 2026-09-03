CREATE TABLE "lap" (
	"id" serial PRIMARY KEY,
	"runner" uuid NOT NULL,
	"time" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runner" (
	"runner" uuid PRIMARY KEY,
	"info" json
);
--> statement-breakpoint
CREATE INDEX "runner_idx" ON "lap" ("runner");--> statement-breakpoint
ALTER TABLE "lap" ADD CONSTRAINT "lap_runner_runner_runner_fkey" FOREIGN KEY ("runner") REFERENCES "runner"("runner");