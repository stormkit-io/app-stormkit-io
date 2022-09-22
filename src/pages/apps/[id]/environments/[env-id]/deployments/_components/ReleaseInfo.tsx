import React from "react";

interface Props {
  percentage?: number;
}

const ReleaseInfo: React.FC<Props> = ({ percentage }) => {
  if (!percentage) {
    return <></>;
  }

  return (
    <span
      className="inline-flex bg-green-50 rounded-lg text-xs py-1 px-3 font-bold"
      style={{ transform: "scale(0.85)" }}
    >
      Published: {percentage} <span className="fa-light fa-percent" />
    </span>
  );
};

export default ReleaseInfo;
