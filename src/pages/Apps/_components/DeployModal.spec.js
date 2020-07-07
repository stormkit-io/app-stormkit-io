import * as lib from "@testing-library/react";
import nock from "nock";
import { withAppContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

const { waitFor, fireEvent, getByText, within } = lib;

describe("pages/Apps", () => {
  let wrapper;
  let app;
  const id = "412341"; // deploy id

  beforeEach(() => {
    app = data.mockAppResponse();
    const envs = data.mockEnvironmentsResponse();
    nocks.mockAppProxy({ app, envs: envs.envs });

    wrapper = withAppContext({
      app,
      envs: envs,
      path: "/apps/1",
    });
  });

  afterEach(() => {
    wrapper.unmount();
    wrapper = null;
  });

  const executeDeployFlow = async ({ id, status = 200 }) => {
    const scope = nock("http://localhost")
      .post("/app/deploy", {
        appId: `${app.id}`,
        env: "production",
        branch: "master",
      })
      .reply(status, { ok: true, id });

    let deployNow;

    await waitFor(() => {
      deployNow = wrapper.getByText("Deploy now");
    });

    fireEvent.click(deployNow);

    await waitFor(() => {
      expect(getByText(document.body, "Start a deployment")).toBeTruthy();
    });

    await waitFor(() => {
      const selector = wrapper.getByLabelText(
        "Select an environment to deploy"
      );
      expect(selector).toBeTruthy();
      fireEvent.mouseDown(selector);
    });

    await waitFor(() => {
      const option = getByText(document.body, "(app.stormkit.io)");
      fireEvent.click(option);
    });

    expect(
      wrapper.getByText(
        "This environment has Auto Publish turned on. This deployment will be published if it is successful."
      )
    ).toBeTruthy();

    document.body.querySelector("[name=branch]").value = "master";

    fireEvent.click(
      within(document.body.querySelector(".modal-overlay")).getByText(
        "Deploy now"
      )
    );

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  };

  test("clicking on deploy now should bring up a modal which the user can use to deploy", async () => {
    await executeDeployFlow({ id });

    await waitFor(() => {
      expect(wrapper.history.entries[1].pathname).toBe(
        `/apps/${app.id}/deployments/${id}`
      );
    });
  });

  test("429 errors should display a payment error", async () => {
    await executeDeployFlow({ id, status: 429 });

    await waitFor(() => {
      expect(wrapper.history.entries[1]).toBeUndefined();
      expect(
        wrapper.getByText(
          /You have exceeded the maximum number of concurrent builds/
        )
      ).toBeTruthy();
    });
  });

  test("Other errors should display a generic error", async () => {
    await executeDeployFlow({ id, status: 400 });

    await waitFor(() => {
      expect(wrapper.history.entries[1]).toBeUndefined();
      expect(
        wrapper.getByText(
          /Something wrong happened here. Please contact us at hello@stormkit.io/
        )
      ).toBeTruthy();
    });
  });
});
