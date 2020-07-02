import nock from "nock";
import { waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withAppContext } from "~/testing/helpers";
import * as data from "~/testing/data";

describe("pages/Apps/:id/Environments - EnvironmentFormModal", () => {
  let wrapper;

  const mockProxyCalls = (domains) => {
    domains.forEach((domain) => {
      nock("http://localhost")
        .post(`/app/proxy`, { appId: "1", url: `https://${domain}` })
        .reply(200, { status: 200 });
    });
  };

  const mockEnvsCall = () =>
    nock("http://localhost")
      .get(`/app/1/envs`)
      .reply(200, data.mockEnvironmentsResponse());

  const mockEnvironmentInsertionCall = () =>
    nock("http://localhost")
      .post(`/app/env`, {
        appId: "1",
        env: "staging",
        branch: "my-branch",
        build: {
          cmd: "npm run build",
          entry: "",
          distFolder: "",
          vars: { NODE_ENV: "development" },
        },
        autoPublish: true,
      })
      .reply(200, { status: 200 });

  const mockEnvironmentUpdateCall = () =>
    nock("http://localhost")
      .put(`/app/env`, {
        appId: "1",
        env: "production",
        branch: "master-new",
        build: {
          cmd: "yarn test && yarn run build:console",
          entry: "packages/console/server/renderer.js",
          distFolder: "packages/console/dist",
          vars: {
            BABEL_ENV: "production",
            NODE_ENV: "production",
          },
        },
        autoPublish: true,
      })
      .reply(200, { ok: true });

  const mockEnvironmentDeleteCall = () =>
    nock("http://localhost")
      .delete(`/app/env`, {
        appId: "1",
        env: "development",
      })
      .reply(200, { ok: true });

  describe("when on environments page", () => {
    const domains = ["app.stormkit.io", "app--development.stormkit.dev"];
    let scope;

    beforeEach(() => {
      mockProxyCalls(domains);

      wrapper = withAppContext({
        app: data.mockAppResponse(),
        envs: data.mockEnvironmentsResponse(),
        path: "/apps/1/environments",
      });

      mockEnvironmentInsertionCall();
      mockProxyCalls(domains);
      scope = mockEnvsCall();
    });

    test("should open the form modal in insert mode and send a post request upon submit", async () => {
      await waitFor(() => {
        fireEvent.click(wrapper.getByLabelText("Insert environment"));
      });

      await waitFor(() => {
        expect(wrapper.getByText("Environment details"));
      });

      const envKey = wrapper.getByLabelText("Environment variable name 0");
      const envVal = wrapper.getByLabelText("Environment variable value 0");
      const buildCmd = wrapper.getByLabelText("Build command");
      userEvent.type(wrapper.getByLabelText("Environment name"), "staging");
      userEvent.type(wrapper.getByLabelText("Branch name"), "my-branch");
      userEvent.type(buildCmd, "npm run build");
      userEvent.type(envKey, "NODE_ENV");
      userEvent.type(envVal, "development");

      fireEvent.click(wrapper.getByText("Create environment"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      expect(() => wrapper.getByText("Environment details")).toThrow();

      await waitFor(() => {
        expect(wrapper.getByText(domains[1])).toBeTruthy();
      });
    });
  });

  describe("when on a single environment page", () => {
    const domains = ["app.stormkit.io"];
    let scope;

    beforeEach(() => {
      mockProxyCalls(domains);

      wrapper = withAppContext({
        app: data.mockAppResponse(),
        envs: data.mockEnvironmentsResponse(),
        path: "/apps/1/environments/1429333243019",
      });

      mockEnvironmentUpdateCall();
      mockProxyCalls(domains);
      scope = mockEnvsCall();
    });

    test("should open the form modal in edit mode and send a put request upon submit", async () => {
      await waitFor(() => {
        fireEvent.click(wrapper.getByLabelText("Update environment"));
      });

      await waitFor(() => {
        expect(wrapper.getByText("Environment details"));
      });

      userEvent.type(wrapper.getByLabelText("Branch name"), "-new");
      fireEvent.click(wrapper.getByText("Update environment"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });

      expect(() => wrapper.getByText("Environment details")).toThrow();

      await waitFor(() => {
        expect(wrapper.getByText(domains[0])).toBeTruthy();
      });
    });
  });

  describe("when on a single non-production environment page", () => {
    const domains = ["app--development.stormkit.dev"];
    let scope;

    beforeEach(() => {
      mockProxyCalls(domains);

      wrapper = withAppContext({
        app: data.mockAppResponse(),
        envs: data.mockEnvironmentsResponse(),
        path: "/apps/1/environments/863521234275",
      });

      mockEnvironmentDeleteCall();
      mockProxyCalls(["app.stormkit.io", ...domains]); // This is because the mock env call still returns all environments but in reality they should be deleted.
      scope = mockEnvsCall();
    });

    test("should open the form modal in edit mode and send a delete request upon submit", async () => {
      await waitFor(() => {
        fireEvent.click(wrapper.getByLabelText("Update environment"));
      });

      await waitFor(() => {
        expect(wrapper.getByText("Environment details"));
      });

      fireEvent.click(wrapper.getByLabelText("Delete environment"));

      await waitFor(() => {
        expect(
          wrapper.getByText(
            "This will completely the environment and all associated deployments."
          )
        );
      });

      fireEvent.click(wrapper.getByText("Yes, continue"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });
    });
  });
});
