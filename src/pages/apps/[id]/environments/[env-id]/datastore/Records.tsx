import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import { AppContext } from "~/pages/apps/[id]/App.context";
import Container from "~/components/Container";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import Link from "~/components/Link";
import DotDotDot from "~/components/DotDotDotV2";
import ConfirmModal from "~/components/ConfirmModal";
import Modal from "~/components/ModalV2";
import { timeSince } from "~/utils/helpers/date";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { useWithRecords, deleteRecord } from "./actions";

const Records: React.FC = () => {
  const params = useParams<{ collection: string }>();
  const { app } = useContext(AppContext);
  const [toBeDeleted, setToBeDeleted] = useState<CollectionRecord>();
  const [expandedContent, setExpandedContent] = useState<CollectionRecord>();
  const { environment } = useContext(EnvironmentContext);
  const { loading, error, records, setReload } = useWithRecords({
    appId: app.id,
    envId: environment.id!,
    collectionName: params.collection!,
  });

  const handleDeleteCancel = () => {
    setToBeDeleted(undefined);
  };

  const handleDelete = ({
    setError,
    setLoading,
  }: {
    setError: SetError;
    setLoading: SetLoading;
  }) => {
    setLoading(true);

    deleteRecord({
      recordId: toBeDeleted?.id!,
      appId: app.id,
      collectionName: params.collection!,
    })
      .then(() => {
        setReload(Date.now());
      })
      .catch(res => {
        setError(
          typeof res === "string"
            ? res
            : "Something went wrong while deleting record."
        );
      })
      .finally(() => {
        setToBeDeleted(undefined);
        setLoading(false);
      });
  };

  return (
    <Container
      title={
        <div>
          <Link to="../data-store" className="font-normal text-gray-50">
            Collections
          </Link>
          <span className="fas fa-chevron-right text-xs mx-2" />
          <span>{params.collection}</span>
        </div>
      }
      maxWidth="max-w-none"
    >
      {loading && (
        <div className="flex items-center">
          <Spinner />
        </div>
      )}
      {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
      <div className="pb-4">
        {!loading &&
          !error &&
          records.map(record => (
            <div
              key={record.id}
              className="mx-4 mb-4 last:mb-0 p-2 flex items-center bg-blue-20"
            >
              <div className="max-w-full overflow-auto flex-1 mr-5">
                <code
                  className="p-0 my-2 block text-gray-50 text-xs font-mono whitespace-nowrap bg-transparent"
                  onDoubleClick={() => {
                    setExpandedContent(record);
                  }}
                >
                  {JSON.stringify(record.value, null, 2)}
                </code>
              </div>
              <div className="flex flex-col items-end">
                <DotDotDot
                  items={[
                    {
                      text: "Expand",
                      onClick: () => {
                        setExpandedContent(record);
                      },
                    },
                    {
                      text: "Delete",
                      onClick: () => {
                        setToBeDeleted(record);
                      },
                    },
                  ]}
                />
                <div className="text-xs flex-shrink-0 mt-2">
                  {timeSince(record.createdAt)} ago
                </div>
              </div>
            </div>
          ))}
      </div>
      {expandedContent && (
        <Modal
          open
          maxWidth="max-w-screen-lg"
          onClose={() => {
            setExpandedContent(undefined);
          }}
        >
          <Container maxWidth="max-w-none">
            <div className="p-4 flex justify-between">
              <div>#{expandedContent.id}</div>
              <div>
                {new Date(expandedContent.createdAt)
                  .toISOString()
                  .replace("T", " ")
                  .replace(".000Z", "")}
              </div>
            </div>
            <code className="p-4 block text-gray-50 text-xs font-mono whitespace-pre-wrap bg-blue-20">
              {JSON.stringify(expandedContent.value, null, 4)}
            </code>
          </Container>
        </Modal>
      )}
      {toBeDeleted && (
        <ConfirmModal onConfirm={handleDelete} onCancel={handleDeleteCancel}>
          <p>After deletion there is no way to recover the data.</p>
        </ConfirmModal>
      )}
    </Container>
  );
};

export default Records;
