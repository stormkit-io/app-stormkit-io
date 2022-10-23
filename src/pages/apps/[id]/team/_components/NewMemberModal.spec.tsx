import type { RenderResult } from "@testing-library/react";
import React from "react";
import { waitFor, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockInviteMember } from "~/testing/nocks/nock_team";
import mockApp from "~/testing/data/mock_app";
import NewMemberModal from "./NewMemberModal";

interface Props {
  app: App;
}

describe("~/pages/apps/[id]/team/_components/NewMemberModal.tsx", () => {
  let wrapper: RenderResult;
  let onClose: jest.Mock;
  let currentApp: App;

  const createWrapper = ({ app }: Props) => {
    onClose = jest.fn();
    wrapper = render(<NewMemberModal app={app} onClose={onClose} />);
  };

  beforeEach(() => {
    currentApp = mockApp();
    createWrapper({ app: currentApp });
  });

  test("should contain the title", () => {
    expect(wrapper.getByText("Invite new member")).toBeTruthy();
  });

  test("should display an info message that describes the process", () => {
    expect(
      wrapper.getByText(
        "Enter the username to invite your colleague to the team. In the next step you'll get a link to share."
      )
    ).toBeTruthy();
  });

  test("should contain the referral form with a custom submit", async () => {
    const token = "some-token-to-be-returned";
    const displayName = "stormkit-dev";
    const provider = "github";
    const scope = mockInviteMember({
      appId: currentApp.id,
      displayName,
      provider,
      response: { token },
    });

    await userEvent.type(wrapper.getByLabelText("Username"), displayName);
    await fireEvent.click(wrapper.getByText("Invite user"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(
        wrapper.getByLabelText("Copy content").querySelector("input")!.value
      ).toBe(
        "http://localhost/app/invitation/accept?token=some-token-to-be-returned"
      );
    });
  });
});
