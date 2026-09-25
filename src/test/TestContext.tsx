import { Mock } from "vitest";

import { AppContext, AppContextValue } from "@/context";
import { ApiClient } from "@/api";
import { QrScanner, noopScanner } from "@/scanner";
import {
  Accessor,
  createSignal,
  Show,
  splitProps,
  ParentComponent,
} from "solid-js";
import { mockJSONRequest } from "./fixtures";
import { Popup, PopupParams } from "@/components/Popup";

type MockedApi<T> = { [K in keyof T]?: Mock };

type ApiOverrides = {
  laps?: MockedApi<ApiClient["laps"]>;
  races?: MockedApi<Pick<ApiClient["races"], "$get" | "$post">> & {
    selected?: MockedApi<ApiClient["races"]["selected"]>;
    ":id"?: MockedApi<Pick<ApiClient["races"][":id"], "$get">> & {
      join?: MockedApi<ApiClient["races"][":id"]["join"]>;
    };
  };
  runners?: {
    scan?: MockedApi<ApiClient["runners"]["scan"]>;
  };
};

export type AppContextOverrides = {
  api?: ApiOverrides;
  scanner?: QrScanner;
  popup?: {
    set: (message?: PopupParams) => void;
  };
};

function testContext(
  overrides: AppContextOverrides,
): [AppContextValue, Accessor<PopupParams | undefined>] {
  const api = {
    laps: {
      $get: mockJSONRequest([]),
      ...overrides.api?.laps,
    },
    races: {
      $get: overrides.api?.races?.$get ?? mockJSONRequest([]),
      $post: overrides.api?.races?.$post ?? mockJSONRequest(null),
      selected: {
        $get: overrides.api?.races?.selected?.$get ?? mockJSONRequest(null),
      },
      ":id": {
        $get: overrides.api?.races?.[":id"]?.$get ?? mockJSONRequest(null),
        join: {
          $post:
            overrides.api?.races?.[":id"]?.join?.$post ?? mockJSONRequest(null),
        },
      },
    },
    runners: {
      scan: {
        $post: overrides.api?.runners?.scan?.$post ?? mockJSONRequest(null),
      },
    },
  } as unknown as ApiClient;

  const [getPopup, setPopup] = createSignal<PopupParams>();
  const popup = {
    set: (message?: PopupParams) => setPopup(message),
  };

  return [{ api, scanner: overrides.scanner ?? noopScanner, popup }, getPopup];
}

export const TestContext: ParentComponent<AppContextOverrides> = (props) => {
  const [_, overrides] = splitProps(props, ["children"]);
  const [context, popup] = testContext(overrides);

  return (
    <AppContext.Provider value={context}>
      {props.children}
      <Show when={popup()}>{(message) => <Popup {...message()} />}</Show>
    </AppContext.Provider>
  );
};
