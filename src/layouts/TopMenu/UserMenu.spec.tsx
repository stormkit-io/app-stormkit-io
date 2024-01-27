import { render, RenderResult } from "@testing-library/react";
import { mockUser } from "~/testing/data";
import UserMenu from "./UserMenu";

jest.mock("~/utils/storage", () => ({
  LocalStorage: { get: () => "github", set: () => "" },
}));

describe("~/components/UserMenu.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = () => {
    wrapper = render(<UserMenu user={mockUser()} />);
  };

  beforeEach(() => {
    createWrapper();
  });

  test.each`
    text                | href
    ${"My Apps"}        | ${"/"}
    ${"New App"}        | ${"/apps/new/github"}
    ${"My Deployments"} | ${"/my/deployments"}
    ${"Stormkit Docs"}  | ${"https://www.stormkit.io/docs"}
    ${"Account"}        | ${"/user/account"}
    ${"Log out"}        | ${"/logout"}
  `("should load menu item: $text", ({ text, href }) => {
    expect(wrapper.getByText(text).getAttribute("href")).toBe(href);
  });

  test.each`
    label        | href
    ${"X"}       | ${"https://twitter.com/stormkitio"}
    ${"YouTube"} | ${"https://www.youtube.com/channel/UC6C_-UuAiIWlGOIokT03lRQ"}
    ${"Discord"} | ${"https://discord.gg/6yQWhyY"}
    ${"Email"}   | ${"mailto:hello@stormkit.io"}
  `("should load menu item: $text", ({ label, href }) => {
    expect(wrapper.getByLabelText(label).getAttribute("href")).toBe(href);
  });
});
