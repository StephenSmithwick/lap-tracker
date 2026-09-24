import { expect, describe, it, vi } from "vitest";
import { render } from "@solidjs/testing-library";
import { ScanRacerQR } from "./ScanRacerQR";
import { TestContext } from "@/test/TestContext";
import { mockJSONRequest, testScanResult } from "@/test/fixtures";
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

describe("ScanRacerQR", () => {
  it("records a lap for the scanned racer", async () => {
    const { scanner, decode } = fakeScanner();
    const $post = mockJSONRequest(
      testScanResult({
        lapCount: 3,
        runner: { ref: "runner-1", info: "Bib 42" },
      }),
    );

    const views = loadViews(
      render(() => (
        <TestContext scanner={scanner} api={{ runners: { scan: { $post } } }}>
          <ScanRacerQR />
        </TestContext>
      )),
    );

    decode("Bib 42");

    const popup = await views.popup();
    expect($post).toHaveBeenCalledExactlyOnceWith({
      json: { data: "Bib 42" },
    });
    expect(popup.message()).toStrictEqual("Lap 3 - Bib 42");
  });

  it("labels the runner by name when the scanned data is a json object", async () => {
    const { scanner, decode } = fakeScanner();
    const $post = mockJSONRequest(
      testScanResult({
        lapCount: 1,
        runner: { ref: "runner-1", info: { name: "Jamie" } },
      }),
    );

    const views = loadViews(
      render(() => (
        <TestContext scanner={scanner} api={{ runners: { scan: { $post } } }}>
          <ScanRacerQR />
        </TestContext>
      )),
    );

    decode('{"name":"Jamie"}');
    const popup = await views.popup();
    expect(popup.message()).toStrictEqual("Lap 1 - Jamie");
  });

  it("shows an error when the scan can't be recorded", async () => {
    const { scanner, decode } = fakeScanner();
    const $post = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 400 }));

    const views = loadViews(
      render(() => (
        <TestContext scanner={scanner} api={{ runners: { scan: { $post } } }}>
          <ScanRacerQR />
        </TestContext>
      )),
    );

    decode("Bib 42");
    const popup = await views.popup();
    expect(popup.message()).toStrictEqual("Unable to record lap, try again");
  });
});
