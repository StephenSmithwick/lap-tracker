import { Component } from "solid-js";
import { Router, Route, A, RouteSectionProps } from "@solidjs/router";
import { ApiClient } from "@/api";
import { QrScanner } from "@/scanner";
import { AppContext } from "@/context";
import { Laps } from "./components/Laps";
import { ShowRaceQR } from "./components/ShowRaceQR";
import { ScanRaceQR } from "./components/ScanRaceQR";

interface AppProps {
  api: ApiClient;
  scanner: QrScanner;
  url?: string;
}

const Layout: Component<RouteSectionProps> = (props) => (
  <>
    <h1>Laps</h1>
    <nav>
      <A href="/" end>
        Laps
      </A>{" "}
      | <A href="/race/qr">Show Race QR</A> |{" "}
      <A href="/race/scan">Scan Race QR</A>
    </nav>
    {props.children}
  </>
);

export const App: Component<AppProps> = (props) => {
  return (
    // eslint-disable-next-line solid/reactivity -- api/scanner don't change
    <AppContext.Provider value={{ api: props.api, scanner: props.scanner }}>
      <Router url={props.url ?? ""} root={Layout}>
        <Route path="/" component={Laps} />
        <Route path="/race/qr" component={ShowRaceQR} />
        <Route path="/race/scan" component={ScanRaceQR} />
      </Router>
    </AppContext.Provider>
  );
};

export const createApp = (props: AppProps) => <App {...props} />;
