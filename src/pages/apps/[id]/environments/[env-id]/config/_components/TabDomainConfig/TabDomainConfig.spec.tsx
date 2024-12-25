import type { RenderResult } from "@testing-library/react";
import { describe, expect, beforeEach, it, vi, type Mock } from "vitest";
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
  let setRefreshToken: Mock;
  let currentApp: App;
  let currentEnv: Environment;
  let domain: Domain;

  const createWrapper = ({ app, environment }: Props) => {
    setRefreshToken = vi.fn();

    wrapper = render(
      <TabDomainConfig
        app={app}
        environment={environment}
        setRefreshToken={setRefreshToken}
      />
    );
  };

  describe("with no domain", () => {
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

    it("should display a configure domain button", async () => {
      await fireEvent.click(wrapper.getByText("Add domain"));
      await waitFor(() => {
        expect(wrapper.getByText("Setup a new domain")).toBeTruthy();
      });
    });

    it("should display an informative text", () => {
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
      domain.customCert = {
        key: "my-cert-key",
        value: "my-cert-value",
      };

      const scope = mockFetchDomains({
        envId: currentEnv.id!,
        appId: currentApp.id,
        status: 200,
        response: {
          domains: [
            domain,
            { id: "2", domainName: "www.stormkit.io", verified: false },
          ],
        },
      });

      createWrapper({ app: currentApp, environment: currentEnv });

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });
    });

    it("should not display the configure domain button anymore", async () => {
      await waitFor(() => {
        expect(() => wrapper.getByText("Configure domain")).toThrow();
      });
    });

    it("should open the custom certificate modal", async () => {
      fireEvent.click(wrapper.getAllByLabelText("expand").at(0)!);
      fireEvent.click(wrapper.getByText("Custom certificate"));

      await waitFor(() => {
        expect(wrapper.getByText("Configure custom certificate")).toBeTruthy();
      });
    });

    it("should list domains", async () => {
      expect(wrapper.getByText("app.stormkit.io")).toBeTruthy();
      expect(wrapper.getByText("www.stormkit.io")).toBeTruthy();
      expect(wrapper.getByTestId("app.stormkit.io-status").textContent).toBe(
        "Status: verified·Custom certificate"
      );
      expect(wrapper.getByTestId("www.stormkit.io-status").textContent).toBe(
        "Status: needs verification"
      );
    });

    it("should allow removing a domain", async () => {
      fireEvent.click(wrapper.getAllByLabelText("expand").at(0)!);
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
