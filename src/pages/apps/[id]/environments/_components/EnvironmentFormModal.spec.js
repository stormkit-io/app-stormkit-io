import { waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

const fileName =
  "pages/apps/[id]/environments/_components/EnvironmentFormModal";

describe(fileName, () => {
  const path = `~/${fileName}`;
  let wrapper;

  describe("when environment object is empty - create mode", () => {
    let app;

    beforeEach(() => {
      app = data.mockApp();

      wrapper = withMockContext(path, {
        app,
        toggleModal: jest.fn(),
      });
    });

    test("should submit the form properly", async () => {
      const name = "staging";
      const environment = {
        appId: app.id,
        env: name,
        name,
        branch: "my-branch",
        autoPublish: true,
        domain: {
          verified: false,
        },
        build: {
          entry: "",
          distFolder: "",
          cmd: "npm run build",
          vars: {
            NODE_ENV: "development",
          },
        },
      };

      const scope = nocks.mockInsertEnvironment({ environment });

      // Add a new row
      fireEvent.click(wrapper.getByLabelText("Add new environment variable"));

      const envKey = wrapper.getByLabelText("Environment variable name 0");
      const envVal = wrapper.getByLabelText("Environment variable value 0");
      const buildCmd = wrapper.getByLabelText("Build command");

      userEvent.type(wrapper.getByLabelText("Environment name"), name);
      userEvent.type(wrapper.getByLabelText("Branch name"), environment.branch);
      userEvent.type(buildCmd, environment.build.cmd);
      userEvent.type(envKey, "NODE_ENV");
      userEvent.type(envVal, environment.build.vars.NODE_ENV);
      fireEvent.click(wrapper.getByText("Create environment"));

      await waitFor(() => {
        expect(wrapper.injectedProps.toggleModal).toHaveBeenCalled();
        expect(scope.isDone()).toBe(true);
      });
    });
  });

  describe("when production environment is provided", () => {
    let app;
    let environment;

    beforeEach(() => {
      app = data.mockApp();
      environment = data.mockEnvironments({ app })[0];

      nocks.mockFetchRepoType({
        appId: app.id,
        name: environment.env,
        response: { packageJson: true, type: "-" },
      });

      wrapper = withMockContext(path, {
        app,
        toggleModal: jest.fn(),
        environment,
      });
    });

    test("should submit the form properly", async () => {
      const scope = nocks.mockUpdateEnvironment({
        environment: {
          ...environment,
          branch: `${environment.branch}-new`,
        },
      });

      userEvent.type(wrapper.getByLabelText("Branch name"), "-new");
      fireEvent.click(wrapper.getByText("Update environment"));

      await waitFor(() => {
        expect(wrapper.injectedProps.toggleModal).toHaveBeenCalled();
        expect(scope.isDone()).toBe(true);
      });
    });

    test("delete button should not be available", () => {
      expect(() => wrapper.getByText("Delete")).toThrow();
    });
  });

  describe("when a non-production environment is provided", () => {
    let metaScope;
    let app;
    let environment;

    beforeEach(() => {
      app = data.mockApp();
      environment = data.mockEnvironments({ app })[1];
      metaScope = nocks.mockFetchRepoType({
        appId: app.id,
        name: environment.env,
        response: { packageJson: true, type: "-" },
      });

      wrapper = withMockContext({
        path,
        props: {
          app,
          toggleModal: jest.fn(),
          environment,
        },
      });
    });

    test("should be deletable", async () => {
      const scope = nocks.mockDeleteEnvironment({
        appId: app.id,
        env: environment.name,
      });

      fireEvent.click(wrapper.getByText("Delete"));

      expect(wrapper.injectedProps.confirmModal).toHaveBeenCalledWith(
        "This will completely remove the environment and all associated deployments.",
        { onConfirm: expect.any(Function) }
      );

      await waitFor(() => {
        expect(metaScope.isDone()).toBe(true);
        expect(scope.isDone()).toBe(true);
        expect(wrapper.getByText("Other")).toBeTruthy();
      });
    });
  });
});
