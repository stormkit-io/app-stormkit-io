import { MemoryRouter } from "react-router";
import {
  waitFor,
  render,
  fireEvent,
  RenderResult,
} from "@testing-library/react";
import mockDeployments from "~/testing/data/mock_deployments_v2";
import mockManifest from "~/testing/data/mock_deployment_manifest";
import {
  mockStopDeployment,
  mockDeleteDeployment,
  mockFetchManifest,
} from "~/testing/nocks/nock_deployments_v2";
import DeploymentRow from "./DeploymentRow";

interface Props {
  deployment: DeploymentV2;
  showProject?: boolean;
}

describe("~/shared/deployments/DeploymentRow.tsx", () => {
  let wrapper: RenderResult;
  let setRefreshToken: jest.Func;

  const createWrapper = ({ deployment, showProject }: Props) => {
    setRefreshToken = jest.fn();

    wrapper = render(
      <MemoryRouter>
        <DeploymentRow
          deployment={deployment}
          showProject={showProject}
          setRefreshToken={setRefreshToken}
        />
      </MemoryRouter>
    );
  };

  const openMenu = (id: string) => {
    fireEvent.click(wrapper.getByLabelText(`Deployment ${id} menu`));
  };

  test("should display the commit information properly", () => {
    const deployment = mockDeployments()[0];
    deployment.detailsUrl = "/my-test/url";
    createWrapper({ deployment, showProject: true });
    expect(wrapper.getByText("chore: update packages")).toBeTruthy();
    expect(wrapper.getByText("by Joe Doe")).toBeTruthy();
    expect(wrapper.getByText("published: 100%")).toBeTruthy();

    expect(
      wrapper.getByText("chore: update packages").getAttribute("href")
    ).toBe("/my-test/url");

    expect(wrapper.getByText("sample-project").getAttribute("href")).toBe(
      "/apps/1/environments/1/deployments"
    );
  });

  test("should contain a menu to interact with", () => {
    const deployment = mockDeployments()[0];
    createWrapper({ deployment });

    expect(
      wrapper.getByLabelText(`Deployment ${deployment.id} menu`)
    ).toBeTruthy();
  });

  describe("menu -- when success", () => {
    let deployment: DeploymentV2;

    beforeEach(() => {
      deployment = mockDeployments()[0];
      deployment.status = "success";
      deployment.detailsUrl = "/deployment/details";
      createWrapper({ deployment });
      openMenu(deployment.id);
    });

    test("should contain a publish button", () => {
      expect(
        wrapper.getByText("Publish").closest("button")!.getAttribute("disabled")
      ).toBe(null);
    });

    test("should contain a preview button", () => {
      expect(
        wrapper.getByText("Preview").closest("a")!.getAttribute("href")
      ).toBe("http://sample-project--36185651722.stormkit:8888");
    });

    test("should open the manifest modal", async () => {
      const scope = mockFetchManifest({
        appId: deployment.appId,
        deploymentId: deployment.id,
        response: {
          manifest: mockManifest({
            apiFiles: [{ fileName: "/index.html" }],
            cdnFiles: [],
          }),
        },
      });

      fireEvent.click(wrapper.getByText("Manifest"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      expect(wrapper.getByText(/Deployment manifest/)).toBeTruthy();
    });

    test("should have a link to runtime logs", () => {
      expect(wrapper.getByText("Runtime logs").getAttribute("href")).toBe(
        "/deployment/details/runtime-logs"
      );
    });

    test("should display delete button", async () => {
      fireEvent.click(wrapper.getByText("Delete"));

      expect(wrapper.getByText("Confirm action")).toBeTruthy();

      const scope = mockDeleteDeployment({
        appId: deployment.appId,
        deploymentId: deployment.id,
      });

      fireEvent.click(wrapper.getByText("Yes, continue"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      expect(setRefreshToken).toHaveBeenCalled();
    });
  });

  describe("menu -- when failed", () => {
    let deployment: DeploymentV2;

    beforeEach(() => {
      deployment = mockDeployments()[0];
      deployment.status = "failed";
      deployment.detailsUrl = "/deployment/details";
      createWrapper({ deployment });
      openMenu(deployment.id);
    });

    test("should have the preview button disabled", () => {
      expect(
        wrapper.getByText("Preview").closest("a")!.getAttribute("aria-disabled")
      ).toBe("true");
    });

    test("should have the manifest button disabled", () => {
      expect(
        wrapper
          .getByText("Manifest")
          .closest("button")!
          .getAttribute("disabled")
      ).toBe("");
    });

    test("should have the runtime logs button disabled", () => {
      expect(
        wrapper
          .getByText("Runtime logs")
          .closest("a")!
          .getAttribute("aria-disabled")
      ).toBe("true");
    });

    test("should display delete button", async () => {
      fireEvent.click(wrapper.getByText("Delete"));

      expect(wrapper.getByText("Confirm action")).toBeTruthy();

      const scope = mockDeleteDeployment({
        appId: deployment.appId,
        deploymentId: deployment.id,
      });

      fireEvent.click(wrapper.getByText("Yes, continue"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      expect(setRefreshToken).toHaveBeenCalled();
    });
  });

  describe("menu -- while running", () => {
    let deployment: DeploymentV2;

    beforeEach(() => {
      deployment = mockDeployments()[0];
      deployment.status = "running";
      deployment.detailsUrl = "/deployment/details";
      createWrapper({ deployment });
      openMenu(deployment.id);
    });

    test("should have the preview button disabled", () => {
      expect(
        wrapper.getByText("Preview").closest("a")!.getAttribute("aria-disabled")
      ).toBe("true");
    });

    test("should have the manifest button disabled", () => {
      expect(
        wrapper
          .getByText("Manifest")
          .closest("button")!
          .getAttribute("disabled")
      ).toBe("");
    });

    test("should have the runtime logs button disabled", () => {
      expect(
        wrapper
          .getByText("Runtime logs")
          .closest("a")!
          .getAttribute("aria-disabled")
      ).toBe("true");
    });

    test("should contain a view details button", () => {
      expect(wrapper.getByText("View details").getAttribute("href")).toBe(
        "/deployment/details"
      );
    });

    test("should display stop button", async () => {
      fireEvent.click(wrapper.getByText("Stop"));

      expect(wrapper.getByText("Confirm action")).toBeTruthy();

      const scope = mockStopDeployment({
        appId: deployment.appId,
        deploymentId: deployment.id,
      });

      fireEvent.click(wrapper.getByText("Yes, continue"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      expect(setRefreshToken).toHaveBeenCalled();
    });
  });
});
