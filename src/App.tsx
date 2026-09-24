import { Component } from "solid-js";
import { Router, Route, A, RouteSectionProps } from "@solidjs/router";
import { ApiClient } from "@/api";
import { QrScanner } from "@/scanner";
import { AppContext } from "@/context";
import { Laps } from "@/components/Laps";
import { ShowRaceQR } from "@/components/SelectedRaceQR";
import { ScanRaceQR } from "@/components/ScanRaceQR";
import { ScanRacerQR } from "@/components/ScanRacerQR";
import { ChooseRace } from "@/components/ChooseRace";

interface AppProps {
  api: ApiClient;
  scanner: QrScanner;
  url?: string;
}

const Layout: Component<RouteSectionProps> = (props) => (
  <>
    <nav>
      <A href="/">Scan Racer</A>
      <A href="/race/laps"> | Race Summary</A>
      <A href="/race/qr"> | Selected Race QR</A>
      <A href="/race/choose"> | Choose Race</A>
      <A href="/race/scan"> | Scan Race QR</A>
    </nav>
    {props.children}
  </>
);

export const App: Component<AppProps> = (props) => {
  return (
    // eslint-disable-next-line solid/reactivity -- api/scanner don't change
    <AppContext.Provider value={{ api: props.api, scanner: props.scanner }}>
      <Router url={props.url ?? ""} root={Layout}>
        <Route path="/" component={ScanRacerQR} />
        <Route path="/race/laps" component={Laps} />
        <Route path="/race/qr" component={ShowRaceQR} />
        <Route path="/race/scan" component={ScanRaceQR} />
        <Route path="/race/choose" component={ChooseRace} />
      </Router>
    </AppContext.Provider>
  );
};

export const createApp = (props: AppProps) => <App {...props} />;
