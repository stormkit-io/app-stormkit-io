import React, { useContext, useState } from "react";
import cn from "classnames";
import Tooltip from "@material-ui/core/Tooltip";
import { AuthContext } from "~/pages/auth/Auth.context";
import Link from "~/components/Link";
import Spinner from "~/components/Spinner";
import DotDotDot from "~/components/DotDotDot";
import EnvironmentFormModal from "./EnvironmentFormModal";
import CSFormModal from "./CSFormModal";
import { useFetchStatus, STATUS, STATUSES } from "../actions";
import { deleteEnvironment } from "../actions";
import { useHistory } from "react-router";
import ConfirmModal from "~/components/ConfirmModal";

interface Props {
  app: App;
  environment: Environment;
  isClickable?: boolean;
}

interface StatusProps {
  status: STATUSES;
}

const InfoMessage404 = () => (
  <>
    The 404 may happen when the distributed folder does not contain an{" "}
    <b>index.html</b> or the environment has no published deployments.
  </>
);

const Status: React.FC<StatusProps> = ({ status }): React.ReactElement => {
  return (
    <div className="flex items-center">
      <span
        className={cn("text-sm", {
          "text-green-50": status === STATUS.OK,
          "text-red-50": status !== STATUS.OK,
        })}
      >
        <span className={"fas fa-fw fa-globe mr-2"} />
        {status === null && "Unknown error"}
        {status !== STATUS.NOT_CONFIGURED && status !== null && status}
        {status === STATUS.NOT_CONFIGURED && "Not yet deployed"}
        {status === STATUS.NOT_FOUND && (
          <Tooltip title={<InfoMessage404 />} placement="top" arrow>
            <span className="opacity-50 fas fa-question-circle ml-2 cursor-pointer" />
          </Tooltip>
        )}
      </span>
    </div>
  );
};

const getDomain = (env: Environment): string => {
  return (
    env.customStorage?.externalUrl?.replace(/^https?:\/\//, "") ||
    env?.getDomainName?.() ||
    ""
  );
};

const Environment: React.FC<Props> = ({
  environment,
  app,
  isClickable,
}): React.ReactElement => {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { lastDeploy } = environment;
  const name = environment.name || environment.env;
  const domain = getDomain(environment);
  const environmentUrl = `/apps/${app.id}/environments/${environment.id}`;
  const [isConfirmModalOpen, toggleConfirmModal] = useState(false);
  const [isEditModalOpen, toggleEditModal] = useState<boolean>();
  const [isIntegrationModalOpen, toggleIntegrationModal] = useState<boolean>();

  const { status, loading } = useFetchStatus({ domain, lastDeploy, app });

  return (
    <div className={"flex flex-auto py-8 bg-white rounded border-solid"}>
      <div className="flex flex-col flex-auto">
        <header className="flex items-center mb-6 px-8">
          <h2 className="flex-grow text-xl font-bold">
            <span className="flex-auto">
              {isClickable ? (
                <Link
                  to={environmentUrl}
                  className="inline-flex items-baseline text-primary hover:text-pink-50 font-bold"
                >
                  {name}
                  <span className="fas fa-chevron-right text-base ml-2" />
                </Link>
              ) : (
                <>{name}</>
              )}
            </span>
          </h2>
          <DotDotDot
            className="font-normal text-sm"
            aria-label={`Environment ${environment.name} menu`}
          >
            <DotDotDot.Item
              icon="fas fa-pen mr-2"
              aria-label="Update environment"
              onClick={close => {
                toggleEditModal(true);
                close();
              }}
            >
              Edit configuration
            </DotDotDot.Item>

            <DotDotDot.Item
              icon="fa-solid fa-boxes-stacked mr-2"
              aria-label="Add integration"
              onClick={close => {
                toggleIntegrationModal(true);
                close();
              }}
            >
              Custom storage
            </DotDotDot.Item>

            {environment.env !== "production" && (
              <DotDotDot.Item
                icon="fa-solid fa-trash mr-2"
                aria-label="Delete environment"
                onClick={close => {
                  toggleConfirmModal(true);
                  close();
                }}
              >
                Delete
              </DotDotDot.Item>
            )}
          </DotDotDot>
          {isIntegrationModalOpen && (
            <CSFormModal
              environment={environment}
              user={user!}
              app={app}
              toggleModal={toggleIntegrationModal}
            />
          )}
          {isEditModalOpen && (
            <EnvironmentFormModal
              environment={environment}
              app={app}
              toggleModal={toggleEditModal}
              isOpen
            />
          )}
        </header>
        <div className="flex-auto text-sm bg-gray-90 p-4 px-8">
          <div className="flex items-center mb-6">
            <div className="w-16 text-xs mr-1">Endpoint</div>
            <div className="flex items-center">
              <span className="opacity-50 fas fa-fw fa-external-link-square-alt mr-2" />
              <Link tertiary to={`https://${domain}`}>
                {domain}
              </Link>
            </div>
          </div>
          <div className="flex items-center mb-6">
            <div className="w-16 text-xs mr-1">Status</div>
            <div className="flex items-center">
              {loading ? (
                <Spinner primary width={4} height={4} />
              ) : (
                <Status status={status} />
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-16 text-xs mr-1">Branch</div>
            <div className="flex items-center ">
              <span className="opacity-50 fas fa-fw fa-code-branch mr-2" />
              {environment.branch}
            </div>
          </div>
        </div>
      </div>
      {isConfirmModalOpen && (
        <ConfirmModal
          onCancel={() => {
            toggleConfirmModal(false);
          }}
          onConfirm={({ setLoading, setError }) => {
            deleteEnvironment({
              app,
              environment,
              history,
              setLoading,
              setError,
              closeModal: () => toggleConfirmModal(false),
            });
          }}
        >
          This will completely remove the environment and all associated
          deployments.
        </ConfirmModal>
      )}
    </div>
  );
};

export default Environment;
