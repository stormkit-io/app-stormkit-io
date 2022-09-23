import React from "react";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import mockApp from "~/testing/data/mock_app";
import mockDeployment from "~/testing/data/mock_deployment";
import mockEnvironment from "~/testing//data/mock_environment";
import { mockPublishDeploymentsCall } from "~/testing/nocks/nock_deployments";
import PublishModal from "./PublishModal";

interface Props {
  onClose?: () => void;
  onUpdate?: () => void;
  app?: App;
  environment?: Environment;
  deployment?: Deployment;
}

describe("~/apps/[id]/environments/[env-id]/deployments/_components/PublishModal.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let currentDepl: Deployment;

  const createWrapper = ({
    onClose = jest.fn(),
    onUpdate = jest.fn(),
    app,
    environment,
    deployment,
  }: Props | undefined = {}) => {
    currentApp = app || mockApp();
    currentEnv = environment || mockEnvironment({ app: currentApp });
    currentDepl =
      deployment ||
      mockDeployment({ appId: currentApp.id, envId: currentEnv.id });

    wrapper = render(
      <MemoryRouter>
        <PublishModal
          onClose={onClose}
          onUpdate={onUpdate}
          app={currentApp}
          deployment={currentDepl}
          environment={currentEnv}
        />
      </MemoryRouter>
    );
  };

  test("should render the title properly", () => {
    createWrapper();
    expect(wrapper.getByText(/Publish deployment/)).toBeTruthy();
  });

  test("should render the deployment properly", () => {
    createWrapper();
    expect(wrapper.getByText(/chore: bump version/)).toBeTruthy();
    expect(wrapper.getByText(/by/)).toBeTruthy();
    expect(wrapper.getByText(/John Doe/)).toBeTruthy();
  });

  test("should render the publish button properly", () => {
    createWrapper();
    expect(wrapper.getByText(/Publish to/)).toBeTruthy();
    expect(wrapper.getByText("app.stormkit.io")).toBeTruthy();
  });

  test("publish gradually", async () => {
    const app = mockApp();
    const env = mockEnvironment({ app });
    env.published = [
      {
        deploymentId: "482858",
        commitAuthor: "Jane Doe",
        commitSha: "38817691491",
        commitMessage: "fix: author name",
        branch: "main",
        percentage: 100,
      },
    ];

    const scope = mockPublishDeploymentsCall({
      appId: app.id,
      envId: env.id!,
      publish: [
        { percentage: 50, deploymentId: "482858" },
        { percentage: 50, deploymentId: currentDepl.id },
      ],
    });

    const onUpdate = jest.fn();

    createWrapper({ environment: env, onUpdate });
    expect(() => wrapper.getByText(/fix: author name/)).toThrow();

    fireEvent.click(wrapper.getByText("Publish gradually"));

    await waitFor(() => {
      expect(wrapper.getByText(/fix: author name/)).toBeTruthy();
    });

    fireEvent.click(wrapper.getByText(/Publish to/));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
      expect(scope.isDone()).toBe(true);
    });
  });
});
