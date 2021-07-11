import { waitFor, fireEvent } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";

const fileName =
  "pages/apps/[id]/environments/[env-id]/domain/_components/DomainRow";

describe(fileName, () => {
  const app = data.mockApp();
  const path = `~/${fileName}`;
  let wrapper;

  describe("when not verified yet", () => {
    let domainInfo;

    beforeEach(() => {
      domainInfo = data.mockDomainInfo();
      domainInfo.dns.verified = false;
      wrapper = withMockContext({
        path,
        props: {
          app,
          domain: domainInfo,
          onVerify: jest.fn(),
        },
      });
    });

    test("should display a verification is in process message and the steps to verify", () => {
      expect(wrapper.getByText("Pending verification")).toBeTruthy();
      expect(
        wrapper.getByText(
          "Login to your external DNS provider and create the following TXT record."
        )
      ).toBeTruthy();
      expect(wrapper.getByText(domainInfo.dns.txt.name)).toBeTruthy();
      expect(wrapper.getByText(domainInfo.dns.txt.value)).toBeTruthy();
    });

    test("clicking the verify now button should trigger a call and refetch", async () => {
      const { onVerify } = wrapper.injectedProps;
      onVerify.mockImplementation(() => Promise.resolve());
      fireEvent.click(wrapper.getByText("Verify now"));
      expect(onVerify).toHaveBeenCalled();
      await waitFor(() => {
        expect(
          wrapper.getByText(/TXT records still do not match/)
        ).toBeTruthy();
      });
    });
  });

  describe("when verified and not in use", () => {
    let domainInfo;

    beforeEach(() => {
      domainInfo = data.mockDomainInfo();
      domainInfo.dns.verified = true;
      domainInfo.dns.domainInUse = false;
      wrapper = withMockContext(path, {
        app,
        domain: domainInfo,
        onVerify: jest.fn(),
      });
    });

    test("should display a Verified message", () => {
      expect(wrapper.getByText("Verified")).toBeTruthy();
    });

    test("should display a not in use message and the steps to follow", () => {
      [
        "Domain is not yet pointing to our servers",
        /Point your DNS settings to Stormkit to start using your domain/,
        "Recommended: Setting up CNAME",
        `${app.displayName}.stormkit.dev`,
        "Alternative: Setting up A Record",
        "35.156.69.62",
      ].forEach(text => expect(wrapper.getByText(text)).toBeTruthy());
    });

    test("clicking the verify now button should trigger a call and refetch", async () => {
      const { onVerify } = wrapper.injectedProps;
      onVerify.mockImplementation(() => Promise.resolve());
      fireEvent.click(wrapper.getByText("Verify now"));
      expect(onVerify).toHaveBeenCalled();
      await waitFor(() => {
        expect(
          wrapper.getByText(/DNS records are still not pointing to our servers/)
        ).toBeTruthy();
      });
    });
  });

  describe("when verified and in use", () => {
    let domainInfo;

    beforeEach(() => {
      domainInfo = data.mockDomainInfo();
      wrapper = withMockContext(path, {
        app,
        domain: domainInfo,
        onVerify: jest.fn(),
      });
    });

    test("should display a verified and in use text", () => {
      expect(wrapper.getByText("Verified")).toBeTruthy();
      expect(
        wrapper.getByText("Domain is in use and pointing to our servers")
      ).toBeTruthy();
    });

    test("should display the certificate settings", () => {
      [
        "Certificate issued successfully",
        "Issuer",
        "Let's Encrypt Authority X3",
        "Issued at",
        "2020-06-30",
        "Valid until",
        "2020-09-28",
        "Serial no",
        "343486059919871512067800302572875759206296",
        "Signature Algorithm",
        "SHA256-RSA",
      ].forEach(text => expect(wrapper.getByText(text)).toBeTruthy());
    });
  });
});
