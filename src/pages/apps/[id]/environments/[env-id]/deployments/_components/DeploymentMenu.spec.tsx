import React from "react";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import mockApp from "~/testing/data/mock_app";
import mockDeployment from "~/testing/data/mock_deployment";
import mockEnvironment from "~/testing//data/mock_environment";
import { mockDeleteDeploymentCall } from "~/testing/nocks/nock_deployments";
import DeploymentMenu from "./DeploymentMenu";

interface Props {
  app?: App;
  environment?: Environment;
  deployment?: Deployment;
  omittedItems?: string[];
}

jest.mock("~/utils/helpers/deployments", () => ({
  formattedDate: () => "21.09.2022 - 21:30",
}));

describe("~/apps/[id]/environments/[env-id]/deployments/_components/DeploymentMenu.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let currentDeploy: Deployment;
  let id = 1050101;

  const createWrapper = ({
    app,
    environment,
    deployment,
    omittedItems,
  }: Props | undefined = {}) => {
    currentApp = app || mockApp();
    currentEnv = environment || mockEnvironment({ app: currentApp });
    currentDeploy =
      deployment ||
      mockDeployment({
        appId: currentApp.id,
        envId: currentEnv.id,
        id: id++ + "",
      });

    wrapper = render(
      <MemoryRouter>
        <DeploymentMenu
          setRefreshToken={jest.fn()}
          environment={currentEnv}
          app={currentApp}
          deployment={currentDeploy}
          omittedItems={omittedItems}
        />
      </MemoryRouter>
    );
  };

  test("shoud omit specified items", async () => {
    createWrapper({ omittedItems: ["view-details"] });
    fireEvent.click(wrapper.getByLabelText("expand"));

    await waitFor(() => {
      expect(wrapper.getByText("Delete")).toBeTruthy();
    });

    expect(() => wrapper.getByText("View details")).toThrow();
  });

  test("should have a link to the deployments page", async () => {
    createWrapper({});
    fireEvent.click(wrapper.getByLabelText("expand"));

    await waitFor(() => {
      expect(wrapper.getByText("View details").getAttribute("href")).toBe(
        `/apps/${currentApp.id}/environments/${currentEnv.id}/deployments/${currentDeploy.id}`
      );
    });
  });

  test("should handle deleting deployment", async () => {
    createWrapper();

    const deleteScope = mockDeleteDeploymentCall({
      appId: currentApp.id,
      deploymentId: currentDeploy.id,
    });

    fireEvent.click(wrapper.getByLabelText("expand"));

    await waitFor(() => {
      expect(wrapper.getByText("Delete")).toBeTruthy();
    });

    fireEvent.click(wrapper.getByText("Delete"));

    await waitFor(() => {
      expect(wrapper.getByText("Yes, continue")).toBeTruthy();
    });

    fireEvent.click(wrapper.getByText("Yes, continue"));

    await waitFor(() => {
      expect(deleteScope.isDone()).toBe(true);
    });
  });
});
