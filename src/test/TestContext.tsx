import { Mock } from "vitest";

import { AppContext, AppContextValue } from "@/context";
import { ApiClient } from "@/api";
import { QrScanner, noopScanner } from "@/scanner";
import { splitProps, ParentComponent } from "solid-js";
import { mockJSONRequest } from "./fixtures";

type MockedApi<T> = { [K in keyof T]?: Mock };

type ApiOverrides = {
  laps?: MockedApi<ApiClient["laps"]>;
  races?: MockedApi<Pick<ApiClient["races"], "$post">> & {
    selected?: MockedApi<ApiClient["races"]["selected"]>;
    ":id"?: {
      join?: MockedApi<ApiClient["races"][":id"]["join"]>;
    };
  };
};

type AppContextOverrides = {
  api?: ApiOverrides;
  scanner?: QrScanner;
};

function testContext(overrides: AppContextOverrides): AppContextValue {
  const api = {
    laps: {
      $get: mockJSONRequest([]),
      ...overrides.api?.laps,
    },
    races: {
      $post: overrides.api?.races?.$post ?? mockJSONRequest(null),
      selected: {
        $get: overrides.api?.races?.selected?.$get ?? mockJSONRequest(null),
      },
      ":id": {
        join: {
          $post:
            overrides.api?.races?.[":id"]?.join?.$post ??
            mockJSONRequest(null),
        },
      },
    },
  } as unknown as ApiClient;

  return { api, scanner: overrides.scanner ?? noopScanner };
}

export const TestContext: ParentComponent<AppContextOverrides> = (props) => {
  const [_, overrides] = splitProps(props, ["children"]);
  const context = testContext(overrides);

  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};
