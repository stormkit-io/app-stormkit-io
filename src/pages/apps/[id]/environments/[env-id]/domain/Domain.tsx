import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "~/pages/apps/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import ConfirmModal from "~/components/ConfirmModal";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import { PlusButton } from "~/components/Buttons";
import { useDomainLookup, deleteDomain, fetchDomainsInfo } from "./actions";
import DomainModal from "./_components/DomainModal";
import DomainRow from "./_components/DomainRow";

interface Props {
  app: App;
  environment: Environment;
}

interface HandleVerifyProps {
  setLoading: SetLoading;
  setError: SetError;
}

const Domain: React.FC<Props> = () => {
  const history = useHistory();
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [domainName, setDomainName] = useState("");
  const [isDomainModalOpen, toggleDomainModal] = useState(false);
  const [isConfirmModalOpen, toggleConfirmModal] = useState(false);
  const info = useDomainLookup({ app, environment });
  const { loading, error, domainsInfo, setDomainsInfo } = info;

  const handleVerify = ({
    setLoading,
    setError,
  }: HandleVerifyProps): Promise<void> => {
    return fetchDomainsInfo({
      app,
      unmounted: false,
      environment,
      setDomainsInfo,
      setLoading,
      setError,
    });
  };

  const handleDelete = (domainName: string) => {
    setDomainName(domainName);
    toggleConfirmModal(true);
  };

  return (
    <div className="flex flex-col mt-4">
      <div className="flex bg-white rounded mb-4 p-8 items-center">
        <h2 className="text-lg font-bold flex flex-auto">Domain information</h2>
        {domainsInfo.length === 0 && !loading && (
          <div className="flex-shrink-0">
            {isDomainModalOpen && (
              <DomainModal onClose={() => toggleDomainModal(false)} />
            )}
            <PlusButton
              size="small"
              text="New domain"
              onClick={() => {
                toggleDomainModal(true);
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
      {isConfirmModalOpen && (
        <ConfirmModal
          onCancel={() => toggleConfirmModal(false)}
          onConfirm={({ setLoading, setError }) => {
            deleteDomain({
              app,
              environment,
              domainName,
              setLoading,
              setError,
              history,
            }).then(() => toggleConfirmModal(false));
          }}
        >
          This will completely remove the domain and it won't be reachable
          anymore.
        </ConfirmModal>
      )}
    </div>
  );
};

export default Domain;
