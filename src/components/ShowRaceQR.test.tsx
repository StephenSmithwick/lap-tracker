import { expect, describe, it, Mock } from "vitest";
import {
  render,
  waitForElementToBeRemoved,
  screen,
  fireEvent,
} from "@solidjs/testing-library";
import { ShowRaceQR } from "./ShowRaceQR";
import { TestContext } from "@/test/TestContext";
import { mockJSONRequest, testRace } from "@/test/fixtures";

describe("ShowRaceQR", () => {
  it("shows the QR code for the currently selected race", async () => {
    const $get: Mock = mockJSONRequest(testRace({ name: "Spring 5k" }));

    render(() => (
      <TestContext api={{ races: { selected: { $get } } }}>
        <ShowRaceQR />
      </TestContext>
    ));

    await waitForElementToBeRemoved(() => screen.getByText("Loading race..."));

    expect(screen.getByRole("heading", { name: "Spring 5k" })).not.toBeNull();
    expect(document.querySelector("svg")).not.toBeNull();
  });

  it("lets the user create a race when none is selected", async () => {
    const selectedGet: Mock = mockJSONRequest(null);
    const $post: Mock = mockJSONRequest(testRace({ name: "New Race" }));

    render(() => (
      <TestContext api={{ races: { $post, selected: { $get: selectedGet } } }}>
        <ShowRaceQR />
      </TestContext>
    ));

    await waitForElementToBeRemoved(() => screen.getByText("Loading race..."));

    fireEvent.input(screen.getByPlaceholderText("Race name"), {
      target: { value: "New Race" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create race" }));

    await screen.findByRole("heading", { name: "New Race" });
    expect($post).toHaveBeenCalledExactlyOnceWith({
      json: { name: "New Race" },
    });
  });
});
