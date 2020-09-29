import React from "react";
import PropTypes from "prop-types";

const Title = ({ children }) => {
  return <div className="font-bold">{children}</div>;
};

Title.Main = ({ children }) => {
  return <h1 className="text-lg text-pink-50 mb-2">{children}</h1>;
};

Title.Sub = ({ children }) => {
  return <h2 className="text-2xl text-white mb-6">{children}</h2>;
};

Title.Main.propTypes = {
  children: PropTypes.node
};

Title.Sub.propTypes = {
  children: PropTypes.node
};

Title.propTypes = {
  children: PropTypes.node
};

export default Title;
