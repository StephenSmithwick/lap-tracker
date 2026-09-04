/** @jsxImportSource hono/jsx */
/** @jsxRuntime automatic */
import { Hono, type Context } from "hono";
import { raw } from "hono/html";
import { createAPI } from "@/api";
import { neonDB } from "@/db/db";
import { renderer } from "./renderer";
import { renderApp } from "@/App";
import { createApiProxy } from "./ApiProxy";

const api = createAPI(neonDB);
const client = createApiProxy(api);
const root = new Hono()
  .use(renderer)
  .get("/", async (c: Context) =>
    c.render(<div id="root">{raw(await renderApp({ api: client(c) }))}</div>),
  )
  .route("/", api);

export default root;
