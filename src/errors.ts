import { ErrorHandler } from "hono";
import { ApiEnv } from "./Api";
import { HTTPException } from "hono/http-exception";
import { NeonDbError } from "@neondatabase/serverless";

export const errorHandler: ErrorHandler<ApiEnv> = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  } else if (err instanceof NeonDbError) {
    console.error("Database query failed:", err);
    return c.json({ message: "Failed to connect to database" }, 500);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
