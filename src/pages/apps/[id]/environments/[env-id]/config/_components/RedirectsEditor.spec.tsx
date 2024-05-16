import { RenderResult } from "@testing-library/react";
import { render } from "@testing-library/react";
import RedirectsEditor from "./RedirectsEditor";

interface WrapperProps {
  value: string;
}

jest.mock("@codemirror/lang-json", () => ({ json: jest.fn() }));
jest.mock("@uiw/react-codemirror", () => ({ value }: { value: string }) => (
  <>{value}</>
));

describe("~/pages/apps/[id]/environments/[env-id]/config/_components/RedirectsEditor.tsx", () => {
  let wrapper: RenderResult;
  let onChange: jest.Func;

  const createWrapper = ({ value }: WrapperProps) => {
    onChange = jest.fn();

    wrapper = render(<RedirectsEditor value={value} onChange={onChange} />);
  };

  test("should have a form", () => {
    const value = "[ { 'from': '/', 'to': '/test' } ]";

    createWrapper({ value });

    expect(wrapper.getByText(value)).toBeTruthy();
    expect(wrapper.getByText("docs").getAttribute("href")).toBe(
      "https://stormkit.io/docs/features/redirects-and-path-rewrites"
    );
  });
});
