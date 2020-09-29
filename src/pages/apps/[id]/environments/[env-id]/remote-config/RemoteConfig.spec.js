import { waitFor, fireEvent } from "@testing-library/react";
import nock from "nock";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";

const fileName = "pages/apps/[id]/environments/[env-id]/remote-config";

describe(fileName, () => {
  let wrapper;
  let toggleModal;

  const config = data.mockRemoteConfigResponse();
  const envs = data.mockEnvironmentsResponse();
  const app = data.mockAppResponse();
  const env = envs.envs[0];

  beforeEach(() => {
    toggleModal = jest.fn();

    nock("http://localhost")
      .get(`/app/${app.id}/envs/${env.env}/remote-config`)
      .reply(200, config);

    wrapper = withMockContext(`~/${fileName}`, {
      app,
      environment: env,
      toggleModal,
      location: {},
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

  test("should delete parameter when delete button is clicked", async () => {
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

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  });
});
