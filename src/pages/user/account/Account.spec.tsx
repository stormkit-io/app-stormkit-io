import type { RenderResult } from "@testing-library/react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import mockTeams from "~/testing/data/mock_teams";
import mockUser from "~/testing/data/mock_user";
import { AuthContext } from "~/pages/auth/Auth.context";
import Account from "./Account";

interface Props {
  user?: User;
}

describe("~/pages/user/account/Account", () => {
  let wrapper: RenderResult;

  const teams = mockTeams();

  const createWrapper = ({ user = mockUser() }: Props) => {
    wrapper = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user, teams, accounts: [] }}>
          <Account />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  describe("when user free trial is ended", () => {
    const user = mockUser();
    user.freeTrialEnds = 1716392905;

    test("should display a free trial will end message if payment is not required", () => {
      createWrapper({
        user,
      });

      expect(wrapper.getByText(/Thanks for exploring Stormkit\./)).toBeTruthy();

      expect(
        wrapper.getByText(/Your free trial will end on 2024-05-22\./)
      ).toBeTruthy();

      expect(
        wrapper.getByText(
          /Please upgrade your subscription to continue using our service without interruption\./
        )
      ).toBeTruthy();
    });

    test("should display a free trial will end message if payment is not required", () => {
      user.isPaymentRequired = true;

      createWrapper({
        user,
      });

      expect(wrapper.getByText(/Thanks for exploring Stormkit\./)).toBeTruthy();

      expect(
        wrapper.getByText(
          /Your free trial is ended\. Please upgrade your subscription to continue\./
        )
      ).toBeTruthy();
    });
  });

  test("should load connected accounts", () => {
    createWrapper({
      user: mockUser(),
    });

    expect(wrapper.getByText("Connected Accounts")).toBeTruthy();
    expect(
      wrapper.getByText(/List of connected emails and providers\./)
    ).toBeTruthy();
  });

  test("should subscription details", () => {
    createWrapper({
      user: mockUser(),
    });

    expect(wrapper.getByText("Subscription Details")).toBeTruthy();
  });
});
