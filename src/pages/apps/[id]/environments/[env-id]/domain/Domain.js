import React from "react";
import PropTypes from "prop-types";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import EnvironmentContext from "~/pages/apps/[id]/environments/[env-id]/Environment.context";
import ConfirmModal from "~/components/ConfirmModal";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import { PlusButton } from "~/components/Buttons";
import { useDomainLookup, deleteDomain, fetchDomainsInfo } from "./actions";
import DomainModal from "./_components/DomainModal";
import DomainRow from "./_components/DomainRow";

const Domain = ({
  api,
  environment,
  app,
  toggleModal,
  confirmModal,
  history,
  location,
}) => {
  const info = useDomainLookup({ api, app, environment, location });
  const { loading, error, domainsInfo, setDomainsInfo } = info;

  const handleVerify = ({ setLoading, setError }) => {
    return fetchDomainsInfo({
      api,
      app,
      environment,
      withUXFix: true,
      setDomainsInfo,
      setLoading,
      setError,
    });
  };

  const handleDelete = (domainName) => {
    return confirmModal(
      "This will completely remove the domain and it won't be reachable anymore.",
      ({ setLoading, setError, closeModal }) => {
        deleteDomain({
          api,
          app,
          environment,
          domainName,
          setLoading,
          setError,
          history,
        }).then(closeModal);
      }
    );
  };

  return (
    <div className="flex flex-col mt-4">
      <div className="flex bg-white rounded mb-4 p-8 items-center">
        <h2 className="text-lg font-bold flex flex-auto">Domain information</h2>
        {domainsInfo.length === 0 && !loading && (
          <div className="flex-shrink-0">
            <DomainModal
              app={app}
              environment={environment}
              api={api}
              history={history}
            />
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
          onDelete={handleDelete}
          onVerify={handleVerify}
          app={app}
          domain={domain}
          isLastRow={domainsInfo.length - 1 === i}
        />
      ))}
    </div>
  );
};

Domain.propTypes = {
  environment: PropTypes.object,
  app: PropTypes.object,
  api: PropTypes.object,
  toggleModal: PropTypes.func,
  confirmModal: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default connect(Domain, [
  { Context: RootContext, props: ["api"] },
  { Context: EnvironmentContext, props: ["environment", "app"] },
  { Context: DomainModal, props: ["toggleModal"], wrap: true },
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
]);
