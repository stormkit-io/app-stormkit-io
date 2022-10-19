import type { RenderResult } from "@testing-library/react";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import { mockFetchDomainsInfo } from "~/testing/nocks/nock_domains";
import DomainVerificationStatus from "./DomainVerificationStatus";

interface Props {
  app: App;
  environment: Environment;
  domain: Domain;
}

describe("~/pages/apps/[id]/environments/[env-id]/config/_components/TabDomainConfig/DomainVerificationStatus.tsx", () => {
  let wrapper: RenderResult;
  let setDomainsInfo: jest.Mock;
  let currentApp: App;
  let currentEnv: Environment;
  let domain: Domain;

  const createWrapper = ({ app, environment, domain }: Props) => {
    setDomainsInfo = jest.fn();

    wrapper = render(
      <DomainVerificationStatus
        app={app}
        environment={environment}
        setDomainsInfo={setDomainsInfo}
        domain={domain}
      />
    );
  };

  describe("with verified domain", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      currentEnv.domain = { verified: true, name: "www.stormkit.io" };
      domain = {
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
      };

      createWrapper({ app: currentApp, environment: currentEnv, domain });
    });

    test("should display a verified text", () => {
      expect(wrapper.getByText("Domain verification status")).toBeTruthy();
      expect(wrapper.getByText("Verified")).toBeTruthy();
    });
  });

  describe("with unverified domain", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      currentEnv.domain = { verified: false, name: "www.stormkit.io" };
      domain = {
        domainName: "www.stormkit.io",
        tls: null,
        dns: {
          verified: false,
          txt: {
            value: "txt-value",
            name: "txt-name",
            lookup: "txt-name.www.stormkit.io",
          },
        },
      };

      createWrapper({ app: currentApp, environment: currentEnv, domain });
    });

    test("should display a verified text", () => {
      expect(wrapper.getByText("Domain verification status")).toBeTruthy();
      expect(wrapper.getByText("Pending verification")).toBeTruthy();
    });

    test("should display txt records", () => {
      expect(wrapper.getByText("TXT Record Value")).toBeTruthy();
      expect(wrapper.getByText("txt-value")).toBeTruthy();
      expect(wrapper.getByText("TXT Record Name/Host")).toBeTruthy();
      expect(wrapper.getByText("txt-name")).toBeTruthy();
    });

    test("should make a new call when Verify Now is clicked", async () => {
      const scope = mockFetchDomainsInfo({
        appId: currentApp.id,
        envName: currentEnv.name,
        response: domain,
      });
      fireEvent.click(wrapper.getByText("Verify now"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(setDomainsInfo).toHaveBeenCalledWith([domain]);
      });
    });
  });
});
