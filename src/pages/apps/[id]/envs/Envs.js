import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

const Id = ({ match }) => {
  return <Redirect to={`/apps/${match.params.id}/environments`} />;
};

Id.propTypes = {
  match: PropTypes.object,
};

export default Id;
