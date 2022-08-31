import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";

const fileName = "pages/apps/_components/AppHeader";

describe(fileName, () => {
  let wrapper;
  let app;
  let envs;

  beforeEach(() => {
    app = data.mockApp();
    envs = data.mockEnvironments({ app });

    wrapper = withMockContext({
      path: `~/${fileName}`,
      props: {
        app,
        environments: envs,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test.skip("Should render the app repo as a link", () => {
    const el = wrapper.getByLabelText("Repository URL");
    const url = "https://gitlab.com/stormkit-io/frontend";

    expect(el.innerHTML).toBe("gitlab/stormkit-io/frontend");
    expect(el.getAttribute("href")).toEqual(url);
  });
});
