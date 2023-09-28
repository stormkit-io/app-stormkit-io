import type { SxProps } from "@mui/material";
import type { RenderResult } from "@testing-library/react";
import { render } from "@testing-library/react";
import EmptyPage from ".";

interface Props {
  children: React.ReactNode;
  sx: SxProps;
}

describe("~/components/EmptyPage.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = ({ children, sx }: Props) => {
    wrapper = render(<EmptyPage children={children} sx={sx} />);
  };

  test("should render the component as expected", () => {
    createWrapper({
      children: <span>Hello world</span>,
      sx: { color: "black" },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
