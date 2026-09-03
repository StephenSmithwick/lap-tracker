/** @jsxImportSource hono/jsx */
/** @jsxRuntime automatic */
import { Hono, type Context } from "hono";
import { raw } from "hono/html";
import { createAPI, ApiType } from "@/api";
import { hc } from "hono/client";
import { neonDB } from "@/db/db";
import { renderer } from "./renderer";
import { renderApp } from "@/App";

const api = createAPI(neonDB);
const client = (c: Context) =>
  hc<ApiType>("http://isServer", {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) =>
      api.request(
        input,
        {
          ...init,
          cache: "no-store",
          headers: {
            ...init?.headers,
            cookie: c.req.header("cookie") ?? "",
          },
        },
        c.env,
        c.executionCtx,
      ),
  });

const root = new Hono()
  .use(renderer)
  .get("/", async (c: Context) =>
    c.render(
      <div id="root">{raw(await renderApp({ client: client(c) }))}</div>,
    ),
  )
  .route("/", api);

export default root;
