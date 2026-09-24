import { expect, describe, it, Mock } from "vitest";
import { render, waitFor } from "@solidjs/testing-library";
import { ShowRaceQR } from "./SelectedRaceQR";
import { TestContext } from "@/test/TestContext";
import { mockJSONRequest, testRace } from "@/test/fixtures";
import { loadViews } from "@/test/Views/";

describe("SelectedRaceQR", () => {
  it("shows the QR code for the currently selected race", async () => {
    const $get: Mock = mockJSONRequest(testRace({ name: "Spring 5k" }));

    const views = loadViews(
      render(() => (
        <TestContext api={{ races: { selected: { $get } } }}>
          <ShowRaceQR />
        </TestContext>
      )),
    );

    const showRaceQr = await views.selectedRaceQr();
    await waitFor(() => expect(showRaceQr.raceName()).toBe("Spring 5k"));
    expect(showRaceQr.hasQrCode()).toBe(true);
  });

  it("lets the user know no race is selected", async () => {
    const $get: Mock = mockJSONRequest(null);

    const views = loadViews(
      render(() => (
        <TestContext api={{ races: { selected: { $get } } }}>
          <ShowRaceQR />
        </TestContext>
      )),
    );

    const showRaceQr = await views.selectedRaceQr();
    await waitFor(() =>
      expect(showRaceQr.text).toStrictEqual("No race selected."),
    );
  });
});
