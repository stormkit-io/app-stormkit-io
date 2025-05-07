import type { Scope } from "nock";
import { describe, expect, it, vi } from "vitest";
import { RenderResult, waitFor } from "@testing-library/react";
import mockDeployments from "~/testing/data/mock_deployments_v2";
import { mockFetchDeployments } from "~/testing/nocks/nock_deployments_v2";
import { renderWithRouter } from "~/testing/helpers";
import Deployment from "./Deployment";

interface Props {
  deployment?: DeploymentV2;
}

vi.mock("~/utils/helpers/deployments", () => ({
  formattedDate: () => "21.09.2022 - 21:30",
}));

describe("~/apps/[id]/environments/[env-id]/deployments/Deployment.tsx", () => {
  let wrapper: RenderResult;
  let currentDeploy: DeploymentV2;
  let scope: Scope;

  const createWrapper = ({ deployment }: Props | undefined = {}) => {
    currentDeploy = deployment || mockDeployments()[0];

    scope = mockFetchDeployments({
      deploymentId: currentDeploy.id,
      response: { deployments: [currentDeploy] },
    });

    wrapper = renderWithRouter({
      el: () => <Deployment />,
      path: "/apps/:appId/environments/:envId/deployments/:deploymentId",
      initialEntries: [
        `/apps/${currentDeploy.appId}/environments/${currentDeploy.envId}/deployments/${currentDeploy.id}`,
      ],
    });
  };

  it("should display deployment details", async () => {
    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.getByText("chore: update packages")).toBeTruthy();
      expect(wrapper.getByText("published")).toBeTruthy();
      expect(wrapper.getByText("21.09.2022 - 21:30")).toBeTruthy();
      expect(wrapper.getByText(/main/)).toBeTruthy();
    });
  });

  it("should display the logs", async () => {
    const deployment = mockDeployments()[0];
    deployment.logs = [
      {
        title: "npm run build",
        message: "Nuxt CLI v3.0.0-rc.8",
        status: true,
        payload: "",
      },
    ];

    createWrapper({ deployment });

    await waitFor(() => {
      expect(wrapper.getByText("npm run build")).toBeTruthy();
    });
  });

  it("should display the preview button for successful deployments", async () => {
    createWrapper();

    await waitFor(() => {
      expect(wrapper.getByText("Preview")).toBeTruthy();
    });
  });

  it("should display expand menu", async () => {
    createWrapper();

    await waitFor(() => {
      expect(
        wrapper.getByLabelText(`Deployment ${currentDeploy.id} menu`)
      ).toBeTruthy();
    });
  });
});
