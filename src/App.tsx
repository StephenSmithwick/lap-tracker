import { Component } from "solid-js";
import { Router, Route, A, RouteSectionProps } from "@solidjs/router";
import { ApiClient } from "@/api";
import { QrScanner } from "@/scanner";
import { AppContext } from "@/context";
import { Laps } from "@/components/Laps";
import { ShowRaceQR } from "@/components/SelectedRaceQR";
import { Scan } from "@/components/Scan";
import { ChooseRace } from "@/components/ChooseRace";

interface AppProps {
  api: ApiClient;
  scanner: QrScanner;
  url?: string;
}

const Layout: Component<RouteSectionProps> = (props) => (
  <>
    <main>{props.children}</main>
    <footer>
      <nav>
        <A href="/" end>
          Scan
        </A>
        <A href="/race" end>
          Summary
        </A>
        <A href="/race/qr">Share</A>
      </nav>
      <ChooseRace />
    </footer>
  </>
);

export const App: Component<AppProps> = (props) => {
  return (
    // eslint-disable-next-line solid/reactivity -- api/scanner don't change
    <AppContext.Provider value={{ api: props.api, scanner: props.scanner }}>
      <Router url={props.url ?? ""} root={Layout}>
        <Route path="/" component={Scan} />
        <Route path="/race" component={Laps} />
        <Route path="/race/qr" component={ShowRaceQR} />
      </Router>
    </AppContext.Provider>
  );
};

export const createApp = (props: AppProps) => <App {...props} />;
