import type { RenderResult } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import { mockUpsertFeatureFlags } from "~/testing/nocks/nock_feature_flags";
import FeatureFlagModal from "./FeatureFlagModal";

interface Props {
  app: App;
  env: Environment;
}

describe("~/pages/apps/[id]/environments/[env-id]/feature-flags/FeatureFlags.spec.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let closeModal: Mock;
  let setReload: Mock;

  const createWrapper = ({ app, env }: Props) => {
    setReload = vi.fn();
    closeModal = vi.fn();

    wrapper = render(
      <FeatureFlagModal
        app={app}
        environment={env}
        closeModal={closeModal}
        setReload={setReload}
      />
    );
  };

  beforeEach(() => {
    currentApp = mockApp();
    currentEnv = mockEnvironment({ app: currentApp });
    createWrapper({ app: currentApp, env: currentEnv });
  });

  it("should insert a feature flag", async () => {
    const scope = mockUpsertFeatureFlags({
      appId: currentApp.id,
      envId: currentEnv.id!,
      flagName: "myFeatureFlag",
      flagValue: false,
    });

    expect(wrapper.getByText("Create feature flag")).toBeTruthy();

    await userEvent.type(wrapper.getByLabelText("Flag name"), "myFeatureFlag");
    await fireEvent.click(wrapper.getByText("Create"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  });
});
