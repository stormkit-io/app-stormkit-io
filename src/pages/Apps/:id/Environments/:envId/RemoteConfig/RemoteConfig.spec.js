import { waitFor, act, fireEvent } from "@testing-library/react";
import nock from "nock";
import { withAppContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

describe("pages/Apps/:id/Environments", () => {
  let wrapper;
  const config = data.mockRemoteConfigResponse();
  const envs = data.mockEnvironmentsResponse();
  const app = data.mockAppResponse();
  const env = envs.envs[0];

  beforeEach(() => {
    nocks.appProxy({ app, envs: envs.envs });

    nock("http://localhost")
      .get(`/app/${app.id}/envs/${env.env}/remote-config`)
      .reply(200, config);

    act(() => {
      wrapper = withAppContext({
        app,
        envs,
        path: `/apps/${app.id}/environments/${env.id}/remote-config`,
      });
    });
  });

  test("should fetch the config with a loading state", async () => {
    await waitFor(() => {
      expect(wrapper.getByTestId("remote-config-spinner")).toBeDefined();
    });

    await waitFor(() => {
      expect(wrapper.getByText("bannerPromo")).toBeDefined();
      expect(wrapper.getByText("Experiment ID: 4308439284039")).toBeDefined();
      expect(wrapper.getByText("survey")).toBeDefined();
      expect(() => wrapper.getByTestId("remote-config-spinner")).toThrow();
    });
  });

  test("should be able to delete the parameter", async () => {
    const configToBeSent = { ...data.mockRemoteConfigResponse().config };
    delete configToBeSent.bannerPromo;

    const scope = nock("http://localhost")
      .put(`/app/env/remote-config`, {
        appId: app.id,
        env: env.env,
        config: configToBeSent,
      })
      .reply(200, { ok: true });

    await waitFor(() => {
      expect(wrapper.getByText("bannerPromo")).toBeDefined();
    });

    fireEvent.click(wrapper.getAllByLabelText("Expand options")[0]);
    fireEvent.click(wrapper.getByLabelText("Delete parameter"));

    expect(wrapper.getByText("Confirm action")).toBeDefined();
    expect(wrapper.getByText("Yes, continue")).toBeDefined();

    fireEvent.click(wrapper.getByText("Yes, continue"));
    expect(scope.isDone()).toBe(true);
  });
});
