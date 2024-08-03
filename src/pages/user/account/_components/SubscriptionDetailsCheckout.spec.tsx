import type { RenderResult } from "@testing-library/react";
import { render, fireEvent } from "@testing-library/react";
import SubscriptionDetailsCheckout from "./SubscriptionDetailsCheckout";
import mockUser from "~/testing/data/mock_user";

interface Props {
  user: User;
}

describe("~/pages/user/account/_components/SubscriptionDetailsCheckout", () => {
  let wrapper: RenderResult;

  const createWrapper = ({ user }: Props) => {
    wrapper = render(<SubscriptionDetailsCheckout user={user} />);
  };

  beforeEach(() => {
    createWrapper({ user: mockUser() });
  });

  test("should display two options", () => {
    expect(wrapper.getByText("Self-Hosted Edition")).toBeTruthy();
    expect(wrapper.getByText("Cloud Edition")).toBeTruthy();
  });

  test("should have 'Limited Edition' pre-selected", () => {
    expect(wrapper.getByText("Limited Edition")).toBeTruthy();
  });

  test("should 'Up to 100 deployments per month' pre-selected", () => {
    expect(wrapper.getByText("Up to 100 deployments per month")).toBeTruthy();
  });

  test("should have two self hosted editions", () => {
    fireEvent.mouseDown(wrapper.getAllByRole("combobox").at(0)!);
    expect(wrapper.getByText("Premium Edition")).toBeTruthy();
  });

  test("should have three cloud editions", () => {
    fireEvent.mouseDown(wrapper.getAllByRole("combobox").at(1)!);
    expect(wrapper.getByText("Up to 500 deployments per month")).toBeTruthy();
    expect(wrapper.getByText("Up to 1000 deployments per month")).toBeTruthy();
  });
});
