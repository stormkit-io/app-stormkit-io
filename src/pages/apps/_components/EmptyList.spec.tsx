import type { RenderResult } from "@testing-library/react";
import type { MemoryHistory } from "history";
import { render } from "@testing-library/react";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import EmptyList from "./EmptyList";

describe("~/pages/apps/_components/EmptyList", () => {
  let wrapper: RenderResult;
  let history: MemoryHistory;

  const createWrapper = () => {
    history = createMemoryHistory();
    wrapper = render(
      <Router location={history.location} navigator={history}>
        <EmptyList actionLink="/apps/new" />
      </Router>
    );
  };

  test("renders correctly", () => {
    createWrapper();
    expect(wrapper.getByText(/It's quite empty in here./)).toBeTruthy();
    expect(
      wrapper.getByText(/Connect your repository to get started./)
    ).toBeTruthy();

    const button1 = wrapper.getByText("Create new app");
    expect(button1.getAttribute("href")).toBe("/apps/new");

    const button2 = wrapper.getByText("Import from URL");
    expect(button2.getAttribute("href")).toBe("/apps/new/url");
  });
});
