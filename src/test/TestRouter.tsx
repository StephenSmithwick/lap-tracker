import { ParentComponent, splitProps } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { AppContextOverrides, TestContext } from "./TestContext";

interface TestAppProps extends AppContextOverrides {
  url?: string;
}

export const TestRouter: ParentComponent<TestAppProps> = (props) => {
  const [routerProps, contextProps] = splitProps(props, ["url", "children"]);
  return (
    <TestContext {...contextProps}>
      <Router url={routerProps.url ?? ""}>
        <Route path="*" component={() => routerProps.children} />
      </Router>
    </TestContext>
  );
};
