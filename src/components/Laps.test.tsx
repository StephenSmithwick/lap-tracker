import { expect, describe, it, Mock } from "vitest";
import { render } from "@solidjs/testing-library";
import { Laps } from "./Laps";
import { TestContext } from "@/test/TestContext";
import { mockJSONRequest, testLap } from "@/test/fixtures";
import { loadViews } from "@/test/Views/";

describe("Laps", () => {
  it("renders laps returned by the api", async () => {
    const $get: Mock = mockJSONRequest([
      testLap({ runner: "runner-1", timestamp: "2026-09-02T11:30:00.000Z" }),
    ]);

    const views = loadViews(
      render(() => (
        <TestContext api={{ laps: { $get } }}>
          <Laps />
        </TestContext>
      )),
    );
    const laps = await views.laps();

    expect($get).toHaveBeenCalledExactlyOnceWith();

    expect(laps.items()).toStrictEqual([
      { runner: "runner-1", timestamp: "2026-09-02T11:30:00.000Z" },
    ]);
  });
});
