import type { RenderResult } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EmptyList from "./EmptyList";
import { renderWithRouter } from "~/testing/helpers";

describe("~/pages/apps/_components/EmptyList", () => {
  let wrapper: RenderResult;

  const createWrapper = () => {
    wrapper = renderWithRouter({
      el: () => <EmptyList actionLink="/apps/new" />,
    });
  };

  it("renders correctly", () => {
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
