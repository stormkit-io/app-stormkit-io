import { waitFor } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as nocks from "~/testing/nocks";
import * as data from "~/testing/data";

const fileName = "pages/apps/[id]/deployments/[deployment-id]";

describe(fileName, () => {
  const app = { id: "1" };
  const path = `~/${fileName}`;
  let deploy;
  let wrapper;
  let scope;

  describe("when the deployment is successful", () => {
    beforeEach(() => {
      deploy = data.mockDeploymentResponse().deploy;
      scope = nocks.mockFetchDeploymentCall({ app, deploy });
      wrapper = withMockContext(path, {
        app,
        match: { params: { deploymentId: deploy.id } }
      });
    });

    test.each`
      step
      ${"0. checkout master"}
      ${"1. node --version"}
      ${"2. npm i"}
      ${"3. environment variables"}
      ${"4. npm run build"}
      ${"5. deploy"}
    `("should display step: $step", async ({ step }) => {
      await waitFor(() => {
        const stepWrapper = wrapper.getByText(step);
        expect(stepWrapper).toBeTruthy();
        expect(stepWrapper.parentNode.innerHTML).toContain("Success");
      });
    });

    test("should contain a preview link", async () => {
      const { preview } = deploy;
      await waitFor(() => {
        expect(wrapper.getByText(preview).getAttribute("href")).toBe(preview);
      });
    });

    test("should contain a preview button at the bottom of the view", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Preview")).toBeTruthy();
      });
    });

    test("should contain the deployment information", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Branch")).toBeTruthy();
        expect(wrapper.getByText("master")).toBeTruthy();
      });

      expect(scope.isDone()).toBe(true);
    });
  });

  describe("when the deployment has failed", () => {
    beforeEach(() => {
      deploy = data.mockDeploymentResponse().deploy;
      deploy.exit = 1;
      scope = nocks.mockFetchDeploymentCall({
        app,
        deploy,
        response: { deploy }
      });
      wrapper = withMockContext(path, {
        app,
        match: { params: { deploymentId: deploy.id } }
      });
    });

    test("should not contain a preview link", async () => {
      const { preview } = deploy;
      await waitFor(() => {
        expect(wrapper.getByText("master")).toBeTruthy();
        expect(() => wrapper.getByText(preview)).toThrow();
      });
    });

    test("should not contain a preview button at the bottom of the view", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("master")).toBeTruthy();
        expect(() => wrapper.getByText("Preview")).toThrow();
      });
    });

    test("should contain the deployment information", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Branch")).toBeTruthy();
        expect(wrapper.getByText("master")).toBeTruthy();
      });

      expect(scope.isDone()).toBe(true);
    });
  });
});
