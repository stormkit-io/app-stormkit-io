import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import EmptyPage from "~/components/EmptyPage";
import ConfirmModal from "~/components/ConfirmModal";
import DomainModal from "./DomainModal";
import DomainVerificationStatus from "./DomainVerificationStatus";
import DomainTLSStatus from "./DomainTLSStatus";
import { useDomainLookup, deleteDomain } from "./actions";
import { Typography } from "@mui/material";

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
    <Card error={error} loading={loading} sx={{ color: "white" }}>
      <CardHeader
        title="Custom domain"
        subtitle="Set custom domains to serve your application from."
      />
      <Box>
        {domainsInfo.length > 0 && (
          <div className="pb-4">
            {domainsInfo.map((domain, i) => (
              <Box key={domain.domainName || i}>
                <div className="flex items-center mb-4 border-b border-blue-20">
                  <div className="bg-black p-4 md:min-w-56">Domain name</div>
                  <div className="pl-4 pr-0 flex justify-between items-center w-full">
                    <span>{domain.domainName}</span>
                    <Button
                      color="primary"
                      variant="outlined"
                      type="button"
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
              </Box>
            ))}
          </div>
        )}
      </Box>
      {!loading && !error && !domainsInfo.length && (
        <EmptyPage>
          <Typography component="span" sx={{ display: "block" }}>
            No custom domain configuration found.
          </Typography>
          <Typography component="span">
            Add a domain to serve your app directly from it.
          </Typography>
        </EmptyPage>
      )}
      <CardFooter>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => toggleDomainModal(true)}
          type="button"
        >
          Add domain
        </Button>
      </CardFooter>
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
    </Card>
  );
};

export default TabDomainConfig;
