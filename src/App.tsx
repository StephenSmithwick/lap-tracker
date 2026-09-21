import { Component } from "solid-js";
import { ApiClient } from "@/api";
import { AppContext } from "@/context";
import { Laps } from "./components/Laps";

interface AppProps {
  api: ApiClient;
}

export const App: Component<AppProps> = (props) => {
  return (
    // eslint-disable-next-line solid/reactivity -- api doesn't change
    <AppContext.Provider value={{ api: props.api }}>
      <h1>Laps</h1>
      <Laps />
    </AppContext.Provider>
  );
};

export const createApp = (props: AppProps) => <App {...props} />;
