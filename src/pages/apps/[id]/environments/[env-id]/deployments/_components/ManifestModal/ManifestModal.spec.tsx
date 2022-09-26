import type { Scope } from "nock";
import React from "react";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import mockApp from "~/testing/data/mock_app";
import mockDeployment from "~/testing/data/mock_deployment";
import mockEnvironment from "~/testing//data/mock_environment";
import mockManifest from "~/testing/data/mock_deployment_manifest";
import { mockFetchManifestCall } from "~/testing/nocks/nock_deployments";
import ManifestModal from "./ManifestModal";

interface Props {
  onClose?: () => void;
  app?: App;
  env?: Environment;
  deployment?: Deployment;
  manifest?: Manifest;
}

jest.mock("@codemirror/lang-json", () => ({ json: jest.fn() }));
jest.mock("@uiw/react-codemirror", () => ({ value }: { value: string }) => (
  <>{value}</>
));

describe("~/apps/[id]/environments/[env-id]/deployments/_components/ManifestModal/ManifestModal.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let currentDepl: Deployment;
  let scope: Scope;

  const createWrapper = ({
    onClose = jest.fn(),
    app,
    env,
    deployment,
    manifest = {},
  }: Props | undefined = {}) => {
    currentApp = app || mockApp();
    currentEnv = env || mockEnvironment({ app: currentApp });
    currentDepl =
      deployment ||
      mockDeployment({ appId: currentApp.id, envId: currentEnv.id });

    scope = mockFetchManifestCall({
      appId: currentApp.id,
      deploymentId: currentDepl.id,
      response: { manifest },
    });

    wrapper = render(
      <ManifestModal
        onClose={onClose}
        app={currentApp}
        deployment={currentDepl}
      />
    );
  };

  test("should render the title properly", () => {
    createWrapper();
    expect(wrapper.getByText(/Deployment manifest/)).toBeTruthy();
    expect(wrapper.getByText(new RegExp(`#${currentDepl.id}`))).toBeTruthy();
  });

  test("should make the api call on mount", async () => {
    createWrapper();
    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("ui view", () => {
    test("should contain the cdn files as the primary view", async () => {
      const manifest = mockManifest();
      createWrapper({ manifest });

      await waitFor(() => {
        expect(
          wrapper.getByText(manifest.cdnFiles?.[0].fileName!)
        ).toBeTruthy();
      });

      // The file name of the CDN file
      expect(wrapper.getByText(manifest.cdnFiles?.[1].fileName!)).toBeTruthy();

      // The preview URL for the CDN file
      expect(
        wrapper.getByText(
          `${currentDepl.preview}${manifest.cdnFiles?.[0].fileName}`
        )
      ).toBeTruthy();
    });

    test("should contain a redirects tab", async () => {
      const manifest = mockManifest();
      createWrapper({ manifest });

      await waitFor(() => {
        expect(wrapper.getByLabelText("redirects")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByLabelText("redirects"));

      await waitFor(() => {
        expect(
          wrapper.getByText(/This deployment has no redirects\./)
        ).toBeTruthy();
      });

      expect(wrapper.getByText(/Create a top-level/)).toBeTruthy();
      expect(wrapper.getByText(/redirects\.json/)).toBeTruthy();
      expect(wrapper.getByText(/to add server side redirects\./)).toBeTruthy();
      expect(wrapper.getByText("Learn more").getAttribute("href")).toEqual(
        "https://www.stormkit.io/docs/features/redirects-and-path-rewrites"
      );
    });

    test("should contain a ssr tab", async () => {
      const manifest = mockManifest();
      createWrapper({ manifest });

      await waitFor(() => {
        expect(wrapper.getByLabelText("server side rendering")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByLabelText("server side rendering"));

      await waitFor(() => {
        expect(wrapper.getByText(/detected/)).toBeTruthy();
      });

      expect(
        wrapper.getByText(
          /Requests not matching any CDN file will be served from the serverless app\./
        )
      ).toBeTruthy();
    });
  });

  describe("json view", () => {
    test("should code mirror", async () => {
      const manifest = mockManifest();
      createWrapper({ manifest });

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      fireEvent.click(wrapper.getByLabelText("json view"));

      await waitFor(() => {
        expect(wrapper.getByText(/cdnFiles/)).toBeTruthy();
        expect(wrapper.getByText(/redirects/)).toBeTruthy();
        expect(wrapper.getByText(/functionHandler/)).toBeTruthy();
      });
    });
  });
});
