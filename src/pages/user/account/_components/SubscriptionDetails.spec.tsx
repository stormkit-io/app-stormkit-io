import { describe, expect, beforeEach, it } from "vitest";
import { waitFor, type RenderResult } from "@testing-library/react";
import { mockFetchLicense } from "~/testing/nocks/nock_user";
import SubscriptionDetails from "./SubscriptionDetails";
import mockUser from "~/testing/data/mock_user";
import { renderWithRouter } from "~/testing/helpers";

interface Props {
  user: User;
  isSelfHostedInstance: boolean;
  initialEntries?: string[];
}

describe("~/pages/user/account/_components/SubscriptionDetails", () => {
  let wrapper: RenderResult;

  const createWrapper = ({
    user,
    isSelfHostedInstance,
    initialEntries = ["/"],
  }: Props) => {
    wrapper = renderWithRouter({
      el: () => (
        <SubscriptionDetails
          user={user}
          isSelfHostedInstance={isSelfHostedInstance}
        />
      ),
      initialEntries,
    });
  };

  describe("Self-Hosted", () => {
    beforeEach(() => {
      const user = mockUser({ packageId: "free" });

      createWrapper({
        user,
        isSelfHostedInstance: true,
      });
    });

    it("should not make a call to fetch the license", () => {
      const scope = mockFetchLicense({
        status: 200,
        response: { license: { raw: "abc", premium: true, seat: 6 } },
      });

      expect(scope.isDone()).toBe(false);
    });

    it("should display a link to app.stormkit.io", () => {
      expect(wrapper.container.textContent).toContain("Subscription Details");
      expect(wrapper.container.textContent).toContain(
        "Visit your Cloud Account on app.stormkit.io to manage your subscription."
      );
    });
  });

  describe("Stormkit Cloud", () => {
    describe("when the user is still in free trial", () => {
      beforeEach(() => {
        const user = mockUser({ packageId: "free" });

        createWrapper({
          user,
          isSelfHostedInstance: false,
        });
      });

      it("should display the checkout form", () => {
        expect(wrapper.getByText("Cloud Edition")).toBeTruthy();
        expect(wrapper.getByText("Self-Hosted Edition")).toBeTruthy();
      });

      it("should display a checkout title", () => {
        expect(wrapper.getByText("Checkout")).toBeTruthy();
        expect(() => wrapper.getByText("Subscription Details")).toThrow();
      });
    });

    describe("when the user is a cloud-edition", () => {
      beforeEach(() => {
        const user = mockUser({ packageId: "medium" });

        createWrapper({
          user,
          isSelfHostedInstance: false,
        });
      });

      it("should no longer display the checkout form", () => {
        expect(() => wrapper.getByText("Cloud Edition")).toThrow();
        expect(() => wrapper.getByText("Self-Hosted Edition")).toThrow();
      });

      it("should no longer display a checkout title", () => {
        expect(() => wrapper.getByText("Checkout")).toThrow();
      });

      it("should display the subscription details title", () => {
        expect(wrapper.getByText("Subscription Details")).toBeTruthy();
      });
    });

    describe("when the user is a self-edition", () => {
      beforeEach(async () => {
        const user = mockUser({ packageId: "self-hosted" });
        const scope = mockFetchLicense({
          status: 200,
          response: { license: { raw: "abc", premium: true, seat: 6 } },
        });

        createWrapper({
          user,
          isSelfHostedInstance: false,
        });

        await waitFor(() => {
          expect(scope.isDone()).toBe(true);
        });
      });

      it("should no longer display the checkout form", () => {
        expect(() => wrapper.getByText("Cloud Edition")).toThrow();
        expect(() => wrapper.getByText("Self-Hosted Edition")).toThrow();
      });

      it("should no longer display a checkout title", () => {
        expect(() => wrapper.getByText("Checkout")).toThrow();
      });

      it("should display the subscription details title", () => {
        expect(wrapper.getByText("Subscription Details")).toBeTruthy();
      });

      it("should display the liceense", () => {
        expect(wrapper.getByText(/STORMKIT_LICENSE/)).toBeTruthy();
        expect(wrapper.getByDisplayValue("abc")).toBeTruthy();
      });
    });

    describe("when the user made a payment", () => {
      const user = mockUser({ packageId: "medium" });

      it("should display a payment success message", () => {
        createWrapper({
          user,
          isSelfHostedInstance: false,
          initialEntries: ["/?payment=success"],
        });

        expect(
          wrapper.getByText(
            "Thank you for your order, your tier has been updated."
          )
        ).toBeTruthy();
      });

      it("should not display a payment success message when query param is missing", () => {
        createWrapper({
          user,
          initialEntries: ["/"],
          isSelfHostedInstance: false,
        });

        expect(() =>
          wrapper.getByText(
            "Thank you for your order, your tier has been updated."
          )
        ).toThrow();
      });
    });
  });
});
