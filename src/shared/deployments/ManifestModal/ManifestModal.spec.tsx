import type { Scope } from "nock";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import mockDeployments from "~/testing/data/mock_deployments_v2";
import mockManifest from "~/testing/data/mock_deployment_manifest";
import { mockFetchManifest } from "~/testing/nocks/nock_deployments_v2";
import ManifestModal from "./ManifestModal";

interface Props {
  onClose?: () => void;
  deployment?: DeploymentV2;
  manifest?: Manifest;
}

jest.mock("@codemirror/lang-json", () => ({ json: jest.fn() }));
jest.mock("@uiw/react-codemirror", () => ({ value }: { value: string }) => (
  <>{value}</>
));

describe("~/apps/[id]/environments/[env-id]/deployments/_components/ManifestModal/ManifestModal.tsx", () => {
  let wrapper: RenderResult;
  let currentDepl: DeploymentV2;
  let scope: Scope;

  const createWrapper = ({
    onClose = jest.fn(),
    deployment,
    manifest = {},
  }: Props | undefined = {}) => {
    currentDepl = deployment || mockDeployments()[0];

    scope = mockFetchManifest({
      appId: currentDepl.appId,
      deploymentId: currentDepl.id,
      response: { manifest },
    });

    wrapper = render(
      <ManifestModal onClose={onClose} deployment={currentDepl} />
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

  test("should display a warning when top level index.html is missing and ssr is disabled", async () => {
    createWrapper({
      manifest: mockManifest({
        functionHandler: "",
        cdnFiles: [{ fileName: "/static/index.js", headers: {} }],
      }),
    });

    await waitFor(() => {
      expect(wrapper.getByText(/Top level/)).toBeTruthy();
      expect(wrapper.getByText("/index.html")).toBeTruthy();
      expect(
        wrapper.getByText(
          /is missing and server side rendering is not detected\./
        )
      ).toBeTruthy();
      expect(wrapper.getByText("Learn more.").getAttribute("href")).toBe(
        "https://www.stormkit.io/docs/troubleshooting#index-html-missing"
      );
    });
  });

  describe("ui view", () => {
    test("should contain the cdn files as the primary view", async () => {
      const manifest = mockManifest();
      createWrapper({ manifest });

      await waitFor(() => {
        expect(wrapper.getByText("manifest.json")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("_nuxt"));

      await waitFor(() => {
        expect(wrapper.getByText("default.6339aee9.mjs")).toBeTruthy();
      });

      // The preview URL for the CDN file
      expect(
        wrapper.getByText(
          `${currentDepl.previewUrl}${manifest.cdnFiles?.[0].fileName}`
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
        expect(wrapper.getByText(/SSR Detected/)).toBeTruthy();
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
