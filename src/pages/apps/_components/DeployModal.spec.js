import * as lib from "@testing-library/react";
import router from "react-router";
import nock from "nock";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";

const { waitFor, fireEvent, getByText } = lib;
const fileName = "pages/apps/_components/DeployModal";

describe(fileName, () => {
  let wrapper;
  let app;
  let envs;
  let historySpy;
  const id = "412341"; // deploy id

  beforeEach(() => {
    app = data.mockApp();
    envs = data.mockEnvironments({ app });

    historySpy = jest.fn();

    jest.spyOn(router, "useHistory").mockReturnValue({
      push: historySpy,
    });

    wrapper = withMockContext({
      path: `~/${fileName}`,
      props: {
        app,
        environments: envs,
        toggleModal: (v, cb) => {
          !v && cb();
        },
      },
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

    fireEvent.click(wrapper.getByText("Deploy now"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  };

  test("clicking on deploy now should bring up a modal which the user can use to deploy", async () => {
    await executeDeployFlow({ id });

    await waitFor(() => {
      expect(historySpy).toHaveBeenCalledWith(
        `/apps/${app.id}/deployments/${id}`
      );
    });
  });

  test("429 errors should display a payment error", async () => {
    await executeDeployFlow({ id, status: 429 });

    await waitFor(() => {
      expect(historySpy).not.toHaveBeenCalled();
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
      expect(historySpy).not.toHaveBeenCalled();
      expect(
        wrapper.getByText(
          /Something wrong happened here. Please contact us at hello@stormkit.io/
        )
      ).toBeTruthy();
    });
  });
});
