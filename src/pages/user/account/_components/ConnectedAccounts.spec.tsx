import { RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ConnectedAccounts from "./ConnectedAccounts";

interface Props {
  accounts?: Array<ConnectedAccount>;
}

describe("~/pages/user/account/_components/ConnectedAccounts", () => {
  let wrapper: RenderResult;

  const createWrapper = ({ accounts = [] }: Props) => {
    wrapper = render(
      <MemoryRouter>
        <ConnectedAccounts accounts={accounts} />
      </MemoryRouter>
    );
  };

  describe.each`
    provider       | human          | hasPersonalAccessTokenSupport
    ${"github"}    | ${"GitHub"}    | ${false}
    ${"gitlab"}    | ${"GitLab"}    | ${true}
    ${"bitbucket"} | ${"Bitbucket"} | ${false}
  `("For provider", ({ provider, human, hasPersonalAccessTokenSupport }) => {
    beforeEach(() => {
      createWrapper({
        accounts: [
          {
            provider: "github",
            hasPersonalAccessToken: false,
            displayName: "",
          },
          {
            provider: "gitlab",
            hasPersonalAccessToken: false,
            displayName: "",
          },
          {
            provider: "bitbucket",
            hasPersonalAccessToken: false,
            displayName: "",
          },
        ],
      });
    });

    test("should display the provider as a connected account", () => {
      expect(wrapper.getByText(human)).toBeTruthy();
    });

    test("should display a set personal access token link", () => {
      const parent = wrapper
        .getByText(human)
        .closest(`[data-testid=${provider}]`);

      expect(/Set personal access token/.test(parent?.innerHTML || "")).toBe(
        hasPersonalAccessTokenSupport
      );
    });
  });

  describe("when has personal access token", () => {
    beforeEach(() => {
      createWrapper({
        accounts: [
          { provider: "gitlab", hasPersonalAccessToken: true, displayName: "" },
        ],
      });
    });

    test("displays reset instead of set when hasPersonalAccessToken is true", () => {
      expect(wrapper.getByText("Reset personal access token")).toBeTruthy();
    });

    test("the link should toggle the modal", async () => {
      await fireEvent.click(wrapper.getByText("Reset personal access token"));

      await waitFor(() => {
        expect(
          wrapper.getAllByText("Reset personal access token")
        ).toHaveLength(2);
      });
    });
  });
});
