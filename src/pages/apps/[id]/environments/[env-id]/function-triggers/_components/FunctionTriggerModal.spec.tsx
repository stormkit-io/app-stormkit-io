import type { RenderResult } from "@testing-library/react";
import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import mockApp from "~/testing/data/mock_app";
import mockFunctionTriggers from "~/testing/data/mock_function_triggers";
import mockEnvironment from "~/testing//data/mock_environment";
import * as mockActions from "~/testing/nocks/nock_function_triggers";
import FunctionTriggerModal from "./FunctionTriggerModal";

jest.mock("@codemirror/lang-json", () => ({ json: jest.fn() }));
jest.mock("@uiw/react-codemirror", () => ({ value }: { value: string }) => (
  <>{value}</>
));

interface Props {
  app?: App;
  environment?: Environment;
  trigger?: FunctionTrigger;
}

describe("~/apps/[id]/environments/[env-id]/function-triggers/_components/FunctionTriggerModal.tsx", () => {
  let wrapper: RenderResult;
  let history: History;
  let currentApp: App;
  let currentEnv: Environment;
  let closeModal: jest.Func;
  let successHandler: jest.Func;

  const createWrapper = ({ app, environment, trigger }: Props = {}) => {
    currentApp = app || mockApp();
    currentEnv = environment || mockEnvironment({ app: currentApp });
    closeModal = jest.fn();
    successHandler = jest.fn();

    if (trigger) {
      currentEnv.getDomainName = () =>
        trigger.options.url.split("/api")[0].replace("https://", "");
    }

    history = createMemoryHistory();
    wrapper = render(
      <Router navigator={history} location={history.location}>
        <FunctionTriggerModal
          triggerFunction={trigger}
          onSuccess={successHandler}
          closeModal={closeModal}
          app={currentApp}
          environment={currentEnv}
        />
      </Router>
    );
  };

  test("should update a given trigger", async () => {
    const trigger = mockFunctionTriggers()[0];
    createWrapper({ trigger });

    const scope = mockActions.mockUpdateFunctionTrigger({
      tfid: trigger.id!,
      appId: currentApp.id,
      status: trigger.status,
      options: trigger.options,
      cron: "1 * * * *",
    });

    const cronInput = wrapper.getByLabelText("Cron");

    await userEvent.clear(cronInput);
    await userEvent.type(cronInput, "1 * * * *");
    await fireEvent.click(wrapper.getByText("Update"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(successHandler).toHaveBeenCalled();
    });
  });

  test("should create a new trigger", async () => {
    createWrapper();

    const scope = mockActions.mockCreateFunctionTrigger({
      appId: currentApp.id,
      envId: currentEnv.id!,
      status: false,
      options: {
        url: "https://app.stormkit.io/api/test",
        method: "GET",
        headers: "",
        payload: "",
      },
      cron: "1 * * * *",
    });

    await userEvent.type(wrapper.getByLabelText("Cron"), "1 * * * *");
    await userEvent.type(wrapper.getByLabelText(/Url/), "test");
    await fireEvent.click(wrapper.getByText("Create"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(successHandler).toHaveBeenCalled();
    });
  });
});
