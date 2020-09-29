import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { keyToName } from "../helpers";

const Targetings = ({ targeting, index, maxIndex }) => {
  const obj = Object.keys(targeting).filter((k) => k !== "value");
  const isLeftColumn = index % 2 === 0;
  const isLast = index === maxIndex - 1;
  const isLastRow = isLast || (isLeftColumn && index === maxIndex - 2);
  const isSingleRow = maxIndex <= 2;

  return (
    <div
      key={`t-${index}`}
      className={cn(
        "p-4 font-mono flex-auto md:min-w-1/2 border-gray-85 border-solid",
        {
          "md:max-w-1/2": !isSingleRow,
          "border-b": !isLastRow,
          "border-r": isLeftColumn && maxIndex !== 1,
        }
      )}
    >
      <div>
        <span className="inline-block w-24">{keyToName.value}:</span>
        <span className="text-red-20">"{targeting.value}"</span>
      </div>
      {obj.map((k) => (
        <div key={k} className="mt-2">
          <span className="inline-block py-1 w-24">{keyToName[k]}:</span>
          <span
            className={cn("inline-block rounded py-1", {
              "bg-gray-80 px-2": targeting[k],
            })}
          >
            {targeting[k] || "any"}
          </span>
        </div>
      ))}
    </div>
  );
};

Targetings.propTypes = {
  targeting: PropTypes.object,
  index: PropTypes.number,
  maxIndex: PropTypes.number,
  isEditMode: PropTypes.bool,
};

export default Targetings;
