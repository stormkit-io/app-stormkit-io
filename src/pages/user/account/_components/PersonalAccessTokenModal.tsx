import React from "react";
import Modal from "~/components/Modal";
import Form from "~/components/FormV2";
import Button from "~/components/ButtonV2";
import InfoBox from "~/components/InfoBoxV2";
import Container from "~/components/Container";
import { usePersonalAccessTokenState as usePATState } from "../actions";

interface Props {
  hasToken: boolean;
  toggleModal: (val: boolean) => void;
}

const PersonalAccessTokenModal: React.FC<Props> = ({
  hasToken,
  toggleModal,
}): React.ReactElement => {
  const state = usePATState({ hasToken });

  return (
    <Modal open onClose={() => toggleModal(false)} className="max-w-screen-sm">
      <Container title={`${hasToken ? "Reset" : "Set"} personal access token`}>
        {state.msg ? (
          <InfoBox type={state.msg.type} className="mx-4">
            {state.msg.content}
          </InfoBox>
        ) : (
          ""
        )}
        <Form.WithLabel label="Token">
          <Form.Input
            fullWidth
            autoFocus
            value={state.token}
            onChange={e => state.setToken(e.target.value)}
            inputProps={{
              "aria-label": "Personal access token",
            }}
          />
        </Form.WithLabel>
        <div className="text-center mb-4">
          {hasToken ? (
            <Button
              category="button"
              type="button"
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
            category="action"
            type="submit"
            onClick={state.submitToken}
            loading={state.loading === "submit"}
            disabled={!state.token}
          >
            Submit
          </Button>
        </div>
      </Container>
    </Modal>
  );
};

export default PersonalAccessTokenModal;
