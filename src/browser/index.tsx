import { App } from "@/App";
import { hydrate } from "solid-js/web";
import { ApiType } from "@/api";
import { hc } from "hono/client";

const client = hc<ApiType>(window.location?.origin ?? "");

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}

hydrate(() => <App client={client} />, document.getElementById("root")!);
