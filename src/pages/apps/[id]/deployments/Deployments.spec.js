import { waitFor, fireEvent } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/~/testing/nocks";

const fileName = "pages/apps/[id]/deployments/Deployments";

describe(fileName, () => {
  let wrapper;
  const path = `~/${fileName}`;

  const findExitStatusIcon = deploymentId =>
    wrapper.container.querySelector(
      `[data-testid=deploy-${deploymentId}-exit-status] .fas`
    );

  describe("when has deployments", () => {
    let mockDeploymentsResponse;
    let app;

    beforeEach(() => {
      app = data.mockApp();
      mockDeploymentsResponse = data.mockDeploymentsResponse();

      nocks.mockFetchDeploymentsCall({
        appId: app.id,
        response: mockDeploymentsResponse,
      });

      wrapper = withMockContext({
        path,
        props: {
          app,
          environments: data.mockEnvironments({ app }),
        },
      });
    });

    test("should show a stopped deployment", async () => {
      await waitFor(() => {
        const { id } = mockDeploymentsResponse.deploys[2];
        const testId = `deploy-${id}`;
        const deployment = wrapper.getByTestId(testId);

        expect(findExitStatusIcon(id).className).toContain("fa-stop-circle");
        expect(deployment.innerHTML).toContain("My stopped deployment");
      });
    });

    test("should show a running deployment", async () => {
      await waitFor(() => {
        const deploymentId = mockDeploymentsResponse.deploys[1].id;
        const testId = `deploy-${deploymentId}`;
        const deployment = wrapper.getByTestId(testId);
        const icon = wrapper.container.querySelector(
          `[data-testid=${testId}] .fas.fa-running`
        );

        expect(icon).toBeTruthy();
        expect(deployment.innerHTML).toContain("Fix inject type");
      });
    });

    test("the running deployment should have a stop button", async () => {
      const { id } = mockDeploymentsResponse.deploys[1];

      nocks.mockStopDeploymentCall({ appId: app.id, deploymentId: id });

      await waitFor(() => {
        expect(findExitStatusIcon(id).className).toContain("fa-running");
      });

      // Open the menu
      fireEvent.click(wrapper.getByLabelText(`Deployment ${id} menu`));

      const stopButton = wrapper.getByLabelText(`Stop deployment ${id}`);
      expect(stopButton).toBeTruthy();

      // Click on the stop button
      fireEvent.click(stopButton);

      // Expect that the icon is now stopped
      await waitFor(() => {
        expect(findExitStatusIcon(id).className).toContain("fa-stop-circle");
      });
    });
  });

  describe("when has deployments with multiple pages", () => {
    let mockDeploymentsResponse;

    beforeEach(() => {
      const app = data.mockApp();
      const envs = data.mockEnvironments({ app });

      mockDeploymentsResponse = data.mockDeploymentsResponse();
      mockDeploymentsResponse.hasNextPage = true;

      nocks.mockFetchDeploymentsCall({
        appId: app.id,
        response: mockDeploymentsResponse,
      });

      wrapper = withMockContext({
        path,
        props: {
          app,
          environments: envs,
        },
      });
    });

    test("should have a button to load more", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Load more")).toBeTruthy();
      });
    });
  });

  describe("when has deployments with just 1 page", () => {
    let mockDeploymentsResponse;

    beforeEach(() => {
      const app = data.mockApp();
      const envs = data.mockEnvironments({ app });

      mockDeploymentsResponse = data.mockDeploymentsResponse();
      mockDeploymentsResponse.hasNextPage = false;

      nocks.mockFetchDeploymentsCall({
        appId: app.id,
        response: mockDeploymentsResponse,
      });

      wrapper = withMockContext({
        path,
        props: {
          app,
          environments: envs,
        },
      });
    });

    test("should not have a button to load more", async () => {
      await waitFor(() => {
        expect(() => wrapper.getByText("Load more")).toThrow();
      });
    });
  });
});
