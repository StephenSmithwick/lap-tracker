import { expect, describe, it, vi } from "vitest";
import { render, waitFor } from "@solidjs/testing-library";
import { ChooseRace } from "./ChooseRace";
import { TestContext } from "@/test/TestContext";
import { jsonResponse, mockJSONRequest, testRace, uuid } from "@/test/fixtures";
import { loadViews } from "@/test/Views/";

describe("ChooseRace", () => {
  it("doesn't default to '+ New race...' while races are still loading", async () => {
    let resolveRaces!: (res: Response) => void;
    const $get = vi.fn(
      () => new Promise<Response>((resolve) => (resolveRaces = resolve)),
    );

    const views = loadViews(
      render(() => (
        <TestContext api={{ races: { $get } }}>
          <ChooseRace />
        </TestContext>
      )),
    );

    const chooseRace = await views.chooseRace();
    // races() hasn't resolved yet - the select must not default to
    // "+ New race..." here, since that selection wouldn't reset once
    // races load in.
    expect(chooseRace.selectedValue).not.toStrictEqual("new");

    resolveRaces(jsonResponse([testRace({ id: uuid(1), name: "Spring 5k" })]));
    await waitFor(() => expect(chooseRace.options()).toContain("Spring 5k"));
    expect(chooseRace.selectedValue).not.toStrictEqual("new");
  });

  it("shows the currently selected race as the initial value", async () => {
    const $get = mockJSONRequest([
      testRace({ id: uuid(1), name: "Spring 5k" }),
    ]);
    const selected$get = mockJSONRequest(
      testRace({ id: uuid(1), name: "Spring 5k" }),
    );

    const views = loadViews(
      render(() => (
        <TestContext
          api={{ races: { $get, selected: { $get: selected$get } } }}
        >
          <ChooseRace />
        </TestContext>
      )),
    );

    const chooseRace = await views.chooseRace();
    await waitFor(() =>
      expect(chooseRace.selectedValue).toStrictEqual("Spring 5k"),
    );
  });

  it("lets the user pick a race they already belong to", async () => {
    const $get = mockJSONRequest([
      testRace({ id: uuid(1), name: "Spring 5k" }),
      testRace({ id: uuid(2), name: "Trail Run" }),
    ]);
    const join$post = mockJSONRequest(
      testRace({ id: uuid(2), name: "Trail Run" }),
    );

    const views = loadViews(
      render(() => (
        <TestContext
          api={{ races: { $get, ":id": { join: { $post: join$post } } } }}
        >
          <ChooseRace />
        </TestContext>
      )),
    );

    const chooseRace = await views.chooseRace();
    await waitFor(() => expect(chooseRace.options()).toContain("Trail Run"));
    chooseRace.choose("Trail Run");

    expect(join$post).toHaveBeenCalledExactlyOnceWith({
      param: { id: uuid(2) },
    });
  });

  it("switches to an inline text field to create a new race", async () => {
    const $get = mockJSONRequest([testRace({ name: "Spring 5k" })]);
    const $post = mockJSONRequest(testRace({ id: uuid(9), name: "Fall 10k" }));

    const views = loadViews(
      render(() => (
        <TestContext api={{ races: { $get, $post } }}>
          <ChooseRace />
        </TestContext>
      )),
    );

    const chooseRace = await views.chooseRace();
    await waitFor(() => expect(chooseRace.options()).toContain("new"));
    chooseRace.choose("new");

    const createRace = await views.createRace();
    createRace.setName("Fall 10k");
    createRace.submit();

    expect($post).toHaveBeenCalledExactlyOnceWith({
      json: { name: "Fall 10k" },
    });
    await waitFor(() => expect(chooseRace.isCreating).toBe(false));
  });

  it("returns to the select when creating is cancelled", async () => {
    const $get = mockJSONRequest([testRace({ name: "Spring 5k" })]);

    const views = loadViews(
      render(() => (
        <TestContext api={{ races: { $get } }}>
          <ChooseRace />
        </TestContext>
      )),
    );

    const chooseRace = await views.chooseRace();
    await waitFor(() => expect(chooseRace.options()).toContain("new"));
    chooseRace.choose("new");

    const createRace = await views.createRace();
    createRace.cancel();
    expect(chooseRace.isCreating).toBe(false);
  });

  it("shows an error when selecting a race fails", async () => {
    const $get = mockJSONRequest([testRace({ name: "Spring 5k" })]);
    const join$post = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 500 }));

    const views = loadViews(
      render(() => (
        <TestContext
          api={{ races: { $get, ":id": { join: { $post: join$post } } } }}
        >
          <ChooseRace />
        </TestContext>
      )),
    );

    const chooseRace = await views.chooseRace();
    await waitFor(() => expect(chooseRace.options()).toContain("Spring 5k"));
    chooseRace.choose("Spring 5k");

    await waitFor(() =>
      expect(chooseRace.alert).toStrictEqual("Failed to select race"),
    );
  });
});
