import { describe, expect, it } from "vitest";
import { runnerRef } from "./runner";

describe("runnerRef", () => {
  it("is consistent for the same qr data", async () => {
    const a = await runnerRef("bib:1234");
    const b = await runnerRef("bib:1234");
    expect(a).toEqual(b);
  });

  it("differs for different qr data", async () => {
    const a = await runnerRef("bib:1234");
    const b = await runnerRef("bib:5678");
    expect(a).not.toEqual(b);
  });

  it("returns a valid uuid", async () => {
    const ref = await runnerRef("https://example.com/runner/42");
    expect(ref).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("passes an already-valid uuid through unchanged", async () => {
    const uuid = "11111111-2222-3333-4444-555555555555";
    expect(await runnerRef(uuid)).toEqual(uuid);
  });

  it("normalizes case and whitespace on a uuid", async () => {
    const uuid = "11111111-2222-3333-4444-555555555555";
    expect(await runnerRef(` ${uuid.toUpperCase()} `)).toEqual(uuid);
  });
});
