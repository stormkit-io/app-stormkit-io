import router from "react-router";
import { waitFor } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

const fileName = "pages/apps/[id]/settings/_components/FormOutboundWebhooks";

describe(fileName, () => {
  const path = `~/${fileName}`;
  let app;
  let wrapper;
  let historySpy;

  beforeEach(() => {
    app = data.mockApp();

    historySpy = jest.fn();
    nocks.mockFetchOutboundWebhooks({ app, status: 200 });

    jest.spyOn(router, "useHistory").mockReturnValue({
      replace: historySpy,
    });

    wrapper = withMockContext(path, {
      app,
    });
  });

  test.skip("the button is at loading state initially", () => {
    expect(wrapper.getByText("Add new webhook").classList).toContain(
      "invisible"
    );

    expect(wrapper.getByLabelText("Add new webhook").innerHTML).toContain(
      "spinner"
    );
  });

  test.skip("the button is not at loading state when the query has loaded", async () => {
    await waitFor(() => {
      expect(wrapper.getByText("Add new webhook").classList).not.toContain(
        "invisible"
      );

      expect(wrapper.getByLabelText("Add new webhook").innerHTML).not.toContain(
        "spinner"
      );
    });
  });

  test.skip.each`
    description    | endpoint
    ${"short url"} | ${"https://discord.com/example/endpoint"}
    ${"long url"}  | ${"https://discord.com/api/webhooks/example/endpoint..."}
  `("lists the hooks: $description", async ({ endpoint }) => {
    await waitFor(() => {
      expect(wrapper.getByText(endpoint)).toBeTruthy();
    });
  });
});
