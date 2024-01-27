import Tooltip from "@mui/material/Tooltip";

interface Props {
  percentage?: number;
  showNotPublishedInfo?: boolean;
}

export default function ReleaseInfo({
  percentage,
  showNotPublishedInfo,
}: Props) {
  if (!percentage && !showNotPublishedInfo) {
    return <></>;
  }

  if (!percentage && showNotPublishedInfo) {
    return (
      <Tooltip
        title={
          <div className="text-center">
            Click on the menu to publish this deployment.
          </div>
        }
        arrow
      >
        <span
          className="inline-flex bg-gray-50 rounded-lg text-xs py-1 px-3 font-bold"
          style={{ transform: "scale(0.85)" }}
        >
          Not published
        </span>
      </Tooltip>
    );
  }

  return (
    <span
      className="inline-flex bg-green-50 rounded-lg text-xs py-1 px-3 font-bold"
      style={{ transform: "scale(0.85)" }}
    >
      Published: {percentage} <span className="fa-light fa-percent" />
    </span>
  );
}
