import React from "react";
import { MemoryRouter } from "react-router";
import { render, RenderResult } from "@testing-library/react";
import mockApp from "~/testing/data/mock_app";
import mockDeployment from "~/testing/data/mock_deployment";
import mockEnvironment from "~/testing//data/mock_environment";
import CommitInfo from "./CommitInfo";

interface Props {
  showStatus?: boolean;
}

describe("~/apps/[id]/environments/[env-id]/deployments/_components/CommitInfo.tsx", () => {
  let wrapper: RenderResult;
  const app = mockApp();
  const env = mockEnvironment({ app });
  const deploy = mockDeployment({ appId: app.id, envId: env.id });

  const createWrapper = ({ showStatus = false }: Props = {}) => {
    wrapper = render(
      <MemoryRouter>
        <CommitInfo
          app={app}
          environment={env}
          deployment={deploy}
          showStatus={showStatus}
        />
      </MemoryRouter>
    );
  };

  test("should display information properly", () => {
    createWrapper();
    expect(wrapper.getByText("chore: bump version")).toBeTruthy();
    expect(wrapper.getByText("by John Doe")).toBeTruthy();
    expect(wrapper.getByText("main")).toBeTruthy();
    expect(wrapper.getByText("main")).toBeTruthy();
    expect(wrapper.getByText("Published: 100")).toBeTruthy();
    expect(() => wrapper.getByLabelText("Successful")).toThrow();
  });

  test("should display the status properly", () => {
    createWrapper({ showStatus: true });
    expect(wrapper.getByLabelText("Successful")).toBeTruthy();
  });
});
