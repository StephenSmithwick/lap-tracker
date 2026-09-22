import { expect, describe, it, Mock } from "vitest";
import { render, waitForElementToBeRemoved, screen } from "@solidjs/testing-library";
import { Laps } from "./Laps";
import { TestContext } from "@/test/TestContext";
import { mockJSONRequest, testLap } from "@/test/fixtures";
import { LapsView } from "@/test/LapsView";

describe("Laps", () => {
  it("renders laps returned by the api", async () => {
    const $get: Mock = mockJSONRequest([
      testLap({ runnerRef: "runner-1", timestamp: "2026-09-02T11:30:00.000Z" }),
    ]);

    const { container } = render(() => (
      <TestContext api={{ laps: { $get } }}>
        <Laps />
      </TestContext>
    ));
    const view = new LapsView(container);

    expect($get).toHaveBeenCalledExactlyOnceWith();

    await waitForElementToBeRemoved(() => screen.getByText("Loading laps..."));

    expect(view.items()).toStrictEqual([
      { runnerRef: "runner-1", timestamp: "2026-09-02T11:30:00.000Z" },
    ]);
  });
});
