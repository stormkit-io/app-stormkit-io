import { waitFor } from "@testing-library/react";
import nock from "nock";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";

const fileName = "pages/apps/[id]/environments/Environments"

describe(fileName, () => {
  let wrapper;
  let envs;
  const path = `~/${fileName}`;
  const domains = ["app.stormkit.io", "app--development.stormkit.dev"];

  domains.forEach((domain) => {
    nock("http://localhost")
      .post(`/app/proxy`, { appId: "1", url: `https://${domain}` })
      .reply(200, { status: 200 });
  });

  beforeEach(() => {
    const app = data.mockApp();
    envs = data.mockEnvironments({ app });

    wrapper = withMockContext({
      path,
      props: {
        app,
        environments: envs,
      }
    });
  });

  test("should list environments", async () => {
    await waitFor(() => {
      envs.forEach((env) => {
        expect(wrapper.getByText(env.branch)).toBeTruthy();
        expect(wrapper.getByText(env.env)).toBeTruthy();
        expect(wrapper.getAllByText(/Status/)).toBeTruthy();
        expect(wrapper.getAllByText(/200/)).toBeTruthy();
      });

      domains.forEach((domain) => {
        expect(wrapper.getByText(domain)).toBeTruthy();
      });
    });
  });
});
