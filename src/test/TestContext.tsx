import { Mock } from "vitest";

import { AppContext, AppContextValue } from "@/context";
import { ApiClient } from "@/api";
import { splitProps, ParentComponent } from "solid-js";
import { mockJSONRequest } from "./fixtures";

type MockedApi<T> = { [K in keyof T]?: Mock };

type ApiOverrides = {
  laps?: MockedApi<ApiClient["laps"]>;
};

type AppContextOverrides = {
  api?: ApiOverrides;
};

function testContext(overrides: AppContextOverrides): AppContextValue {
  const api = {
    laps: {
      $get: mockJSONRequest([]),
      ...overrides.api?.laps,
    },
  } as unknown as ApiClient;

  return { api };
}

export const TestContext: ParentComponent<AppContextOverrides> = (props) => {
  const [_, overrides] = splitProps(props, ["children"]);
  const context = testContext(overrides);

  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};
