import { describe, expect, beforeEach, afterEach, it } from "vitest";
import type { RenderResult } from "@testing-library/react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import nock from "nock";
import { AuthContext } from "~/pages/auth/Auth.context";
import { RootContext } from "~/pages/Root.context";
import mockUser from "~/testing/data/mock_user";
import UserProfile from "./UserProfile";

const apiDomain = process.env.API_DOMAIN || "";

interface Props {
  edition: "cloud" | "self-hosted";
  user: User;
  metrics?: UserMetrics;
}

describe("~/pages/user/account/_components/UserProfile", () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  const createWrapper = ({ edition, user = mockUser(), metrics }: Props) => {
    wrapper = render(
      <RootContext.Provider
        value={{
          mode: "dark",
          setMode: () => {},
          details: { stormkit: { apiCommit: "", apiVersion: "", edition } },
        }}
      >
        <AuthContext.Provider value={{ user, metrics }}>
          <UserProfile user={user} metrics={metrics} />
        </AuthContext.Provider>
      </RootContext.Provider>
    );
  };

  describe("cloud edition", () => {
    beforeEach(() => {
      createWrapper({
        edition: "cloud",
        user: mockUser(),
        metrics: {
          max: {
            buildMinutes: 300,
            bandwidthInBytes: 1000000,
            storageInBytes: 2000000,
            functionInvocations: 30000,
          },
          used: {
            buildMinutes: 150,
            bandwidthInBytes: 10000,
            storageInBytes: 250000,
            functionInvocations: 30000,
          },
        },
      });
    });

    it("should display cloud specific info", () => {
      expect(wrapper.getByText("Build minutes")).toBeTruthy();
      expect(wrapper.getByText("Bandwidth")).toBeTruthy();
      expect(wrapper.getByText("Function invocations")).toBeTruthy();
      expect(wrapper.getByText("Storage")).toBeTruthy();
      expect(wrapper.getByTestId("Build minutes-usage").textContent).toBe(
        "150 out of 300"
      );
      expect(wrapper.getByTestId("Bandwidth-usage").textContent).toBe(
        "10.0 kB out of 1.0 MB"
      );
      expect(
        wrapper.getByTestId("Function invocations-usage").textContent
      ).toBe("30,000 out of 30,000");
      expect(wrapper.getByTestId("Storage-usage").textContent).toBe(
        "250.0 kB out of 2.0 MB"
      );
    });
  });

  describe("self-hosted edition", () => {
    beforeEach(() => {
      createWrapper({
        edition: "self-hosted",
        user: mockUser(),
      });
    });

    it("should display self-hosted specific info", () => {
      expect(wrapper.getByText(/Visit your Cloud Account on/)).toBeTruthy();
      expect(wrapper.getByText("app.stormkit.io")).toBeTruthy();
      expect(wrapper.getByText(/to manage your subscription./));
    });

    it("should not display license section for self-hosted edition", () => {
      expect(() => wrapper.getByText("Self-Hosted License")).toThrow();
    });
  });

  describe("License functionality", () => {
    describe("cloud edition with premium user", () => {
      beforeEach(() => {
        const premiumUser = mockUser({ packageId: "premium" });
        createWrapper({
          edition: "cloud",
          user: premiumUser,
        });
      });

      it("should display license section for cloud edition", () => {
        expect(wrapper.getByText("Self-Hosted License")).toBeTruthy();
      });

      it("should fetch and display existing license", async () => {
        const mockLicense = {
          raw: "sk-test-license-key-12345",
        };

        const scope = nock(apiDomain)
          .get("/user/license")
          .reply(200, { license: mockLicense });

        createWrapper({
          edition: "cloud",
          user: mockUser({ packageId: "premium" }),
        });

        await waitFor(() => {
          expect(scope.isDone()).toBe(true);
        });

        await waitFor(() => {
          expect(
            wrapper.getByDisplayValue("sk-test-license-key-12345")
          ).toBeTruthy();
        });
      });

      it("should handle license fetch error", async () => {
        const scope = nock(apiDomain)
          .get("/user/license")
          .reply(500, { error: "Internal server error" });

        createWrapper({
          edition: "cloud",
          user: mockUser({ packageId: "premium" }),
        });

        await waitFor(() => {
          expect(scope.isDone()).toBe(true);
        });

        await waitFor(() => {
          const errorMessages = wrapper.getAllByText(
            "Something went wrong while fetching license"
          );
          expect(errorMessages[0]).toBeTruthy();
        });
      });

      it("should show generate license option when no license exists", async () => {
        const scope = nock(apiDomain)
          .get("/user/license")
          .reply(200, { license: null });

        createWrapper({
          edition: "cloud",
          user: mockUser({ packageId: "premium" }),
        });

        await waitFor(() => {
          expect(scope.isDone()).toBe(true);
        });

        await waitFor(() => {
          expect(
            wrapper.getByText("No Self-Hosted License found.")
          ).toBeTruthy();
          expect(wrapper.getByText("Click here to issue one.")).toBeTruthy();
        });
      });

      it("should generate license when button is clicked", async () => {
        const fetchScope = nock(apiDomain)
          .get("/user/license")
          .reply(200, { license: null });

        const generateScope = nock(apiDomain)
          .post("/user/license")
          .reply(200, { key: "new-license-key" });

        const refetchScope = nock(apiDomain)
          .get("/user/license")
          .reply(200, { license: { raw: "sk-new-generated-license" } });

        createWrapper({
          edition: "cloud",
          user: mockUser({ packageId: "premium" }),
        });

        await waitFor(() => {
          expect(fetchScope.isDone()).toBe(true);
        });

        const generateButton = await waitFor(() =>
          wrapper.getByText("Click here to issue one.")
        );

        fireEvent.click(generateButton);

        await waitFor(() => {
          expect(generateScope.isDone()).toBe(true);
          expect(refetchScope.isDone()).toBe(true);
        });
      });

      it("should handle license generation error", async () => {
        const fetchScope = nock(apiDomain)
          .get("/user/license")
          .reply(200, { license: null });

        const generateScope = nock(apiDomain)
          .post("/user/license")
          .reply(400, { error: "License generation failed" });

        createWrapper({
          edition: "cloud",
          user: mockUser({ packageId: "premium" }),
        });

        await waitFor(() => {
          expect(fetchScope.isDone()).toBe(true);
        });

        const generateButton = await waitFor(() =>
          wrapper.getByText("Click here to issue one.")
        );

        fireEvent.click(generateButton);

        await waitFor(() => {
          expect(generateScope.isDone()).toBe(true);
        });

        await waitFor(() => {
          const errorMessages = wrapper.getAllByText(
            "Something went wrong while issuing license"
          );
          expect(errorMessages[0]).toBeTruthy();
        });
      });
    });

    describe("cloud edition with free user", () => {
      beforeEach(() => {
        createWrapper({
          edition: "cloud",
          user: mockUser({ packageId: "free" }),
        });
      });

      it("should show upgrade message for free users", () => {
        expect(wrapper.getByText("Self-Hosted License")).toBeTruthy();
        expect(
          wrapper.getByText(
            "Upgrade your package to issue a Self-Hosted License."
          )
        ).toBeTruthy();
      });

      it("should not fetch license for free users", () => {
        // Since free users can't have licenses, no API call should be made
        expect(nock.pendingMocks()).toHaveLength(0);
      });
    });
  });
});
