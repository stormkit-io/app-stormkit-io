import type { RenderResult } from "@testing-library/react";
import { render } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router";
import EmptyList from "./EmptyList";

describe("~/pages/apps/_components/EmptyList", () => {
  let wrapper: RenderResult;

  const createWrapper = () => {
    const memoryRouter = createMemoryRouter([
      { path: "*", element: <EmptyList actionLink="/apps/new" /> },
    ]);

    wrapper = render(<RouterProvider router={memoryRouter} />);
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
