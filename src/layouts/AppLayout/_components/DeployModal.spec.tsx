import type { RenderResult } from "@testing-library/react";
import type { Mock } from "vitest";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { waitFor, fireEvent } from "@testing-library/react";
import mockApp from "~/testing/data/mock_app";
import mockEnv from "~/testing/data/mock_environment";
import { mockFetchRepoMeta } from "~/testing/nocks/nock_environment";
import { mockDeployNow } from "~/testing/nocks/nock_deployments";
import userEvent from "@testing-library/user-event";
import DeployModal from "./DeployModal";
import { renderWithRouter } from "~/testing/helpers";

interface Props {
  app: App;
  env: Environment;
}

const navigate = vi.fn();

vi.mock("react-router", async () => {
  const mod = await vi.importActual<typeof import("react-router")>(
    "react-router"
  );

  return {
    ...mod,
    useNavigate: () => navigate,
  };
});

describe("~/layouts/AppLayout/_components/DeployModal.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let toggleModal: Mock;
  const deploymentId = "15639164571";

  const createWrapper = ({ app, env }: Props) => {
    toggleModal = vi.fn();

    wrapper = renderWithRouter({
      el: () => (
        <DeployModal
          app={app}
          environments={[env]}
          selected={env}
          toggleModal={toggleModal}
        />
      ),
    });
  };

  beforeEach(async () => {
    navigate.mockClear();

    currentApp = mockApp();
    currentEnv = mockEnv({ app: currentApp });
    currentEnv.branch = "";
    currentEnv.build.buildCmd = "";
    currentEnv.build.distFolder = "";

    const fetchMetaScope = mockFetchRepoMeta({
      name: currentEnv.name,
      appId: currentApp.id,
    });

    createWrapper({ app: currentApp, env: currentEnv });

    await waitFor(() => {
      expect(fetchMetaScope.isDone()).toBe(true);
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  const deployConfig = {
    distFolder: "my-dist",
    branch: "master",
    publish: true,
    buildCmd: "echo hi",
  };

  const executeDeployFlow = async () => {
    await userEvent.type(
      wrapper.getByLabelText("Build command"),
      deployConfig.buildCmd
    );

    await userEvent.type(
      wrapper.getByLabelText("Output folder"),
      deployConfig.distFolder
    );

    await userEvent.type(
      wrapper.getByLabelText("Checkout branch"),
      deployConfig.branch
    );

    await fireEvent.click(wrapper.getByText("Deploy now"));
  };

  it("mounts the modal properly", () => {
    expect(wrapper.getByText("Start a deployment")).toBeTruthy();
    expect(wrapper.getByText("Deploy now")).toBeTruthy();
    expect(
      wrapper.getByText("Update default settings").getAttribute("href")
    ).toBe(`/apps/${currentApp.id}/environments/${currentEnv.id}`);
  });

  it("creates a new deployment", async () => {
    const scope = mockDeployNow({
      appId: currentApp.id,
      config: { ...deployConfig, env: currentEnv.name },
      status: 200,
      response: { id: deploymentId },
    });

    await executeDeployFlow();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(toggleModal).toHaveBeenCalledWith(false);
      expect(navigate).toHaveBeenCalledWith(
        `/apps/${currentApp.id}/environments/${currentEnv.id}/deployments/${deploymentId}`
      );
    });
  });

  it("429 errors should display a payment error", async () => {
    const scope = mockDeployNow({
      appId: currentApp.id,
      config: { ...deployConfig, env: currentEnv.name },
      status: 429,
      response: {
        error: "You have exceeded the maximum number of concurrent builds",
      },
    });

    await executeDeployFlow();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(navigate).not.toHaveBeenCalled();
      expect(
        wrapper.getByText(
          /You have exceeded the maximum number of concurrent builds/
        )
      ).toBeTruthy();
    });
  });

  it("other errors should display a generic error", async () => {
    const scope = mockDeployNow({
      appId: currentApp.id,
      config: { ...deployConfig, env: currentEnv.name },
      status: 400,
      response: {
        error: "Something went wrong.",
      },
    });

    await executeDeployFlow();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(navigate).not.toHaveBeenCalled();
      expect(
        wrapper.getByText(
          /Something wrong happened here. Please contact us at hello@stormkit.io/
        )
      ).toBeTruthy();
    });
  });
});
