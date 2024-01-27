import { render, RenderResult } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import mockApp from "~/testing/data/mock_app";
import AppName from "./AppName";

interface Props {
  app?: App;
  withDisplayName?: boolean;
  withLinkToRepo?: boolean;
}

describe("~/components/AppName/AppName.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = ({
    app = mockApp(),
    withDisplayName,
    withLinkToRepo,
  }: Props) => {
    wrapper = render(
      <MemoryRouter>
        <AppName
          repo={app.repo}
          displayName={app.displayName}
          withLinkToRepo={withLinkToRepo}
        />
      </MemoryRouter>
    );
  };

  test("should display the app name without the display name", () => {
    createWrapper({ withDisplayName: false });
    expect(wrapper.getByText("stormkit-io/frontend")).toBeTruthy();
    expect(() => wrapper.getByText("app")).toThrow();
  });

  test("should display the app name with the display name", () => {
    createWrapper({ withDisplayName: true });
    expect(wrapper.getByText("stormkit-io/frontend")).toBeTruthy();
    expect(wrapper.getByText("app")).toBeTruthy();
  });

  test("should contain a link to the repo", () => {
    createWrapper({ withLinkToRepo: true });
    const component = wrapper.getByLabelText("Repository URL");

    expect(component.getAttribute("href")).toBe(
      "https://gitlab.com/stormkit-io/frontend"
    );

    expect(component.textContent).toBe("stormkit-io/frontend");
  });

  test("should contain a link to the repo", () => {
    createWrapper({ withLinkToRepo: false });
    expect(wrapper.getByText("stormkit-io/frontend").getAttribute("href")).toBe(
      null
    );
  });
});
