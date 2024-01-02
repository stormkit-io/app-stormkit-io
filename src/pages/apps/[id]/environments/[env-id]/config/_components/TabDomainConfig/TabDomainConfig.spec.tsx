import type { RenderResult } from "@testing-library/react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import {
  mockFetchDomainsInfo,
  mockDeleteDomain,
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
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      currentEnv.domain = { verified: false };

      createWrapper({ app: currentApp, environment: currentEnv });
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
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      currentEnv.domain = { verified: true, name: "www.stormkit.io" };

      mockFetchDomainsInfo({
        appId: currentApp.id,
        envName: currentEnv.name,
        status: 200,
        response: {
          domainName: "www.stormkit.io",
          tls: {
            startDate: Date.now(),
            endDate: Date.now(),
            serialNo: "serial-no",
            signatureAlgorithm: "signature-algorithm",
          },
          dns: {
            verified: true,
            txt: {
              value: "txt-value",
              name: "TXT",
              lookup: "txt-value.www.stormkit.io",
            },
          },
        },
      });

      createWrapper({ app: currentApp, environment: currentEnv });
    });

    test("should not display the configure domain buttony anymore", async () => {
      await waitFor(() => {
        expect(() => wrapper.getByText("Configure domain")).toThrow();
      });
    });

    test("should allow removing a domain", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Domain name")).toBeTruthy();
        expect(wrapper.getByText("www.stormkit.io")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("Remove"));

      const scope = mockDeleteDomain({
        appId: currentApp.id,
        envName: currentEnv.name,
        domainName: "www.stormkit.io",
        response: { ok: true },
      });

      await waitFor(() => {
        expect(wrapper.getByText("Yes, continue")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("Yes, continue"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(setRefreshToken).toHaveBeenCalled();
      });
    });
  });
});
