import React from "react";
import { render, RenderResult } from "@testing-library/react";
import ReleaseInfo from "./ReleaseInfo";

interface Props {
  percentage?: number;
}

describe("~/apps/[id]/environments/[env-id]/deployments/_components/ReleaseInfo.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = ({ percentage }: Props) => {
    wrapper = render(<ReleaseInfo percentage={percentage} />);
  };

  test("should display the percentage information", () => {
    createWrapper({ percentage: 65 });
    expect(wrapper.getByText(/65/)).toBeTruthy();
    expect(wrapper.getByText(/Published:/)).toBeTruthy();
    expect(wrapper.container.innerHTML).toContain("fa-percent");
  });

  test("should return empty string when percentage is missing", () => {
    createWrapper({});
    expect(wrapper.container.innerHTML).toBe("");
  });
});
