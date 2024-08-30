import React, { useContext, useState } from "react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ConfirmModal from "~/components/ConfirmModal";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import CardRow from "~/components/CardRow";
import EmptyList from "~/components/EmptyPage";
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
    <Card
      sx={{ width: "100%" }}
      loading={loading}
      error={error}
      contentPadding={false}
    >
      <CardHeader
        title="Function Triggers"
        subtitle="Trigger periodic functions with given configuration."
      />
      {functionTriggers?.map((f, i) => (
        <CardRow
          key={f.id}
          menuItems={[
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
        >
          <Typography>{f.options.url}</Typography>
          <Typography>{f.cron}</Typography>
          <Typography>{f.status ? "Enabled" : "Disabled"}</Typography>
        </CardRow>
      ))}
      {!loading && !error && !functionTriggers?.length && (
        <EmptyList>
          <>
            It's quite empty in here.
            <br />
            Create a new trigger to call your functions periodically.
          </>
        </EmptyList>
      )}
      <CardFooter sx={{ textAlign: "center" }}>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={() => {
            setFunctionTriggerModal(true);
          }}
        >
          New function trigger
        </Button>
      </CardFooter>
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
    </Card>
  );
};

export default FunctionTriggers;
