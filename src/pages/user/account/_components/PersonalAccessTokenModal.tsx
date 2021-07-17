import React from "react";
import Modal, { ModalContextProps } from "~/components/Modal";
import Form from "~/components/Form";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import RootContext, { RootContextProps } from "~/pages/Root.context";
import { connect } from "~/utils/context";
import { usePersonalAccessTokenState as usePATState } from "../actions";

interface Props {
  hasToken: boolean;
}

interface ContextProps extends ModalContextProps, RootContextProps {}

const PersonalAccessTokenModal: React.FC<Props & ContextProps> = ({
  hasToken,
  isOpen,
  api,
  toggleModal,
}): React.ReactElement => {
  const state = usePATState({ hasToken, api });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => toggleModal(false)}
      className="max-w-screen-sm"
    >
      <h2 className="font-bold text-lg text-center mb-4">
        {hasToken ? "Reset" : "Set"} personal access token
      </h2>
      {state.msg ? (
        <InfoBox type={state.msg.type} className="mb-4">
          {state.msg.content}
        </InfoBox>
      ) : (
        ""
      )}
      <div className="mb-4">
        <Form.Input
          fullWidth
          autoFocus
          value={state.token}
          onChange={e => state.setToken(e.target.value)}
          inputProps={{
            "aria-label": "Personal access token",
          }}
        />
      </div>
      <div className="text-center">
        {hasToken ? (
          <Button
            secondary
            onClick={state.deleteToken}
            loading={state.loading === "delete"}
            className="mr-4"
          >
            Delete existing token
          </Button>
        ) : (
          ""
        )}
        <Button
          primary
          onClick={state.submitToken}
          loading={state.loading === "submit"}
          disabled={!state.token}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

const ModalContext = Modal.Context();

export default Object.assign(
  connect<Props, ContextProps>(PersonalAccessTokenModal, [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
    { Context: RootContext, props: ["api"] },
  ]),
  ModalContext
);
