import type { RenderResult } from "@testing-library/react";
import type { Member } from "./actions";
import React from "react";
import { waitFor, fireEvent, render } from "@testing-library/react";
import { AuthContext } from "~/pages/auth/Auth.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { mockFetchMembers, mockDeleteMember } from "~/testing/nocks/nock_team";
import Team from "./Team";
import mockApp from "~/testing/data/mock_app";
import mockUser from "~/testing/data/mock_user";
import mockTeamMembers from "~/testing/data/mock_team_members";

interface Props {
  user: User;
  app: App;
}

describe("~/pages/apps/[id]/team/Team.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentUser: User;

  const createWrapper = ({ user, app }: Props) => {
    wrapper = render(
      <AuthContext.Provider value={{ user }}>
        <AppContext.Provider
          value={{ app, setRefreshToken: jest.fn(), environments: [] }}
        >
          <Team />
        </AppContext.Provider>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: {
        search: "",
        assign: jest.fn(),
        reload: jest.fn(),
      },
    });
  });

  describe("always", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentUser = mockUser();
      mockFetchMembers({
        appId: currentApp.id,
        response: {
          members: mockTeamMembers({ appId: currentApp.id }),
        },
      });

      createWrapper({ app: currentApp, user: currentUser });
    });

    test("should contain a button to click to invite a new member", async () => {
      expect(() =>
        wrapper.getByText(
          /Enter the username to invite your colleague to the team./
        )
      ).toThrow();

      fireEvent.click(wrapper.getByText("Invite new member"));

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
    let members: Member[];

    beforeEach(() => {
      currentApp = mockApp();
      currentUser = mockUser();
      members = mockTeamMembers({ appId: currentApp.id });
      members[0].isOwner = true;
      members[0].user.id = currentUser.id;
      currentApp.userId = currentUser.id;

      mockFetchMembers({
        appId: currentApp.id,
        response: {
          members,
        },
      });

      createWrapper({ app: currentApp, user: currentUser });
    });

    test("should display members list", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Foo Bar")).toBeTruthy();
        expect(wrapper.getByText("Voo Bar")).toBeTruthy();
      });
    });

    test("should not display a warning about roles but display the more settings button", async () => {
      await waitFor(() => {
        const warning =
          /In order to remove members from the team you'll need to have/;
        expect(() => wrapper.getByText(warning)).toThrow();
        expect(wrapper.getByLabelText("expand")).toBeTruthy();
      });
    });

    test("should be able to delete any member except the owner", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Voo Bar")).toBeTruthy();
      });

      await fireEvent.click(wrapper.getByLabelText("expand"));
      await fireEvent.click(wrapper.getByText("Remove member"));

      const deleteScope = mockDeleteMember({
        appId: currentApp.id,
        userId: members[1].user.id,
        response: { ok: true },
      });

      await waitFor(() => {
        expect(wrapper.getByText("Yes, continue")).toBeTruthy();
      });

      await fireEvent.click(wrapper.getByText("Yes, continue"));

      await waitFor(() => {
        expect(deleteScope.isDone()).toBe(true);
        expect(window.location.reload).toHaveBeenCalled();
      });
    });
  });

  describe("when user is not an admin", () => {
    let members: Member[];

    beforeEach(() => {
      currentApp = mockApp();
      currentUser = mockUser();
      currentUser.id = "59691856829";
      members = mockTeamMembers({ appId: currentApp.id });
      members[1].isOwner = false;
      members[1].user.id = currentUser.id;

      mockFetchMembers({
        appId: currentApp.id,
        response: {
          members,
        },
      });

      createWrapper({ app: currentApp, user: currentUser });
    });

    test("should display members list", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Foo Bar")).toBeTruthy();
        expect(wrapper.getByText("Voo Bar")).toBeTruthy();
      });
    });

    test("should display a warning about roles and do not display the more settings button", async () => {
      await waitFor(() => {
        const warning =
          /In order to remove members from the team you'll need to have/;
        expect(wrapper.getByText(warning)).toBeTruthy();
      });
    });

    test("should be able to remove itself from the team", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Voo Bar")).toBeTruthy();
      });

      await fireEvent.click(wrapper.getByLabelText("expand"));
      await fireEvent.click(wrapper.getByText("Leave team"));

      const deleteScope = mockDeleteMember({
        appId: currentApp.id,
        userId: members[1].user.id,
        response: { ok: true },
      });

      await waitFor(() => {
        expect(wrapper.getByText("Yes, continue")).toBeTruthy();
      });

      await fireEvent.click(wrapper.getByText("Yes, continue"));

      await waitFor(() => {
        expect(deleteScope.isDone()).toBe(true);
        expect(window.location.assign).toHaveBeenCalledWith("/");
      });
    });
  });
});
