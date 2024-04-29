import { RenderResult, waitFor } from "@testing-library/react";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import { mockInsertEnvironment } from "~/testing/nocks/nock_environment";
import EnvironmentFormModal from "./EnvironmentFormModal";
import { MemoryRouter } from "react-router";

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

  const findCancelButton = () => wrapper.getByText("Cancel")?.closest("button");
  const findSaveButton = () => wrapper.getByText("Create")?.closest("button");
  const findNameInput = () => wrapper.getByLabelText("Environment name *");
  const findBranchInput = () => wrapper.getByLabelText("Environment branch *");

  const createWrapper = ({
    app,
    environment,
    onClose = () => {},
    setRefreshToken = () => {},
  }: WrapperProps) => {
    currentApp = app || mockApp();
    currentEnv = environment || mockEnvironment({ app: currentApp });

    wrapper = render(
      <MemoryRouter>
        <AppContext.Provider
          value={{
            app: currentApp,
            environments: [currentEnv],
            setRefreshToken,
          }}
        >
          <EnvironmentContext.Provider value={{ environment: currentEnv }}>
            <EnvironmentFormModal isOpen app={currentApp} onClose={onClose} />
          </EnvironmentContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );
  };

  const envData = ({ name, branch }: { name?: string; branch?: string }) => ({
    id: currentEnv.id,
    name: name || currentEnv.name,
    env: name || currentEnv.name,
    appId: currentApp.id,
    branch: branch || currentEnv.branch,
    autoPublish: true,
    autoDeploy: true,
    preview: currentEnv.preview,
    build: {
      cmd: "",
      distFolder: "",
      vars: {},
      previewLinks: false,
    },
  });

  test("should load the form properly", () => {
    createWrapper({});
    expect(findNameInput()).toBeTruthy();
    expect(findBranchInput()).toBeTruthy();
  });

  test("should handle closing the modal", () => {
    const onClose = jest.fn();
    createWrapper({ onClose });
    fireEvent.click(findCancelButton()!);
    expect(onClose).toHaveBeenCalled();
  });

  test("should handle form submission properly -- success", async () => {
    createWrapper({});
    const scope = mockInsertEnvironment({
      environment: envData({}),
    });

    await userEvent.type(findNameInput(), currentEnv.name);
    await userEvent.type(findBranchInput(), currentEnv.branch);
    await fireEvent.click(findSaveButton()!);

    Object.defineProperty(window, "location", {
      value: {
        assign: jest.fn(),
      },
    });

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });

    await waitFor(() => {
      expect(window.location.assign).toHaveBeenCalledWith(
        `/apps/${currentApp.id}/environments/${currentEnv.id}`
      );
    });
  });

  test("should handle form submission properly -- error", async () => {
    createWrapper({});
    const scope = mockInsertEnvironment({
      environment: envData({ name: "production", branch: "main" }),
      status: 400,
      response: {
        error: "Something went wrong",
      },
    });

    await userEvent.type(findNameInput(), "production");
    await userEvent.type(findBranchInput(), "main");
    await fireEvent.click(findSaveButton()!);

    Object.defineProperty(window, "location", {
      value: {
        assign: jest.fn(),
      },
    });

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });

    await waitFor(() => {
      expect(window.location.assign).not.toHaveBeenCalled();
      expect(wrapper.getByText("Something went wrong")).toBeTruthy();
    });
  });
});
