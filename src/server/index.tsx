/** @jsxImportSource hono/jsx */
/** @jsxRuntime automatic */
import { Hono, type Context } from "hono";
import { raw } from "hono/html";
import { createAPI } from "@/api";
import { neonDB } from "@/db/db";
import { renderer } from "./renderer";
import { createApp } from "@/App";
import { createApiProxy } from "./ApiProxy";
import { renderToStringAsync } from "solid-js/web";

const api = createAPI(neonDB);
const apiClient = createApiProxy(api);
const root = new Hono()
  .use(renderer)
  .get("/", async (c: Context) =>
    c.render(
      <div id="root">
        {raw(await renderToStringAsync(() => createApp({ api: apiClient(c) })))}
      </div>,
    ),
  )
  .route("/", api);

export default root;
