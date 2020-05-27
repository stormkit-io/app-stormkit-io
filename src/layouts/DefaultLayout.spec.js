import { fireEvent } from "@testing-library/react";
import { renderWithContext } from "~/testing/helpers";
import DefaultLayout from "./DefaultLayout";

describe("layouts/DefaultLayout", () => {
  let wrapper;

  const findMenu = () => wrapper.getByRole("menu");
  const findMenuToggler = () => wrapper.getByText("Menu");
  const findStormkitLogo = () => wrapper.getByText("Stormkit");
  const findMadeWith = () => wrapper.getByText("Made with");

  beforeEach(() => {
    wrapper = renderWithContext(DefaultLayout);
  });

  test("should contain the logo", () => {
    expect(findStormkitLogo()).toBeTruthy();
  });

  test("should contain a menu button that can toggle the menu", () => {
    const menu = findMenu();
    const button = findMenuToggler();
    expect(menu).toBeTruthy();
    expect(menu.className).toContain("hidden");
    fireEvent.click(button);
    expect(menu.className).not.toContain("hidden");
    expect(findMadeWith()).toBeTruthy();
  });
});
