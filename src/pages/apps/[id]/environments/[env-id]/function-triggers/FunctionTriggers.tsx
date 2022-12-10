import React, { useContext, useState } from "react";
import cn from "classnames";
import Tooltip from "@mui/material/Tooltip";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import emptyListSvg from "~/assets/images/empty-list.svg";
import DotDotDot from "~/components/DotDotDotV2";
import Spinner from "~/components/Spinner";
import ConfirmModal from "~/components/ConfirmModal";
import Button from "~/components/ButtonV2";
import InfoBox from "~/components/InfoBoxV2";
import Container from "~/components/Container";
import FunctionTriggerModal from "./_components/FunctionTriggerModal";
import * as actions from "./actions";

const { useFetchFunctionTriggers, deleteFunctionTrigger } = actions;

const FunctionTriggers: React.FC = () => {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [toBeModified, setToBeModified] = useState<FunctionTrigger>();
  const [toBeDeleted, setToBeDeleted] = useState<FunctionTrigger>();
  const [isFunctionTriggerModalOpen, setFunctionTriggerModal] = useState(false);
  const { error, loading, functionTriggers, setReload } =
    useFetchFunctionTriggers({
      appId: app.id,
      environmentId: environment.id!,
    });

  const handleCloseModal = () => {
    setToBeModified(undefined);
    setFunctionTriggerModal(false);
  };

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

    deleteFunctionTrigger({ tfid: toBeDeleted?.id!, appId: app.id })
      .then(() => {
        setReload(Date.now());
      })
      .catch(res => {
        setError(
          typeof res === "string"
            ? res
            : "Something went wrong while deleting function trigger."
        );
      })
      .finally(() => {
        setToBeDeleted(undefined);
        setLoading(false);
      });
  };

  return (
    <Container
      maxWidth="max-w-none"
      className="pb-0"
      title={
        <>
          <span>Function Triggers</span>
          <Tooltip
            arrow
            className="flex items-center"
            title={<p>Trigger periodic functions with given configuration.</p>}
          >
            <span className="fas fa-question-circle text-lg ml-2" />
          </Tooltip>
        </>
      }
      actions={
        <Button
          type="button"
          category="button"
          onClick={() => {
            setFunctionTriggerModal(true);
          }}
        >
          New function trigger
        </Button>
      }
    >
      <div className="w-full px-4 pb-4">
        {loading && (
          <div className="justify-center flex items-center w-full">
            <Spinner primary />
          </div>
        )}
        {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
        {!loading &&
          functionTriggers?.map((f, i) => (
            <div
              key={f.id}
              className={cn(
                "bg-blue-10 p-4 flex items-center justify-between",
                {
                  "mb-4": i !== functionTriggers.length - 1,
                }
              )}
            >
              <div>
                <div className="font-bold">{f.options.url}</div>
                <div className="text-xs leading-6">{f.cron}</div>
              </div>
              <div className="flex items-center gap-3">
                <p>{f.status ? "Enabled" : "Disabled"}</p>
                <DotDotDot
                  items={[
                    {
                      icon: "fa fa-pencil",
                      text: "Modify",
                      onClick: () => {
                        setToBeModified(f);
                        setFunctionTriggerModal(true);
                      },
                    },
                    {
                      icon: "fa fa-times",
                      text: "Delete",
                      onClick: () => {
                        setToBeModified(undefined);
                        setToBeDeleted(f);
                      },
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        {!loading && !error && !functionTriggers?.length && (
          <div className="p-4 flex items-center justify-center flex-col">
            <p className="mt-8">
              <img src={emptyListSvg} alt="No function trigger" />
            </p>
            <p className="mt-12">It is quite empty here.</p>
          </div>
        )}
      </div>
      {isFunctionTriggerModalOpen && (
        <FunctionTriggerModal
          app={app}
          environment={environment}
          triggerFunction={toBeModified}
          closeModal={handleCloseModal}
          onSuccess={() => setReload(Date.now())}
        />
      )}
      {toBeDeleted && functionTriggers && (
        <ConfirmModal onConfirm={handleDelete} onCancel={handleDeleteCancel}>
          <p>This will delete the trigger function immediately.</p>
        </ConfirmModal>
      )}
    </Container>
  );
};

export default FunctionTriggers;
