import { expect, describe, it, vi } from "vitest";
import { render, waitFor } from "@solidjs/testing-library";
import { loadViews } from "@/test/Views/";
import { CreateRace } from "./CreateRace";
import { TestRouter } from "@/test/TestRouter";

describe("CreateRace", () => {
  it("lets the user create a race", async () => {
    const $post = vi.fn(() => {});

    const views = loadViews(
      render(() => (
        <TestRouter api={{ races: { $post } }}>
          <CreateRace />
        </TestRouter>
      )),
    );

    const createRace = await views.createRace();
    createRace.setName("New Race");
    createRace.submit();
    expect($post).toHaveBeenCalledExactlyOnceWith({
      json: { name: "New Race" },
    });
  });

  it("shows an error when creating a race fails", async () => {
    const $post = vi.fn().mockRejectedValue({
      response: {
        status: 500,
        data: { message: "Server error" },
      },
    });

    const views = loadViews(
      render(() => (
        <TestRouter api={{ races: { $post } }}>
          <CreateRace />
        </TestRouter>
      )),
    );

    const createRace = await views.createRace();
    createRace.setName("New Race");
    createRace.submit();

    await waitFor(() =>
      expect(createRace.alert).toEqual("Failed to create race"),
    );
  });
});
