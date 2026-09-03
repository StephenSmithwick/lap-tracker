import { Component, createResource } from "solid-js";
import { ApiClient } from "@/Api";
import { renderToStringAsync } from "solid-js/web";
import { AppContext } from "@/context";

interface AppProps {
  api: ApiClient;
}

export const App: Component<AppProps> = ({ api }) => {
  return <AppContext.Provider value={{ api }}></AppContext.Provider>;
};

export const renderApp = async ({ api }: AppProps) => {
  return renderToStringAsync(() => <App api={api} />);
};
