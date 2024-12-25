import { describe, expect, it, vi, type Mock } from "vitest";
import { RenderResult } from "@testing-library/react";
import { render } from "@testing-library/react";
import RedirectsEditor from "./RedirectsEditor";

interface WrapperProps {
  value: string;
}

vi.mock("@codemirror/lang-json", () => ({ json: vi.fn() }));
vi.mock("@uiw/react-codemirror", () => ({
  default: ({ value }: { value: string }) => <>{value}</>,
}));

describe("~/pages/apps/[id]/environments/[env-id]/config/_components/RedirectsEditor.tsx", () => {
  let wrapper: RenderResult;
  let onChange: Mock;

  const createWrapper = ({ value }: WrapperProps) => {
    onChange = vi.fn();

    wrapper = render(<RedirectsEditor value={value} onChange={onChange} />);
  };

  it("should have a form", () => {
    const value = "[ { 'from': '/', 'to': '/test' } ]";

    createWrapper({ value });

    expect(wrapper.getByText(value)).toBeTruthy();
    expect(wrapper.getByText("docs").getAttribute("href")).toBe(
      "https://stormkit.io/docs/features/redirects-and-path-rewrites"
    );
  });
});
