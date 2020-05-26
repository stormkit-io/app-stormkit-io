import styled from "styled-components";
import props from "../props";

const Table = styled.div`
  display: table;
  border: none;
  border-collapse: collapse;
  width: 100%;
`;

Table.Column = styled.div`
  display: table-cell;
  border-bottom: 1px solid ${p => p.borderColor || props.gray85};
  width: ${p => p.width};
  max-width: ${p => p.maxWidth};
  text-align: ${p => p.align || p.textAlign};
  vertical-align: ${p => p.valign || "middle"};
  padding: ${props.sizes.l} ${props.sizes.m};
  line-height: 1.3;
  position: ${p =>
    p.relative ? "relative" : p.absolute ? "absolute" : "static"};

  &:first-child {
    border-top-left-radius: ${props.borderRadiusS};
    border-bottom-left-radius: ${props.borderRadiusS};
  }

  &:last-child {
    border-top-right-radius: ${props.borderRadiusS};
    border-bottom-right-radius: ${props.borderRadiusS};
  }
`;

Table.Row = styled.div`
  display: table-row;

  ${p =>
    p.header &&
    `${Table.Column} {
        font-size: 0.9rem;
        background-color: ${props.gray90};
        color: ${props.colors.fontSecondary};
        padding: ${props.sizes.m};
    }`}
`;

export default Table;
