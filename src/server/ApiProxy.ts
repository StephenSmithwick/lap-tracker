import { hc } from "hono/client";
import { ApiType, ApiContext } from "@/api";

export const createApiProxy = (api: ApiType) => {
  const serverFetch =
    (c: ApiContext): typeof fetch =>
    async (input, init) => {
      const cookie = c.req.header("cookie") ?? "";
      const requestInit: RequestInit = {
        ...init,
        cache: "no-store",
        headers: { ...init?.headers, cookie },
      };
      return api.request(input, requestInit, c.env, c.executionCtx);
    };

  return (c: ApiContext) =>
    hc<ApiType>("http://internal", { fetch: serverFetch(c) });
};
