import type { RenderResult } from "@testing-library/react";
import type { History } from "history";
import React from "react";
import { waitFor, fireEvent, render } from "@testing-library/react";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import mockApp from "~/testing/data/mock_app";
import mockEnv from "~/testing/data/mock_environment";
import { mockFetchRepoMeta } from "~/testing/nocks/nock_environment";
import { mockDeployNow } from "~/testing/nocks/nock_deployments";
import userEvent from "@testing-library/user-event";
import DeployModal from "./DeployModal";

interface Props {
  app: App;
  env: Environment;
}

describe("~/layouts/AppLayout/_components/DeployModal.tsx", () => {
  let wrapper: RenderResult;
  let history: History;
  let currentApp: App;
  let currentEnv: Environment;
  let toggleModal: jest.Mock;
  const deploymentId = "15639164571";

  const createWrapper = ({ app, env }: Props) => {
    toggleModal = jest.fn();
    history = createMemoryHistory();
    wrapper = render(
      <Router navigator={history} location={history.location}>
        <DeployModal
          app={app}
          environments={[env]}
          selected={env}
          toggleModal={toggleModal}
        />
      </Router>
    );
  };

  beforeEach(async () => {
    currentApp = mockApp();
    currentEnv = mockEnv({ app: currentApp });
    currentEnv.branch = "";
    currentEnv.build.cmd = "";
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
    cmd: "echo hi",
  };

  const executeDeployFlow = async () => {
    await userEvent.type(
      wrapper.getByLabelText("Build command"),
      deployConfig.cmd
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

  test("mounts the modal properly", () => {
    expect(wrapper.getByText("Start a deployment")).toBeTruthy();
    expect(wrapper.getByText("Deploy now")).toBeTruthy();
    expect(
      wrapper.getByText("Update default settings").getAttribute("href")
    ).toBe(`/apps/${currentApp.id}/environments/${currentEnv.id}`);
  });

  test("creates a new deployment", async () => {
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
      expect(history.location.pathname).toBe(
        `/apps/${currentApp.id}/environments/${currentEnv.id}/deployments/${deploymentId}`
      );
    });
  });

  test("429 errors should display a payment error", async () => {
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
      expect(history.location.pathname).toBe("/");
      expect(
        wrapper.getByText(
          /You have exceeded the maximum number of concurrent builds/
        )
      ).toBeTruthy();
    });
  });

  test("Other errors should display a generic error", async () => {
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
      expect(history.location.pathname).toBe("/");
      expect(
        wrapper.getByText(
          /Something wrong happened here. Please contact us at hello@stormkit.io/
        )
      ).toBeTruthy();
    });
  });
});
