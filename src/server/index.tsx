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
import { noopScanner } from "@/scanner";

const api = createAPI(neonDB);
const apiProxy = createApiProxy(api);
const renderPage = async (c: Context) =>
  c.render(
    <div id="root">
      {raw(
        await renderToStringAsync(() =>
          createApp({
            api: apiProxy(c),
            scanner: noopScanner,
            url: c.req.path,
          }),
        ),
      )}
    </div>,
  );

// Each client-side route needs its own explicit registration here, scoped to
// its exact path, so it's handled (and auth-guarded) before falling through
// to `.route("/", api)` below. A wildcard "*" would also match API paths
// like /laps and /races, since Hono applies a mounted sub-app's pathless
// `.use()` middleware across the whole parent router, not just its own
// routes.
const root = new Hono<{ Bindings: CloudflareBindings }>()
  .route("/", useAuthenticator(neonDB))
  .use(renderer)
  .use("/", requireAuthPage)
  .get("/", renderPage)
  .use("/race/laps", requireAuthPage)
  .get("/race/laps", renderPage)
  .use("/race/qr", requireAuthPage)
  .get("/race/qr", renderPage)
  .use("/race/scan", requireAuthPage)
  .get("/race/scan", renderPage)
  .use("/race/create", requireAuthPage)
  .get("/race/create", renderPage)
  .route("/", api);

export default root;
