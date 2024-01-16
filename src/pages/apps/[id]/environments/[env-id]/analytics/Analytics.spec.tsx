import { RenderResult, render } from "@testing-library/react";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";
import Analytics from "./Analytics";

interface WrapperProps {
  hasDomain?: boolean;
}

describe("~/pages/apps/[id]/environments/[env-id]/analytics/Analytics.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let currentEnvs: Environment[];

  const createWrapper = ({ hasDomain = true }: WrapperProps) => {
    currentApp = mockApp();
    currentEnvs = mockEnvironments({ app: currentApp });
    currentEnv = currentEnvs[0];

    if (!hasDomain) {
      currentEnv.domain = { verified: false };
    }

    wrapper = render(
      <EnvironmentContext.Provider value={{ environment: currentEnv }}>
        <Analytics />
      </EnvironmentContext.Provider>
    );
  };

  describe("when environment domain name is configured", () => {
    beforeEach(() => {
      createWrapper({});
    });

    test("should display correct header and subheader", () => {
      expect(wrapper.getByText("Analytics")).toBeTruthy();
      expect(
        wrapper.getByText(
          "Monitor user analytics for the specified domain within this environment configuration."
        )
      ).toBeTruthy();
    });

    test("should contain visitors section", () => {
      expect(wrapper.getByText("Visitors")).toBeTruthy();
    });

    test("should contain top referrers section", () => {
      expect(wrapper.getByText("Referrers")).toBeTruthy();
    });

    test("should contain top paths section", () => {
      expect(wrapper.getByText("Paths")).toBeTruthy();
    });

    test("should contain countries section", () => {
      expect(wrapper.getByText("Countries")).toBeTruthy();
    });
  });

  describe("when environment domain name is not configured", () => {
    beforeEach(() => {
      createWrapper({ hasDomain: false });
    });

    test("should display empty page", () => {
      expect(
        wrapper.getByText("Analytics are collected only for custom domains.")
      ).toBeTruthy();
    });

    test("should contain a link to environment's domain page", () => {
      expect(
        wrapper.getByText("Setup a custom domain").getAttribute("href")
      ).toBe(`/apps/${currentApp.id}/environments/${currentEnv.id}#domain`);
    });
  });
});
