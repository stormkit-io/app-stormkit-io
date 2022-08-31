import { waitFor, fireEvent, getByText } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/~/testing/nocks";

const fileName = "pages/apps/[id]/deployments/_components/PublishModal";

describe(fileName, () => {
  let wrapper;
  let app;
  let envs;
  const path = `~/${fileName}`;

  const findOption = text => getByText(document.body, text);
  const findEnvironmentSelector = () =>
    wrapper.getByLabelText("Select an environment to publish");

  const selectProductionEnvironment = async () => {
    fireEvent.mouseDown(findEnvironmentSelector());

    await waitFor(() => {
      const option = findOption("(app.stormkit.io)");
      fireEvent.click(option);
    });
  };

  const nockDeployments = deploys =>
    nocks.mockFetchDeploymentsCall({
      appId: app.id,
      filters: {
        published: true,
        envId: envs[0].id,
      },
      response: { deploys },
    });

  describe("it should initially display no deployment", () => {
    let deployments;

    beforeEach(async () => {
      const mockDeploymentsResponse = data.mockDeploymentsResponse();

      app = data.mockApp();
      envs = data.mockEnvironments({ app });
      deployments = mockDeploymentsResponse.deploys;

      nockDeployments([]);

      wrapper = withMockContext({
        path,
        props: {
          app,
          environments: envs,
          deployments,
          deployment: deployments[0],
        },
      });
    });

    test.skip("should not any deployment until an environment is selected", () => {
      expect(() => wrapper.getByText("Improve snippets")).toThrow();
    });

    test.skip("should not contain a publish deployment button", () => {
      expect(() => wrapper.getByText("Publish to app.stormkit.io")).toThrow();
    });
  });

  describe("when there is no previously published deployments", () => {
    let deployments;

    beforeEach(async () => {
      const mockDeploymentsResponse = data.mockDeploymentsResponse();

      app = data.mockApp();
      envs = data.mockEnvironments({ app });
      deployments = mockDeploymentsResponse.deploys;

      nockDeployments([]);

      wrapper = withMockContext({
        path,
        props: {
          app,
          isOpen: true,
          environments: envs,
          deployments,
          deployment: deployments[0],
        },
      });

      await selectProductionEnvironment();
    });

    test.skip("should display a publish to button", () => {
      expect(wrapper.getByText("Publish to app.stormkit.io")).toBeTruthy();
    });

    test.skip("should send an api request when publish button is clicked", async () => {
      const scope = nocks.mockPublishDeploymentsCall({
        appId: app.id,
        envId: envs[0].id,
        publish: [{ percentage: 100, deploymentId: deployments[0].id }],
      });

      fireEvent.click(wrapper.getByText("Publish to app.stormkit.io"));

      // This will cause a refetch.
      nockDeployments([]);

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(wrapper.history.action).toBe("REPLACE");
        expect(wrapper.history.location.state.success).toBe(
          "Deployment has been successfully published."
        );
      });
    });

    test.skip("should not display the currently published deployments box", () => {
      expect(() =>
        wrapper.getByText("Currently published deployments in")
      ).toThrow();
    });

    test.skip("should display the single deployment", () => {
      expect(wrapper.getByText("Improve snippets")).toBeTruthy();
    });

    test.skip("should not contain a slider", () => {
      expect(() =>
        wrapper.getByTestId(`slider-${deployments[0].id}`)
      ).toThrow();
    });
  });

  describe("when there are previously published deployments", () => {
    let app;
    let envs;
    let deployments;

    beforeEach(async () => {
      const mockDeploymentsResponse = data.mockDeploymentsResponse();

      app = data.mockApp();
      envs = data.mockEnvironments({ app });
      deployments = mockDeploymentsResponse.deploys;

      nockDeployments(deployments);

      wrapper = withMockContext({
        path,
        props: {
          app,
          isOpen: true,
          environments: envs,
          deployments,
          deployment: deployments[0],
        },
      });

      await selectProductionEnvironment();
    });

    test.skip("should not display the currently published deployments box", async () => {
      await waitFor(() => {
        expect(
          wrapper.getByText("Currently published deployments in")
        ).toBeTruthy();
      });
    });

    test.skip("should display the single deployment", () => {
      expect(wrapper.getByText("Improve snippets")).toBeTruthy();
    });

    test.skip("should contain a slider", async () => {
      await waitFor(() => {
        expect(wrapper.getByTestId(`slider-${deployments[0].id}`)).toBeTruthy();
      });
    });

    test.skip("should contain a sync sliders label", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Sync sliders")).toBeTruthy();
      });
    });
  });
});
