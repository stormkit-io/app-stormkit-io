import { waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

describe("pages/Apps/:id/Environments - EnvironmentFormModal", () => {
  const path = "~/pages/Apps/:id/Environments/_components/EnvironmentFormModal";
  let wrapper;

  describe("when environment object is empty", () => {
    beforeEach(() => {
      wrapper = withMockContext(path, {
        app: { id: "1" },
        toggleModal: jest.fn(),
      });
    });

    test("should submit the form properly", async () => {
      const scope = nocks.mockEnvironmentInsertionCall();
      const envKey = wrapper.getByLabelText("Environment variable name 0");
      const envVal = wrapper.getByLabelText("Environment variable value 0");
      const buildCmd = wrapper.getByLabelText("Build command");
      userEvent.type(wrapper.getByLabelText("Environment name"), "staging");
      userEvent.type(wrapper.getByLabelText("Branch name"), "my-branch");
      userEvent.type(buildCmd, "npm run build");
      userEvent.type(envKey, "NODE_ENV");
      userEvent.type(envVal, "development");
      fireEvent.click(wrapper.getByText("Create environment"));

      await waitFor(() => {
        expect(wrapper.injectedProps.toggleModal).toHaveBeenCalled();
        expect(scope.isDone()).toBe(true);
      });
    });
  });

  describe("when production environment is provided", () => {
    beforeEach(() => {
      wrapper = withMockContext(path, {
        app: { id: "1" },
        toggleModal: jest.fn(),
        environment: data.mockEnvironmentsResponse().envs[0],
      });
    });

    test("should submit the form properly", async () => {
      const scope = nocks.mockEnvironmentUpdateCall();

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

    beforeEach(() => {
      const environment = data.mockEnvironmentsResponse().envs[1];
      metaScope = nocks.mockMetaCall({ appId: "1", name: environment.env });
      wrapper = withMockContext(path, {
        app: { id: "1" },
        toggleModal: jest.fn(),
        environment,
      });
    });

    test("should be deletable", async () => {
      const scope = nocks.mockEnvironmentDeleteCall();
      fireEvent.click(wrapper.getByText("Delete"));

      expect(
        wrapper.injectedProps.confirmModal
      ).toHaveBeenCalledWith(
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
