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
import { useAuthenticator, requireAuthPage } from "@/security";

const api = createAPI(neonDB);
const apiProxy = createApiProxy(api);
const root = new Hono<{ Bindings: CloudflareBindings }>()
  .route("/", useAuthenticator(neonDB))
  .use(renderer)
  .use("/", requireAuthPage)
  .get("/", async (c: Context) =>
    c.render(
      <div id="root">
        {raw(await renderToStringAsync(() => createApp({ api: apiProxy(c) })))}
      </div>,
    ),
  )
  .route("/", api);

export default root;
