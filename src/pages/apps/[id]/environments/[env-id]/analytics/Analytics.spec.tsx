import { RenderResult, render, waitFor } from "@testing-library/react";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { MemoryRouter } from "react-router";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";
import { mockFetchDomains } from "~/testing/nocks/nock_domains";
import Analytics from "./Analytics";

jest.mock("recharts", () => ({
  YAxis: jest.fn(),
  AreaChart: jest.fn(),
  Area: jest.fn(),
  Tooltip: jest.fn(),
  CartesianGrid: jest.fn(),
  ResponsiveContainer: ({ children }: { children: any }) => (
    <div>{children}</div>
  ),
}));

interface WrapperProps {
  hasDomain?: boolean;
  selectedDomainName?: string;
}

describe("~/pages/apps/[id]/environments/[env-id]/analytics/Analytics.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let currentEnvs: Environment[];

  const createWrapper = async ({
    hasDomain = true,
    selectedDomainName = "",
  }: WrapperProps) => {
    currentApp = mockApp();
    currentEnvs = mockEnvironments({ app: currentApp });
    currentEnv = currentEnvs[0];

    const scope = mockFetchDomains({
      envId: currentEnv.id!,
      appId: currentApp.id!,
      status: 200,
      verified: true,
      response: {
        domains: hasDomain
          ? [
              { domainName: "www.stormkit.io", verified: true, id: "15" },
              { domainName: "app.stormkit.io", verified: true, id: "50" },
            ]
          : [],
      },
    });

    wrapper = render(
      <EnvironmentContext.Provider value={{ environment: currentEnv }}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/", search: `domain=${selectedDomainName}` },
          ]}
          initialIndex={0}
        >
          <Analytics />
        </MemoryRouter>
      </EnvironmentContext.Provider>
    );

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
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

    test("should have the initial domain selected", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("www.stormkit.io")).toBeTruthy();
      });
    });
  });

  describe("with a pre-selected domain", () => {
    beforeEach(async () => {
      await createWrapper({
        hasDomain: true,
        selectedDomainName: "app.stormkit.io",
      });
    });

    test("should have that domain selected", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("app.stormkit.io")).toBeTruthy();
      });
    });
  });

  describe("when environment domain name is not configured", () => {
    beforeEach(async () => {
      await createWrapper({ hasDomain: false });
    });

    test("should display empty page", async () => {
      await waitFor(() => {
        expect(
          wrapper.getByText("Analytics are collected only for custom domains.")
        ).toBeTruthy();
      });
    });

    test("should contain a link to environment's domain page", async () => {
      await waitFor(() => {
        expect(
          wrapper.getByText("Setup a custom domain").getAttribute("href")
        ).toBe(`/apps/${currentApp.id}/environments/${currentEnv.id}#domains`);
      });
    });
  });
});
