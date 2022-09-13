import React from "react";
import Modal from "~/components/Modal";
import InfoBox from "~/components/InfoBox";
import { json } from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import { useFetchDeploymentManifest } from "../actions";

interface Props {
  app: App;
  deployment: Deployment;
  toggleModal: (val: boolean) => void;
}

const ManifestModal: React.FC<Props> = ({
  toggleModal,
  deployment,
  app,
}): React.ReactElement => {
  const { loading, error, manifest } = useFetchDeploymentManifest(
    app.id,
    deployment.id
  );

  return (
    <Modal
      isOpen={true}
      onClose={() => toggleModal(false)}
      className="max-w-screen-md"
    >
      <h3 className="mb-8 text-xl font-bold">Build Manifest</h3>

      {error && (
        <InfoBox type={InfoBox.ERROR} className="mb-4" scrollIntoView>
          {error}
        </InfoBox>
      )}
      {loading ? (
        <p> Loading </p>
      ) : (
        <CodeMirror
          height="200px"
          className="bg-white p-4"
          value={JSON.stringify(manifest, null, 2)}
          readOnly={true}
          extensions={[json()]}
          theme="light"
        />
      )}
    </Modal>
  );
};

export default ManifestModal;
