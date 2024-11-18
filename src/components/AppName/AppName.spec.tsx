import { render, RenderResult } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import mockApp from "~/testing/data/mock_app";
import AppName from "./AppName";

interface Props {
  app: App;
}

describe("~/components/AppName/AppName.tsx", () => {
  let wrapper: RenderResult;
  let app: App;

  const createWrapper = ({ app }: Props) => {
    wrapper = render(
      <MemoryRouter>
        <AppName app={app} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    app = mockApp();
  });

  test("should not have stormkit logo when app is the stormkit ui", () => {
    createWrapper({ app });
    expect(() => wrapper.getByTestId("app-logo")).toThrow();
  });

  test("should display the app name with the display name and repo", () => {
    createWrapper({ app });

    expect(wrapper.getByText("app")).toBeTruthy();
    expect(wrapper.getByText("app").getAttribute("href")).toBe(
      `/apps/${app.id}/environments`
    );

    expect(wrapper.getByText("stormkit-io/frontend")).toBeTruthy();
    expect(wrapper.getByText("stormkit-io/frontend").getAttribute("href")).toBe(
      "https://gitlab.com/stormkit-io/frontend"
    );
  });
});
