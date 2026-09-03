import { createContext, useContext } from "solid-js";
import type { ApiClient } from "@/Api";

export interface AppContextValue {
  api: ApiClient;
}

export const AppContext = createContext<AppContextValue>();

export function context(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("context must be used within AppContext");
  return value;
}
