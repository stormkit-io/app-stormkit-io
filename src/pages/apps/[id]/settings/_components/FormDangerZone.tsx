import React from "react";
import { connect } from "~/utils/context";
import { useHistory } from "react-router-dom";
import ConfirmModal, { ConfirmModalProps } from "~/components/ConfirmModal";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import Button from "~/components/Button";
import { RootContextProps } from "~/pages/Root.context";
import { deleteApp } from "../actions";

interface Props extends Pick<RootContextProps, "api"> {
  app: App;
}

const FormDangerZone: React.FC<Props & ConfirmModalProps> = ({
  confirmModal,
  api,
  app,
}): React.ReactElement => {
  const history = useHistory();

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

export default connect<Props, ConfirmModalProps>(FormDangerZone, [
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
]);
