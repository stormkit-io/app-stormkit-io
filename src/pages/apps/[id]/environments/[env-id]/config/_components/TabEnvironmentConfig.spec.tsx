import { RenderResult, waitFor } from "@testing-library/react";
import { Scope } from "nock/types";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";
import {
  mockUpdateEnvironment,
  mockFetchRepoMeta,
} from "~/testing/nocks/nock_environment";
import TabEnvironmentConfig from "./TabEnvironmentConfig";

interface WrapperProps {
  app?: App;
  environments?: Environment[];
  setRefreshToken?: () => void;
}

describe("~/pages/apps/[id]/environments/[env-id]/config/_components/TabEnvironmentConfig.tsx", () => {
  let fetchRepoMetaScope: Scope;
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let currentEnvs: Environment[];

  const findSaveButton = () => wrapper.getByText("Save")?.closest("button");

  const createWrapper = ({
    app,
    environments,
    setRefreshToken = () => {},
  }: WrapperProps) => {
    currentApp = app || mockApp();
    currentEnvs = environments || mockEnvironments({ app: currentApp });
    currentEnv = currentEnvs[0];

    fetchRepoMetaScope = mockFetchRepoMeta({
      appId: currentApp.id,
      name: currentEnv.name,
    });

    wrapper = render(
      <TabEnvironmentConfig
        app={currentApp}
        environment={currentEnv}
        setRefreshToken={setRefreshToken}
      />
    );
  };

  const originalScrollIntoView = Element.prototype.scrollIntoView;

  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    Element.prototype.scrollIntoView = originalScrollIntoView;
  });

  test("should fetch the repo meta", async () => {
    createWrapper({});

    await waitFor(() => {
      expect(fetchRepoMetaScope.isDone()).toBe(true);
    });
  });

  test("should load the form properly", () => {
    createWrapper({});
    expect(wrapper.getByLabelText("Branch")).toBeTruthy();
    expect(wrapper.getByDisplayValue("master")).toBeTruthy();

    expect(wrapper.getByLabelText("Name")).toBeTruthy();

    // There are multiple due to env vars, so use findAll.
    expect(wrapper.getAllByDisplayValue("production")).toBeTruthy();
  });

  test("should handle form submission properly", async () => {
    createWrapper({});
    const scope = mockUpdateEnvironment({ environment: currentEnv });

    expect(findSaveButton()?.getAttribute("disabled")).toBe("");

    // Trigger a change event to activate the button
    const branchInput = wrapper.getByLabelText("Branch");
    await userEvent.type(branchInput, "staging");
    await userEvent.clear(branchInput);
    await userEvent.type(branchInput, currentEnv.branch);
    expect(findSaveButton()?.getAttribute("disabled")).toBe(null);
    await fireEvent.click(findSaveButton()!);

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(findSaveButton()?.getAttribute("disabled")).toBe("");
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });
});
