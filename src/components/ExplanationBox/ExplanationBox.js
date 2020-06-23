import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import "./ExplanationBox.css";

const ExplanationBox = ({
  title,
  children,
  className,
  absolute,
  arrowStyles,
}) => {
  return (
    <section
      className={cn(
        "bg-blue-20 text-secondary p-8 rounded",
        { "absolute z-10": absolute },
        className
      )}
    >
      {absolute && <div class="exp-arrow-up" style={arrowStyles} />}
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <div className="leading-6 text-sm">{children}</div>
    </section>
  );
};

ExplanationBox.defaultProps = {
  arrowStyles: {
    left: "50%",
    transform: "translateX(-50%)",
  },
};

ExplanationBox.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.any,
  absolute: PropTypes.bool,
  arrowStyles: PropTypes.object,
};

export default ExplanationBox;
