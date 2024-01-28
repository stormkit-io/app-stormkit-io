import { render, RenderResult } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import mockApp from "~/testing/data/mock_app";
import AppName from "./AppName";

interface Props {
  displayName?: string;
  withLinkToRepo?: boolean;
}

describe("~/components/AppName/AppName.tsx", () => {
  let wrapper: RenderResult;
  let app: App;

  const createWrapper = ({ displayName, withLinkToRepo }: Props) => {
    wrapper = render(
      <MemoryRouter>
        <AppName
          repo={app.repo}
          displayName={displayName}
          withLinkToRepo={withLinkToRepo}
        />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    app = mockApp();
  });

  test("should display the app name without the display name", () => {
    createWrapper({});
    expect(wrapper.getByText("stormkit-io/frontend")).toBeTruthy();
    expect(() => wrapper.getByText("app")).toThrow();
  });

  test("should display the app name with the display name", () => {
    createWrapper({ displayName: app.displayName });
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
