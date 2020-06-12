import React from "react";
import AppContext from "~/pages/Apps/Apps.context";
import { connect } from "~/utils/context";

const Environments = ({ app }) => {
  return <div>{JSON.stringify(app)}</div>;
};

export default connect(Environments, [{ Context: AppContext, props: ["app"] }]);
