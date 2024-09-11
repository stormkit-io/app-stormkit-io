import { MemoryRouter } from "react-router";
import { render, RenderResult } from "@testing-library/react";
import mockDeployments from "~/testing/data/mock_deployments_v2";
import CommitInfo from "./CommitInfo";

interface Props {
  deployment: DeploymentV2;
  showStatus?: boolean;
  showProject?: boolean;
  clickable?: boolean;
}

describe("~/shared/deployments/CommitInfo.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = ({
    deployment,
    showProject,
    clickable = true,
  }: Props) => {
    wrapper = render(
      <MemoryRouter>
        <CommitInfo
          deployment={deployment}
          showProject={showProject}
          clickable={clickable}
        />
      </MemoryRouter>
    );
  };

  test("should display information properly", () => {
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

  test("should not contain a link to deployments page when it's not clickable", () => {
    createWrapper({ deployment: mockDeployments()[0], clickable: false });

    expect(
      wrapper.getByText("chore: update packages").getAttribute("href")
    ).toBe(null);
  });

  test("should not display project when the showProject property is false", () => {
    createWrapper({ deployment: mockDeployments()[0], showProject: false });

    expect(() => wrapper.getByText("sample-project")).toThrow();
  });
});
