import React from "react";
import PropTypes from "prop-types";
import { connect } from "~/utils/context";
import ConfirmModal from "~/components/ConfirmModal";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import Button from "~/components/Button";
import { deleteApp } from "../actions";

const FormDangerZone = ({ confirmModal, api, app, history }) => {
  return (
    <Form.Section label="Danger Zone" marginBottom="mb-4">
      <InfoBox className="mb-4">
        <p>
          Deleting an application will remove all associated files and
          endpoints. After confirming the deletion, we won't be able to do much
          to recover it. <b>Please proceed cautiously</b>.
        </p>
      </InfoBox>
      <div className="flex justify-end">
        <Button
          primary
          type="submit"
          onClick={deleteApp({ api, app, confirmModal, history })}
        >
          Remove application
        </Button>
      </div>
    </Form.Section>
  );
};

FormDangerZone.propTypes = {
  history: PropTypes.object,
  api: PropTypes.object,
  app: PropTypes.object,
  confirmModal: PropTypes.func,
};

export default connect(FormDangerZone, [
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
]);
