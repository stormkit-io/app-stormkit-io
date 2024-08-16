import type { RenderResult } from "@testing-library/react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import mockDomain from "~/testing/data/mock_domain";
import {
  mockUpdateCustomCert,
  mockDeleteCustomCert,
} from "~/testing/nocks/nock_domains";
import CustomCertModal from "./CustomCertModal";

interface Props {
  app: App;
  environment: Environment;
  domain: Domain;
}

describe("~/pages/apps/[id]/environments/[env-id]/config/_components/TabDomainConfig/CustomCertModal.tsx", () => {
  let wrapper: RenderResult;
  let onUpdate: jest.Mock;
  let setSuccess: jest.Mock;
  let currentApp: App;
  let currentEnv: Environment;
  let currentDomain: Domain;

  const createWrapper = ({ app, environment, domain }: Props) => {
    onUpdate = jest.fn();
    setSuccess = jest.fn();

    wrapper = render(
      <CustomCertModal
        onClose={jest.fn()}
        onUpdate={onUpdate}
        setSuccess={setSuccess}
        appId={app.id}
        envId={environment.id!}
        domain={domain}
      />
    );
  };

  describe("with no pre-existing custom certificate", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      currentDomain = mockDomain();

      createWrapper({
        app: currentApp,
        environment: currentEnv,
        domain: currentDomain,
      });
    });

    test("does not send an API request when certificate field is invalid", async () => {
      await userEvent.type(wrapper.getByLabelText("Certificate"), "my-cert");
      await userEvent.type(wrapper.getByLabelText("Private key"), "my-key");

      fireEvent.click(wrapper.getByText("Configure"));

      await waitFor(() => {
        expect(wrapper.getByText("Certificate must be PEM encoded."));
      });
    });

    test("does not send an API request when private key field is invalid", async () => {
      await userEvent.type(
        wrapper.getByLabelText("Certificate"),
        "-----BEGIN CERTIFICATE-----"
      );
      await userEvent.type(wrapper.getByLabelText("Private key"), "my-key");

      fireEvent.click(wrapper.getByText("Configure"));

      await waitFor(() => {
        expect(wrapper.getByText("Private key must be PEM encoded."));
      });
    });

    test("sends an API request when fields are provided correctly", async () => {
      const certVal = "-----BEGIN CERTIFICATE-----";
      const certKey = "-----BEGIN PRIVATE KEY-----";

      const scope = mockUpdateCustomCert({
        appId: currentApp.id,
        envId: currentEnv.id!,
        domainId: currentDomain.id,
        certKey,
        certValue: certVal,
        status: 200,
        response: { ok: true },
      });

      await userEvent.type(wrapper.getByLabelText("Certificate"), certVal);
      await userEvent.type(wrapper.getByLabelText("Private key"), certKey);

      fireEvent.click(wrapper.getByText("Configure"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(setSuccess).toHaveBeenCalledWith(
          "Certificate was saved successfully. It will be automatically applied for new requests."
        );
      });
    });

    test("delete button is disabled", () => {
      expect(wrapper.getByText("Delete").getAttribute("disabled")).toBe("");
    });
  });

  describe("with pre-existing custom certificate", () => {
    const certVal = "-----BEGIN CERTIFICATE-----";
    const certKey = "-----BEGIN PRIVATE KEY-----";

    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      currentDomain = mockDomain();
      currentDomain.customCert = {
        value: certVal,
        key: certKey,
      };

      createWrapper({
        app: currentApp,
        environment: currentEnv,
        domain: currentDomain,
      });
    });

    test("displays two textareas with values prefilled", async () => {
      expect(wrapper.findByDisplayValue(certVal)).toBeTruthy();
      expect(wrapper.findByDisplayValue(certKey)).toBeTruthy();
    });

    test("deleting a custom certificate", async () => {
      const scope = mockDeleteCustomCert({
        appId: currentApp.id,
        envId: currentEnv.id!,
        domainId: currentDomain.id,
        status: 200,
        response: { ok: true },
      });

      fireEvent.click(wrapper.getByText("Delete"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(setSuccess).toHaveBeenCalledWith(
          "Custom certificate was removed. A new certificate will be issued automatically."
        );
      });
    });

    test("updates custom certificate", async () => {
      const scope = mockUpdateCustomCert({
        appId: currentApp.id,
        envId: currentEnv.id!,
        domainId: currentDomain.id,
        certKey,
        certValue: certVal,
        status: 200,
        response: { ok: true },
      });

      fireEvent.click(wrapper.getByText("Configure"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(setSuccess).toHaveBeenCalledWith(
          "Certificate was saved successfully. It will be automatically applied for new requests."
        );
      });
    });
  });
});
