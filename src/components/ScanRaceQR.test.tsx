import { expect, describe, it, vi } from "vitest";
import { render } from "@solidjs/testing-library";
import { ScanRaceQR } from "./ScanRaceQR";
import { TestContext } from "@/test/TestContext";
import { mockJSONRequest, testRace, uuid } from "@/test/fixtures";
import type { QrScanner } from "@/scanner";
import { loadViews } from "@/test/Views/";

function fakeScanner() {
  let decode: ((text: string) => void) | undefined;
  const scanner: QrScanner = {
    start: (_video, onDecode) => {
      decode = onDecode;
    },
    stop: () => {},
  };
  return { scanner, decode: (text: string) => decode!(text) };
}

describe("ScanRaceQR", () => {
  it("joins the scanned race", async () => {
    const { scanner, decode } = fakeScanner();
    const $post = mockJSONRequest(testRace({ name: "Trail Run" }));

    const views = loadViews(
      render(() => (
        <TestContext
          scanner={scanner}
          api={{ races: { ":id": { join: { $post } } } }}
        >
          <ScanRaceQR />
        </TestContext>
      )),
    );

    decode(uuid(2));

    const popup = await views.popup();
    expect($post).toHaveBeenCalledExactlyOnceWith({ param: { id: uuid(2) } });
    expect(popup.message()).toStrictEqual("Joined Trail Run");
  });

  it("shows an error for a code that isn't a known race", async () => {
    const { scanner, decode } = fakeScanner();
    const $post = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 404 }));

    const views = loadViews(
      render(() => (
        <TestContext
          scanner={scanner}
          api={{ races: { ":id": { join: { $post } } } }}
        >
          <ScanRaceQR />
        </TestContext>
      )),
    );

    decode("not-a-real-race");
    const popup = await views.popup();
    expect(popup.message()).toStrictEqual("Unable to join race, try again");
  });
});
