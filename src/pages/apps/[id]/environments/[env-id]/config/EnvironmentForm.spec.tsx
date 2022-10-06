import { RenderResult, waitFor } from "@testing-library/react";
import { Scope } from "nock/types";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import { mockFetchRepoMeta } from "~/testing/nocks/nock_environment";
import EnvironmentForm, { FormHandlerProps } from "./EnvironmentForm";

interface WrapperProps {
  app: App;
  env?: Environment;
  formHandler: (props: FormHandlerProps) => void;
}

describe("~/pages/apps/[id]/environments/[env-id]/config/EnvironmentForm.tsx", () => {
  let fetchRepoMetaScope: Scope;
  let wrapper: RenderResult;
  const findSaveButton = () => wrapper.getByText("Save")?.closest("button");

  const createWrapper = ({ app, env, formHandler }: WrapperProps) => {
    if (env) {
      fetchRepoMetaScope = mockFetchRepoMeta({
        appId: app.id,
        name: env?.name,
      });
    }

    wrapper = render(
      <EnvironmentForm app={app} environment={env} formHandler={formHandler} />
    );
  };

  describe("edit mode", () => {
    let formHandler: jest.Mock;
    let app: App;
    let env: Environment;

    beforeEach(() => {
      formHandler = jest.fn();
      app = mockApp();
      env = mockEnvironment({ app });
      createWrapper({ app, env, formHandler });
    });

    test("should fetch the repo meta", async () => {
      await waitFor(() => {
        expect(fetchRepoMetaScope.isDone()).toBe(true);
      });
    });

    test("should load the form properly", () => {
      expect(wrapper.getByLabelText("Branch")).toBeTruthy();
      expect(wrapper.getByDisplayValue("master")).toBeTruthy();

      expect(wrapper.getByLabelText("Name")).toBeTruthy();

      // There are multiple due to env vars, so use findAll.
      expect(wrapper.getAllByDisplayValue("production")).toBeTruthy();
    });

    test("should handle form submission properly", async () => {
      expect(findSaveButton()?.getAttribute("disabled")).toBe("");

      // Trigger a change event to activate the button
      const branchInput = wrapper.getByLabelText("Branch");
      await userEvent.type(branchInput, "staging");
      await userEvent.clear(branchInput);
      await userEvent.type(branchInput, env.branch);
      expect(findSaveButton()?.getAttribute("disabled")).toBe(null);
      await fireEvent.click(findSaveButton()!);

      await waitFor(() => {
        expect(formHandler).toHaveBeenCalled();
        expect(findSaveButton()?.getAttribute("disabled")).toBe("");
      });
    });
  });

  describe("create mode", () => {
    let formHandler: jest.Mock;
    let app: App;

    beforeEach(() => {
      formHandler = jest.fn();
      app = mockApp();
      createWrapper({ app, formHandler });
    });

    test("should handle form submission properly", async () => {
      expect(findSaveButton()?.getAttribute("disabled")).toBe("");

      // Trigger a change event to activate the button
      await userEvent.type(wrapper.getByLabelText("Name"), "development");
      await userEvent.type(wrapper.getByLabelText("Branch"), "test");
      expect(findSaveButton()?.getAttribute("disabled")).toBe(null);
      await fireEvent.click(findSaveButton()!);

      await waitFor(() => {
        expect(findSaveButton()?.getAttribute("disabled")).toBe("");
        expect(formHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            setError: expect.any(Function),
            setLoading: expect.any(Function),
            setSuccess: expect.any(Function),
            values: {
              autoDeploy: "all",
              autoPublish: false,
              branch: "test",
              name: "development",
            },
          })
        );
      });
    });
  });
});
