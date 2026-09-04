import { Component, createResource } from "solid-js";
import { ApiClient } from "@/Api";
import { renderToStringAsync } from "solid-js/web";
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

export const renderApp = async ({ api }: AppProps) => {
  return renderToStringAsync(() => <App api={api} />);
};
