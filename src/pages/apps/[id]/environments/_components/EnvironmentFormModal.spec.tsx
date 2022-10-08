import { RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import { mockInsertEnvironment } from "~/testing/nocks/nock_environment";
import EnvironmentFormModal from "./EnvironmentFormModal";

interface WrapperProps {
  app?: App;
  environment?: Environment;
  onClose?: () => void;
  setRefreshToken?: () => void;
}

describe("~/pages/apps/[id]/environments/[env-id]/config/EnvironmentFormModal.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;

  const findSaveButton = () => wrapper.getByText("Save")?.closest("button");

  const createWrapper = ({
    app,
    environment,
    onClose = () => {},
    setRefreshToken = () => {},
  }: WrapperProps) => {
    currentApp = app || mockApp();
    currentEnv = environment || mockEnvironment({ app: currentApp });

    wrapper = render(
      <AppContext.Provider
        value={{ app: currentApp, environments: [currentEnv], setRefreshToken }}
      >
        <EnvironmentContext.Provider value={{ environment: currentEnv }}>
          <EnvironmentFormModal isOpen app={currentApp} onClose={onClose} />
        </EnvironmentContext.Provider>
      </AppContext.Provider>
    );
  };

  const originalScrollIntoView = Element.prototype.scrollIntoView;

  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    Element.prototype.scrollIntoView = originalScrollIntoView;
  });

  test("should load the form properly", () => {
    createWrapper({});
    expect(wrapper.getByLabelText("Branch")).toBeTruthy();
    expect(wrapper.getByLabelText("Name")).toBeTruthy();
  });

  test("should handle form submission properly", async () => {
    createWrapper({});
    const scope = mockInsertEnvironment({ environment: currentEnv });

    expect(findSaveButton()?.getAttribute("disabled")).toBe("");

    // Trigger a change event to activate the button
    await userEvent.type(wrapper.getByLabelText("Name"), currentEnv.name);
    await userEvent.type(wrapper.getByLabelText("Branch"), currentEnv.branch);
    await fireEvent.mouseDown(wrapper.getByText("All branches"));
    await fireEvent.click(wrapper.getByText("Disabled"));
    await fireEvent.click(wrapper.getByLabelText("Auto publish"));
    await userEvent.type(
      wrapper.getByLabelText("Build command"),
      "yarn test && yarn run build:console"
    );
    await userEvent.type(
      wrapper.getByLabelText("Output folder"),
      "packages/console/dist"
    );

    // Delete first and only environment variable
    await fireEvent.click(
      wrapper.getByLabelText("Remove build.vars row number 1")
    );

    // Add first env variable
    await userEvent.type(
      wrapper.getByLabelText("build.vars key number 1"),
      "BABEL_ENV"
    );

    await userEvent.clear(wrapper.getByLabelText("build.vars value number 1"));

    await userEvent.type(
      wrapper.getByLabelText("build.vars value number 1"),
      currentEnv.build.vars["BABEL_ENV"]
    );

    // Add a new row
    await fireEvent.click(wrapper.getByText("add row"));

    // Add second env variable
    await userEvent.clear(wrapper.getByLabelText("build.vars key number 2"));

    await userEvent.type(
      wrapper.getByLabelText("build.vars key number 2"),
      "NODE_ENV"
    );

    await userEvent.clear(wrapper.getByLabelText("build.vars value number 2"));

    await userEvent.type(
      wrapper.getByLabelText("build.vars value number 2"),
      currentEnv.build.vars["NODE_ENV"]
    );

    expect(findSaveButton()?.getAttribute("disabled")).toBe(null);
    await fireEvent.click(findSaveButton()!);

    Object.defineProperty(window, "location", {
      value: {
        assign: jest.fn(),
      },
    });

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(findSaveButton()?.getAttribute("disabled")).toBe("");
    });

    await waitFor(() => {
      expect(window.location.assign).toHaveBeenCalledWith(
        `/apps/${currentApp.id}/environments/${currentEnv.id}/deployments`
      );
    });
  });
});
