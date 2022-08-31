import { waitFor, fireEvent } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";

const fileName = "pages/apps/[id]/settings/_components/FormDangerZone";

describe(fileName, () => {
  const path = `~/${fileName}`;
  let app;
  let wrapper;

  beforeEach(() => {
    app = data.mockApp();

    wrapper = withMockContext(path, {
      app,
    });
  });

  test.skip("displays a warning message", async () => {
    await waitFor(() => {
      expect(
        wrapper.getByText(/Deleting an application will remove/)
      ).toBeTruthy();
    });
  });

  test.skip("clicking Remove application should call the confirm action", () => {
    fireEvent.click(wrapper.getByText("Remove application"));

    const message =
      "This will completely remove the application. All associated files and endpoints will be gone. Remember there is no going back from here.";

    expect(wrapper.injectedProps.confirmModal).toHaveBeenCalledWith(message, {
      onConfirm: expect.any(Function),
      typeConfirmationText: "permanently delete application",
    });
  });
});
