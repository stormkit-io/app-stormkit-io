import * as lib from "@testing-library/react";
import router from "react-router";
import nock from "nock";
import userEvent from "@testing-library/user-event";
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

  const executeDeployFlow = async ({
    id,
    status = 200,
    response = { ok: true, id },
  }) => {
    const scope = nock("http://localhost")
      .post("/app/deploy", {
        appId: `${app.id}`,
        env: "production",
        branch: "master",
        distFolder: "my-dist",
        cmd: "echo hi",
        publish: true,
      })
      .reply(status, response);

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

    const buildFolder = wrapper.getByLabelText("Build Folder");
    const branch = wrapper.getByLabelText("Branch to deploy");
    const cmd = wrapper.getByLabelText("Cmd to execute");
    expect(buildFolder.value).toBe("packages/console/dist");
    expect(branch.value).toBe("master");
    expect(cmd.value).toBe("yarn test && yarn run build:console");

    userEvent.clear(buildFolder);
    userEvent.clear(branch);
    userEvent.clear(cmd);
    userEvent.type(buildFolder, "my-dist");
    userEvent.type(branch, "master");
    userEvent.type(cmd, "echo hi");

    fireEvent.click(wrapper.getByText("Deploy now"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  };

  test.skip("clicking on deploy now should bring up a modal which the user can use to deploy", async () => {
    await executeDeployFlow({ id });

    await waitFor(() => {
      expect(historySpy).toHaveBeenCalledWith(
        `/apps/${app.id}/deployments/${id}`
      );
    });
  });

  test.skip("429 errors should display a payment error", async () => {
    await executeDeployFlow({
      id,
      status: 429,
      response: {
        error: "You have exceeded the maximum number of concurrent builds",
      },
    });

    await waitFor(() => {
      expect(historySpy).not.toHaveBeenCalled();
      expect(
        wrapper.getByText(
          /You have exceeded the maximum number of concurrent builds/
        )
      ).toBeTruthy();
    });
  });

  test.skip("Other errors should display a generic error", async () => {
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
