import type { RenderResult } from "@testing-library/react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import mockDomain from "~/testing/data/mock_domain";
import {
  mockDeleteDomain,
  mockFetchDomains,
} from "~/testing/nocks/nock_domains";
import TabDomainConfig from "./TabDomainConfig";

interface Props {
  app: App;
  environment: Environment;
}

describe("~/pages/apps/[id]/environments/[env-id]/config/_components/TabDomainConfig/TabDomainConfig.tsx", () => {
  let wrapper: RenderResult;
  let setRefreshToken: jest.Mock;
  let currentApp: App;
  let currentEnv: Environment;
  let domain: Domain;

  const createWrapper = ({ app, environment }: Props) => {
    setRefreshToken = jest.fn();

    wrapper = render(
      <TabDomainConfig
        app={app}
        environment={environment}
        setRefreshToken={setRefreshToken}
      />
    );
  };

  describe.skip("with no domain", () => {
    beforeEach(async () => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });

      const scope = mockFetchDomains({
        envId: currentEnv.id!,
        appId: currentApp.id,
        status: 200,
        response: { domains: [] },
      });

      createWrapper({ app: currentApp, environment: currentEnv });

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });
    });

    test("should display a configure domain button", async () => {
      await fireEvent.click(wrapper.getByText("Configure domain"));
      await waitFor(() => {
        expect(wrapper.getByText("Setup a new domain")).toBeTruthy();
      });
    });

    test("should display an informative text", () => {
      expect(
        wrapper.getByText("No custom domain configuration found.")
      ).toBeTruthy();
      expect(
        wrapper.getByText("Add a domain to serve your app directly from it.")
      ).toBeTruthy();
    });
  });

  describe("with domain", () => {
    beforeEach(async () => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      domain = mockDomain();

      const scope = mockFetchDomains({
        envId: currentEnv.id!,
        appId: currentApp.id,
        status: 200,
        response: { domains: [domain] },
      });

      createWrapper({ app: currentApp, environment: currentEnv });

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });
    });

    test("should not display the configure domain buttony anymore", async () => {
      await waitFor(() => {
        expect(() => wrapper.getByText("Configure domain")).toThrow();
      });
    });

    test("should allow removing a domain", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("app.stormkit.io")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByLabelText("expand"));

      fireEvent.click(wrapper.getByText("Delete"));

      const scope = mockDeleteDomain({
        appId: currentApp.id,
        envId: currentEnv.id!,
        domainId: domain.id,
        response: { ok: true },
      });

      await waitFor(() => {
        expect(wrapper.getByText("Yes, continue")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("Yes, continue"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });
    });
  });
});
