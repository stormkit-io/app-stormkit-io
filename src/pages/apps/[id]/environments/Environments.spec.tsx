import { fireEvent, RenderResult } from "@testing-library/react";
import React from "react";
import { waitFor, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AppContext } from "../App.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import Environments from "./Environments";

interface Props {
  app: App;
  envs: Environment[];
}

describe("~/pages/apps/[id]/environments/Environments.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnvs: Environment[];
  let setRefreshToken: jest.Mock;

  const createWrapper = ({ app, envs }: Props) => {
    setRefreshToken = jest.fn();

    wrapper = render(
      <MemoryRouter
        initialEntries={[{ pathname: `/apps/${app.id}/environments` }]}
        initialIndex={0}
      >
        <AppContext.Provider
          value={{ app: app, environments: envs, setRefreshToken }}
        >
          <Environments />
        </AppContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    currentApp = mockApp();
    currentEnvs = [mockEnvironment({ app: currentApp })];
    createWrapper({ app: currentApp, envs: currentEnvs });
  });

  test("should open modal to create a new environment", async () => {
    await waitFor(() => {
      expect(wrapper.getByText("New environment")).toBeTruthy();
    });

    fireEvent.click(wrapper.getByText("New environment"));

    await waitFor(() => {
      expect(wrapper.getByText("Create new environment")).toBeTruthy();
    });
  });

  test("should list environments", async () => {
    await waitFor(() => {
      expect(currentEnvs.length).toBe(1);
      currentEnvs.forEach(env => {
        expect(wrapper.getByText(env.branch)).toBeTruthy();
        expect(wrapper.getByText(env.name)).toBeTruthy();
        expect(wrapper.getAllByText(/Status/)).toBeTruthy();
        expect(wrapper.getAllByText(/Deployed successfully./)).toBeTruthy();
      });
    });
  });
});
