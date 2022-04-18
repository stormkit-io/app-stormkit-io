import * as lib from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";

const { waitFor, fireEvent, getByText } = lib;
const fileName = "pages/apps/_components/WelcomeModal";

describe(fileName, () => {
  let wrapper;
  const welcomeModalId = "welcome_modal";
  const id = "412341"; // deploy id

  afterEach(() => {
    wrapper.unmount();
  });

  describe("when is open for the first time", () => {
    beforeEach(() => {
      wrapper = withMockContext({
        path: `~/${fileName}`,
        props: {
          isOpen: true,
          welcomeModalId,
          toggleModal: jest.fn(),
        },
      });
    });

    test.each`
      text
      ${"Welcome to Stormkit 🎉"}
      ${"Join our Discord community"}
      ${"Follow us on Twitter"}
    `("should display the text: $text", ({ text }) => {
      expect(wrapper.getByText(text)).toBeTruthy();
    });
  });
});
