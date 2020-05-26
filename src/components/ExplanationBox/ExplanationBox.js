import React from "react";
import PropTypes from "prop-types";

const ExplanationBox = ({ title, children }) => {
  return (
    <section className="bg-blue-20 text-secondary p-8 rounded-lg">
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <div className="leading-6">{children}</div>
    </section>
  );
};

ExplanationBox.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default ExplanationBox;
