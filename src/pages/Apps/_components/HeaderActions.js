import React from "react";
import PropTypes from "prop-types";
import { connect } from "~/utils/context";
import Button from "~/components/Button";
import DeployModal from "./DeployModal";

const HeaderActions = ({ api, app, history, environments, toggleModal }) => {
  return (
    <>
      <Button
        primary
        className="rounded-xl py-3 font-bold"
        onClick={() => toggleModal(true)}
      >
        <span className="fas fa-rocket mr-4 text-lg" />
        <span className="text-sm">Deploy now</span>
      </Button>
      <DeployModal
        api={api}
        app={app}
        history={history}
        environments={environments}
      />
    </>
  );
};

HeaderActions.propTypes = {
  api: PropTypes.object,
  app: PropTypes.object,
  history: PropTypes.object,
  environments: PropTypes.array,
  toggleModal: PropTypes.func,
};

export default connect(HeaderActions, [
  {
    Context: DeployModal,
    props: ["toggleModal"],
    wrap: true,
  },
]);
