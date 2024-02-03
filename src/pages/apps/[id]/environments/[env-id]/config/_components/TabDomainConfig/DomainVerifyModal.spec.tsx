import type { RenderResult } from "@testing-library/react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import mockDomain from "~/testing/data/mock_domain";
import mockDomainInfo from "~/testing/data/mock_domain_info";
import { mockFetchDomainsInfo } from "~/testing/nocks/nock_domains";
import DomainVerifyModal from "./DomainVerifyModal";

interface Props {
  app: App;
  environment: Environment;
  domain: Domain;
}

describe("~/pages/apps/[id]/environments/[env-id]/config/_components/TabDomainConfig/DomainVerifyModal.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let domain: Domain;
  let onClose: jest.Func;

  const createWrapper = ({ app, environment, domain }: Props) => {
    onClose = jest.fn();

    wrapper = render(
      <DomainVerifyModal
        app={app}
        environment={environment}
        domain={domain}
        onClose={onClose}
      />
    );
  };

  describe("with unverified domain", () => {
    beforeEach(async () => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      domain = mockDomain();
      domain.verified = false;

      const domainInfo = mockDomainInfo();
      domainInfo.tls = null;
      domainInfo.dns.verified = false;

      const scope = mockFetchDomainsInfo({
        appId: currentApp.id,
        envId: currentEnv.id!,
        domainId: domain.id,
        status: 200,
        response: mockDomainInfo(),
      });

      createWrapper({ app: currentApp, environment: currentEnv, domain });

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });
    });

    test("should display header texts", () => {
      expect(wrapper.getByText(domain.domainName)).toBeTruthy();
      expect(
        wrapper.getByText("Follow these steps to verify your domain.")
      ).toBeTruthy();
    });

    test("should display txt records text", async () => {
      await waitFor(() => {
        expect(
          wrapper.getByText(
            /Login to your external DNS provider and create the following TXT record./
          )
        ).toBeTruthy();
      });

      expect(wrapper.getByText("txt-value.app.stormkit.io")).toBeTruthy();
    });

    test("should make a new call when Verify Now is clicked", async () => {
      const scope = mockFetchDomainsInfo({
        appId: currentApp.id,
        envId: currentEnv.id!,
        domainId: domain.id,
        response: mockDomainInfo(),
      });

      fireEvent.click(wrapper.getByText("Verify now"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });
    });
  });
});
