import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import cn from "classnames";
import emptyListSvg from "~/assets/images/empty-list.svg";
import Container from "~/components/Container";
import InfoBox from "~/components/InfoBoxV2";
import Spinner from "~/components/Spinner";
import ConfirmModal from "~/components/ConfirmModal";
import Button from "~/components/ButtonV2";
import DomainModal from "./DomainModal";
import DomainVerificationStatus from "./DomainVerificationStatus";
import DomainTLSStatus from "./DomainTLSStatus";
import { useDomainLookup, deleteDomain } from "./actions";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (val: number) => void;
}

const isTopLevel = (domainName: string): boolean => {
  return domainName?.split(".")?.length === 2;
};

const TabDomainConfig: React.FC<Props> = ({
  app,
  environment,
  setRefreshToken,
}) => {
  const [isDomainModalOpen, toggleDomainModal] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<string>();
  const info = useDomainLookup({ app, environment });
  const { loading, error, domainsInfo, setDomainsInfo } = info;

  return (
    <Container
      title="Custom domain"
      maxWidth="max-w-none"
      actions={
        domainsInfo.length === 0 &&
        !loading && (
          <Button
            onClick={() => toggleDomainModal(true)}
            type="button"
            category="button"
          >
            Configure domain
          </Button>
        )
      }
    >
      {loading && (
        <div
          data-testid="domain-spinner"
          className="p-8 flex items-center w-full"
        >
          <Spinner primary />
        </div>
      )}
      {error && (
        <div className="p-8 flex items-center w-full bg-white rounded">
          <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>
        </div>
      )}
      {domainsInfo.length > 0 && (
        <div className="pb-4">
          {domainsInfo.map((domain, i) => (
            <div
              key={domain.domainName || i}
              className={cn("bg-blue-10 mx-4 p-4", { "mt-4": i > 0 })}
            >
              <div className="flex items-center mb-4 border-b border-blue-20">
                <div className="bg-black p-4 md:min-w-56">Domain name</div>
                <div className="p-4 pr-0 flex justify-between items-center w-full">
                  <span>{domain.domainName}</span>
                  <Button
                    type="button"
                    category="button"
                    onClick={() => {
                      setDomainToDelete(domain.domainName);
                    }}
                  >
                    {domain.dns.verified ? "Remove" : "Cancel"}
                  </Button>
                </div>
              </div>
              <div className="flex items-center mb-4 border-b border-blue-20">
                <div className="bg-black p-4 md:min-w-56">
                  {isTopLevel(domain.domainName) ? "A Record" : "CNAME"}
                </div>
                <div className="p-4 pr-0 flex justify-between items-center w-full">
                  <span>
                    {isTopLevel(domain.domainName)
                      ? "3.64.188.62"
                      : `${app.displayName}.stormkit.dev`}
                  </span>
                  <Tooltip
                    title={
                      "Domain should point to this value. This can be configured inside your DNS provider."
                    }
                    arrow
                    classes={{
                      tooltip: "bg-black custom-tooltip p-4 text-sm",
                      arrow: "text-black",
                    }}
                  >
                    <span className="fas fa-question-circle" />
                  </Tooltip>
                </div>
              </div>
              <DomainVerificationStatus
                app={app}
                environment={environment}
                domain={domain}
                setDomainsInfo={setDomainsInfo}
              />
              <DomainTLSStatus domain={domain} />
            </div>
          ))}
        </div>
      )}
      {!loading && !error && !domainsInfo.length && (
        <div className="p-4 flex items-center justify-center flex-col">
          <p className="mt-8">
            <img src={emptyListSvg} alt="No feature flags" />
          </p>
          <p className="mt-12">No custom domain configuration found.</p>
          <p>Add a domain to serve your app directly from it.</p>
        </div>
      )}
      {domainToDelete && (
        <ConfirmModal
          onCancel={() => setDomainToDelete(undefined)}
          onConfirm={({ setLoading, setError }) => {
            setLoading(true);
            deleteDomain({
              app,
              environment,
              domainName: domainToDelete,
            })
              .then(() => {
                setDomainToDelete(undefined);
                setRefreshToken(Date.now());
              })
              .catch(res => {
                setError(
                  res.status === 400
                    ? "Please provide a valid domain name."
                    : res.status === 429
                    ? "You have issued too many requests. Please wait a while before retrying."
                    : "Something went wrong while setting up the domain. Make sure it is a valid domain."
                );
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <p>
            This will completely remove the domain and it won't be reachable
            anymore.
          </p>
        </ConfirmModal>
      )}
      {isDomainModalOpen && (
        <DomainModal
          setRefreshToken={setRefreshToken}
          onClose={() => toggleDomainModal(false)}
        />
      )}
    </Container>
  );
};

export default TabDomainConfig;
