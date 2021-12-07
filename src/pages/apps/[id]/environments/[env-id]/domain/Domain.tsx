import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "~/utils/context";
import RootContext, { RootContextProps } from "~/pages/Root.context";
import EnvironmentContext from "~/pages/apps/[id]/environments/[env-id]/Environment.context";
import ConfirmModal, { ConfirmModalProps } from "~/components/ConfirmModal";
import { ModalContextProps } from "~/components/Modal";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import { PlusButton } from "~/components/Buttons";
import { useDomainLookup, deleteDomain, fetchDomainsInfo } from "./actions";
import DomainModal from "./_components/DomainModal";
import DomainRow from "./_components/DomainRow";

interface ContextProps
  extends RootContextProps,
    ConfirmModalProps,
    ModalContextProps {}

interface Props {
  app: App;
  environment: Environment;
}

interface HandleVerifyProps {
  setLoading: SetLoading;
  setError: SetError;
}

const Domain: React.FC<Props & ContextProps> = ({
  api,
  environment,
  app,
  toggleModal,
  confirmModal,
}) => {
  const history = useHistory();

  const info = useDomainLookup({ api, app, environment });
  const { loading, error, domainsInfo, setDomainsInfo } = info;

  const handleVerify = ({
    setLoading,
    setError,
  }: HandleVerifyProps): Promise<void> => {
    return fetchDomainsInfo({
      api,
      app,
      unmounted: false,
      environment,
      setDomainsInfo,
      setLoading,
      setError,
    });
  };

  const handleDelete = (domainName: string) => {
    return confirmModal(
      "This will completely remove the domain and it won't be reachable anymore.",
      {
        onConfirm: ({ setLoading, setError, closeModal }) => {
          deleteDomain({
            api,
            app,
            environment,
            domainName,
            setLoading,
            setError,
            history,
          }).then(closeModal);
        },
      }
    );
  };

  return (
    <div className="flex flex-col mt-4">
      <div className="flex bg-white rounded mb-4 p-8 items-center">
        <h2 className="text-lg font-bold flex flex-auto">Domain information</h2>
        {domainsInfo.length === 0 && !loading && (
          <div className="flex-shrink-0">
            <DomainModal app={app} environment={environment} api={api} />
            <PlusButton
              size="small"
              text="New domain"
              onClick={() => {
                toggleModal(true);
              }}
              className="p-2 rounded"
              aria-label="Insert snippet"
            />
          </div>
        )}
      </div>
      {loading && (
        <div
          data-testid="domain-spinner"
          className="p-8 flex items-center w-full bg-white rounded"
        >
          <Spinner primary />
        </div>
      )}
      {error && (
        <div className="p-8 flex items-center w-full bg-white rounded">
          <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>
        </div>
      )}
      {domainsInfo.map((domain, i) => (
        <DomainRow
          key={domain.domainName}
          onDeleteClick={handleDelete}
          onVerifyClick={handleVerify}
          app={app}
          domain={domain}
          isLastRow={domainsInfo.length - 1 === i}
        />
      ))}
    </div>
  );
};

export default connect<Props, ContextProps>(Domain, [
  { Context: RootContext, props: ["api"] },
  { Context: EnvironmentContext, props: ["environment", "app"] },
  { Context: DomainModal, props: ["toggleModal"], wrap: true },
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
]);
