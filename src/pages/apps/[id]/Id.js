import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

const Id = ({ match }) => {
  // For now redirect to the environments page.
  // In the future we can create a dashboard here.
  return <Redirect to={`/apps/${match.params.id}/environments`} />;
};

Id.propTypes = {
  match: PropTypes.object
};

export default Id;
