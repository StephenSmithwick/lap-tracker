import { Component } from "solid-js";
import { ApiClient } from "@/api";
import { AppContext } from "@/context";
import { Laps } from "./components/Laps";

interface AppProps {
  api: ApiClient;
}

export const App: Component<AppProps> = ({ api }) => {
  return (
    <AppContext.Provider value={{ api }}>
      <h1>Laps</h1>
      <Laps />
    </AppContext.Provider>
  );
};

export const createApp = (props: AppProps) => <App {...props} />;
