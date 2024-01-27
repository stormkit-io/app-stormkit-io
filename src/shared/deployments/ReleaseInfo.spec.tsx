import { render, RenderResult } from "@testing-library/react";
import ReleaseInfo from "./ReleaseInfo";

interface Props {
  percentage?: number;
  showNotPublishedInfo?: boolean;
}

describe("~/shared/deployments/ReleaseInfo.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = ({ percentage, showNotPublishedInfo }: Props) => {
    wrapper = render(
      <ReleaseInfo
        percentage={percentage}
        showNotPublishedInfo={showNotPublishedInfo}
      />
    );
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

  test("should show not published info when showNotPublishedInfo prop is true", () => {
    createWrapper({ showNotPublishedInfo: true, percentage: 0 });
    expect(wrapper.getByText("Not published")).toBeTruthy();
  });
});
