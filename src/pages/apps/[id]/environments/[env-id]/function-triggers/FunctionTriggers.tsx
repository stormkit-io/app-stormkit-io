import { useContext, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/ModeEdit";
import TimeIcon from "@mui/icons-material/AccessTime";
import CircleIcon from "@mui/icons-material/Circle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import ConfirmModal from "~/components/ConfirmModal";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import CardRow from "~/components/CardRow";
import EmptyPage from "~/components/EmptyPage";
import Span from "~/components/Span";
import FunctionTriggerModal from "./FunctionTriggerModal";
import * as actions from "./actions";

const { useFetchFunctionTriggers, deleteFunctionTrigger } = actions;

const colors: Record<
  FunctionTriggerMethod,
  "warning" | "info" | "error" | "primary" | "success"
> = {
  POST: "warning",
  PUT: "info",
  DELETE: "error",
  GET: "success",
  PATCH: "primary",
};

function nextRun(time: number) {
  return new Date(time).toLocaleDateString("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FunctionTriggers() {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [toBeModified, setToBeModified] = useState<FunctionTrigger>();
  const [toBeDeleted, setToBeDeleted] = useState<FunctionTrigger>();
  const [isFunctionTriggerModalOpen, setFunctionTriggerModal] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const { error, loading, functionTriggers, paymentRequired } =
    useFetchFunctionTriggers({
      appId: app.id,
      environmentId: environment.id!,
      refreshToken,
    });

  const handleDelete = ({
    setError,
    setLoading,
  }: {
    setError: SetError;
    setLoading: SetLoading;
  }) => {
    setLoading(true);

    deleteFunctionTrigger({
      tfid: toBeDeleted?.id!,
      appId: app.id,
      envId: environment.id!,
    })
      .then(() => {
        setRefreshToken(Date.now());
      })
      .catch(res => {
        setError(
          typeof res === "string"
            ? res
            : "Something went wrong while deleting trigger."
        );
      })
      .finally(() => {
        setToBeDeleted(undefined);
        setLoading(false);
      });
  };

  if (paymentRequired) {
    return (
      <Card
        sx={{ width: "100%" }}
        loading={loading}
        error={error}
        contentPadding={false}
      >
        <CardHeader
          title="Periodic Triggers"
          subtitle="Send periodic requests to your endpoints."
        />
        <EmptyPage paymentRequired />
      </Card>
    );
  }

  return (
    <Card
      sx={{ width: "100%" }}
      loading={loading}
      error={error}
      contentPadding={false}
    >
      <CardHeader
        title="Periodic Triggers"
        subtitle="Send periodic requests to your endpoints."
      />
      {functionTriggers?.map((f, i) => (
        <CardRow
          key={f.id}
          sx={{ display: "flex", alignItems: "center" }}
          menuItems={[
            {
              icon: <TimeIcon />,
              text: "Past triggers",
              href: `/apps/${app.id}/environments/${environment.id}/function-triggers/${f.id}/logs`,
            },
            {
              icon: <EditIcon />,
              text: "Modify",
              onClick: () => {
                setToBeModified(f);
                setFunctionTriggerModal(true);
              },
            },
            {
              icon: <DeleteIcon />,
              text: "Delete",
              onClick: () => {
                setToBeModified(undefined);
                setToBeDeleted(f);
              },
            },
          ]}
        >
          <Typography sx={{ display: "flex" }}>
            <Chip
              size="small"
              component="span"
              color={colors[f.options.method] || "primary"}
              label={f.options.method}
              sx={{ fontSize: 10, mr: 2, minWidth: "60px" }}
            />
            <Typography
              component="span"
              color="text.secondary"
              sx={{ mr: 2, flex: 1 }}
            >
              {f.options.url}
            </Typography>
            <Span>
              <Tooltip
                title={
                  f.status &&
                  f.nextRunAt && (
                    <Typography component="span" sx={{ fontSize: 12 }}>
                      Next run at {nextRun(f.nextRunAt * 1000)}
                    </Typography>
                  )
                }
              >
                <span>
                  <TimeIcon sx={{ mr: 1, fontSize: 16 }} />
                  {f.cron}
                </span>
              </Tooltip>
            </Span>
            <Span>
              <CircleIcon
                color={f.status ? "success" : "error"}
                sx={{ fontSize: 10, mr: 1 }}
              />
              {f.status ? "Enabled" : "Disabled"}
            </Span>
          </Typography>
        </CardRow>
      ))}
      {!loading && !error && !functionTriggers?.length && (
        <EmptyPage>
          <>
            It's quite empty in here.
            <br />
            Create a new trigger to call your functions periodically.
          </>
        </EmptyPage>
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
          New trigger
        </Button>
      </CardFooter>
      {isFunctionTriggerModalOpen && (
        <FunctionTriggerModal
          app={app}
          environment={environment}
          triggerFunction={toBeModified}
          closeModal={() => {
            setToBeModified(undefined);
            setFunctionTriggerModal(false);
          }}
          onSuccess={() => setRefreshToken(Date.now())}
        />
      )}
      {toBeDeleted && functionTriggers && (
        <ConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setToBeDeleted(undefined)}
        >
          This will delete the trigger immediately.
        </ConfirmModal>
      )}
    </Card>
  );
}
