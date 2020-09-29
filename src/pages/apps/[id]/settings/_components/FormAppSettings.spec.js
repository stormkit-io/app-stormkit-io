import { waitFor, fireEvent } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

const fileName = "pages/apps/[id]/settings/_components/FormAppSettings";

describe(fileName, () => {
  const path = `~/${fileName}`;
  let app;
  let wrapper;

  beforeEach(() => {
    app = data.mockAppResponse();
    wrapper = withMockContext(path, {
      app,
      environments: data.mockEnvironmentsResponse().envs,
      additionalSettings: data.mockAdditionalSettingsResponse(),
      history: { replace: jest.fn() },
      location: {
        state: { settingsSuccess: "Your app has been saved successfully." },
      },
    });
  });

  test("have the form prefilled", async () => {
    await waitFor(() => {
      expect(wrapper.getByLabelText("Display name").value).toBe(
        app.displayName
      );
      expect(wrapper.getByLabelText("Repository").value).toBe(
        "gitlab.com:stormkit-io/frontend.git"
      );
      expect(wrapper.getByLabelText("Runtime").innerHTML).toBe("NodeJS 12.x");
      expect(wrapper.getByLabelText("Auto deploy").innerHTML).toBe(
        "On pull request"
      );
    });
  });

  test("updates the settings", async () => {
    const scope = nocks.mockUpdateSettingsCall({
      payload: {
        appId: app.id,
        displayName: app.displayName,
        repo: app.repo,
        autoDeploy: app.autoDeploy,
        runtime: "nodejs12.x",
        defaultEnv: app.defaultEnv,
        commitPrefix: app.commitPrefix,
      },
    });

    // Wait till the app has been loaded
    await waitFor(() => {
      expect(wrapper.getByLabelText("Display name").value).toBe(
        app.displayName
      );
    });

    fireEvent.click(wrapper.getByText("Update"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.injectedProps.history.replace).toHaveBeenCalledWith({
        state: expect.objectContaining({
          app: expect.any(Number),
          settingsSuccess: "Your app has been updated successfully.",
        }),
      });
    });
  });

  test("success message is displayed properly", () => {
    const toaster = wrapper.getByText("Your app has been saved successfully.");

    expect(toaster).toBeTruthy();
    expect(toaster.parentNode.className).toContain("infobox-toaster");
  });
});
