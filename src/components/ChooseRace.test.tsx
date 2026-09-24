import { expect, describe, it, vi } from "vitest";
import { render, waitFor } from "@solidjs/testing-library";
import { ChooseRace } from "./ChooseRace";
import { TestRouter } from "@/test/TestRouter";
import { mockJSONRequest, testRace, uuid } from "@/test/fixtures";
import { loadViews } from "@/test/Views/";

describe("ChooseRace", () => {
  it("lets the user pick a race they already belong to", async () => {
    const $get = mockJSONRequest([
      testRace({ id: uuid(1), name: "Spring 5k" }),
      testRace({ id: uuid(2), name: "Trail Run" }),
    ]);
    const join$post = vi.fn(() => {});

    const views = loadViews(
      render(() => (
        <TestRouter api={{ races: { $get, ":id": { join: { $post: join$post } } } }}>
          <ChooseRace />
        </TestRouter>
      )),
    );

    const chooseRace = await views.chooseRace();
    chooseRace.open();
    await waitFor(() =>
      expect(chooseRace.options()).toStrictEqual(["Spring 5k", "Trail Run"]),
    );
    chooseRace.choose("Trail Run");

    expect(join$post).toHaveBeenCalledExactlyOnceWith({
      param: { id: uuid(2) },
    });
  });

  it("creates a new race when the typed name has no matching option", async () => {
    const $get = mockJSONRequest([testRace({ name: "Spring 5k" })]);
    const $post = vi.fn(() => {});

    const views = loadViews(
      render(() => (
        <TestRouter api={{ races: { $get, $post } }}>
          <ChooseRace />
        </TestRouter>
      )),
    );

    const chooseRace = await views.chooseRace();
    chooseRace.open();
    await waitFor(() => expect(chooseRace.options()).not.toHaveLength(0));
    chooseRace.search("Fall 10k");
    await waitFor(() =>
      expect(chooseRace.options()).toContain("Create Fall 10k"),
    );
    chooseRace.choose("Create Fall 10k");

    expect($post).toHaveBeenCalledExactlyOnceWith({
      json: { name: "Fall 10k" },
    });
  });

  it("shows an error when selecting a race fails", async () => {
    const $get = mockJSONRequest([testRace({ name: "Spring 5k" })]);
    const join$post = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 500 }));

    const views = loadViews(
      render(() => (
        <TestRouter api={{ races: { $get, ":id": { join: { $post: join$post } } } }}>
          <ChooseRace />
        </TestRouter>
      )),
    );

    const chooseRace = await views.chooseRace();
    chooseRace.open();
    await waitFor(() => expect(chooseRace.options()).not.toHaveLength(0));
    chooseRace.choose("Spring 5k");

    await waitFor(() =>
      expect(chooseRace.alert).toStrictEqual("Failed to select race"),
    );
  });
});
