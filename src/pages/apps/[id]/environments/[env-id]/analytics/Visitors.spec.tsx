import type { TimeSpan } from "./index.d";
import {
  RenderResult,
  waitFor,
  render,
  fireEvent,
} from "@testing-library/react";
import { Scope } from "nock";
import recharts from "recharts";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";
import mockVisitors from "~/testing/data/mock_analytics_visitors";
import { mockFetchVisitors } from "~/testing/nocks/nock_analytics";
import Visitors from "./Visitors";

interface WrapperProps {
  app?: App;
  ts?: TimeSpan;
}

jest.mock("recharts", () => ({
  YAxis: jest.fn(),
  AreaChart: jest.fn(),
  Area: jest.fn(),
  Tooltip: jest.fn(),
  CartesianGrid: jest.fn(),
  ResponsiveContainer: ({ children }: { children: any }) => (
    <div>{children}</div>
  ),
}));

describe("~/pages/apps/[id]/environments/[env-id]/analytics/Visitors.tsx", () => {
  let wrapper: RenderResult;
  let scope: Scope;
  let currentApp: App;
  let currentEnv: Environment;
  let currentEnvs: Environment[];
  let onTimeSpanChange: jest.Mock;
  const data = mockVisitors();

  const createWrapper = ({ app, ts = "24h" }: WrapperProps) => {
    currentApp = app || mockApp();
    currentEnvs = mockEnvironments({ app: currentApp });
    currentEnv = currentEnvs[0];
    onTimeSpanChange = jest.fn();

    scope = mockFetchVisitors({
      unique: "false",
      ts,
      envId: currentEnv.id,
      response: data,
    });

    wrapper = render(
      <Visitors
        environment={currentEnv}
        onTimeSpanChange={onTimeSpanChange}
        ts={ts}
      />
    );
  };

  test("should include correct texts", async () => {
    createWrapper({});

    expect(
      wrapper.getByText("Bots are excluded from these statistics")
    ).toBeTruthy();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.getByText("Visitors")).toBeTruthy();
      expect(wrapper.getAllByText(/Total/).at(0)).toBeTruthy();
      expect(wrapper.getByText("160")).toBeTruthy();
      expect(wrapper.getByText(/visits in the last/)).toBeTruthy();
      expect(wrapper.getByText("24 hours")).toBeTruthy();
    });
  });

  test("should fetch visitors from the api", async () => {
    createWrapper({});

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });

    expect(recharts.AreaChart).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          { name: "2024-01-14", total: 20, unique: 10 },
          { name: "2024-01-13", total: 50, unique: 25 },
          { name: "2023-12-19", total: 46, unique: 19 },
          { name: "2023-11-04", total: 32, unique: 22 },
          { name: "2023-07-02", total: 12, unique: 12 },
        ],
      }),
      {}
    );
  });

  test("should emit event when time span changes", async () => {
    createWrapper({});

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });

    fireEvent.click(wrapper.getByText("7 Days"));

    await waitFor(() => {
      expect(onTimeSpanChange).toHaveBeenCalledWith("7d");
    });
  });

  test("should fetch with specified time span", async () => {
    createWrapper({
      ts: "7d",
    });

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.getByText("Visitors")).toBeTruthy();
      expect(wrapper.getAllByText(/Total/).at(0)).toBeTruthy();
      expect(wrapper.getByText("70")).toBeTruthy();
      expect(wrapper.getByText(/visits in the last/)).toBeTruthy();
      expect(wrapper.getByText(/7 days/)).toBeTruthy();
    });
  });
});
