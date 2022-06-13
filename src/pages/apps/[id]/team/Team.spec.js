import { waitFor, fireEvent } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as nocks from "~/testing/nocks";
import * as data from "~/testing/data";

const fileName = "pages/apps/[id]/team";

describe(fileName, () => {
  const { user } = data.mockUserResponse();
  const app = { id: "1" };
  const path = `~/${fileName}`;
  let wrapper;

  describe("always", () => {
    beforeEach(() => {
      nocks.mockFetchMembersCall({ app });
      wrapper = withMockContext(path, {
        app: { ...app, userId: user.id },
        user,
        confirmModal: jest.fn(),
        toggleModal: jest.fn(),
        history: { replace: jest.fn() },
        location: {},
      });
    });

    test("should contain a button to click to invite a new member", async () => {
      expect(() =>
        wrapper.getByText(
          /Enter the username to invite your colleague to the team./
        )
      ).toThrow();

      fireEvent.click(wrapper.getByLabelText("Invite new member"));

      await waitFor(() => {
        expect(
          wrapper.getByText(
            /Enter the username to invite your colleague to the team./
          )
        ).toBeTruthy();
      });
    });
  });

  describe("when user is an admin", () => {
    let scope;

    beforeEach(() => {
      scope = nocks.mockFetchMembersCall({ app });
      wrapper = withMockContext(path, {
        app: { ...app, userId: user.id },
        user,
        confirmModal: jest.fn(),
        toggleModal: jest.fn(),
        history: { replace: jest.fn() },
        location: {},
      });
    });

    test("should display members list", async () => {
      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(wrapper.getByText("Foo Bar")).toBeTruthy();
        expect(wrapper.getByText("Voo Bar")).toBeTruthy();
      });
    });

    test("should not display a warning about roles but display the more settings button", async () => {
      await waitFor(() => {
        const warning =
          /In order to remove members from the team you'll need to have/;
        expect(scope.isDone()).toBe(true);
        expect(() => wrapper.getByText(warning)).toThrow();
        expect(wrapper.getByLabelText("More settings")).toBeTruthy();
      });
    });

    test("should be able to delete any member except the owner", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Voo Bar")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByLabelText("More settings"));
      fireEvent.click(wrapper.getByLabelText("Delete Voo Bar"));

      await waitFor(() => {
        expect(wrapper.injectedProps.confirmModal).toHaveBeenCalledWith(
          "Your are about to remove a member from this app. You will need to re-invite if the user needs access again.",
          { onConfirm: expect.any(Function) }
        );
      });
    });
  });

  describe("when user is not an admin", () => {
    let scope;

    beforeEach(() => {
      scope = nocks.mockFetchMembersCall({ app });
      wrapper = withMockContext(path, {
        app,
        user,
        isOpen: false,
        confirmModal: jest.fn(),
        toggleModal: jest.fn(),
        history: { replace: jest.fn() },
        location: {},
      });
    });

    test("should display members list", async () => {
      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(wrapper.getByText("Foo Bar")).toBeTruthy();
        expect(wrapper.getByText("Voo Bar")).toBeTruthy();
      });
    });

    test("should display a warning about roles and do not display the more settings button", async () => {
      await waitFor(() => {
        const warning =
          /In order to remove members from the team you'll need to have/;
        expect(scope.isDone()).toBe(true);
        expect(wrapper.getByText(warning)).toBeTruthy();
        expect(() => wrapper.getByLabelText("More settings")).toThrow();
      });
    });
  });
});
