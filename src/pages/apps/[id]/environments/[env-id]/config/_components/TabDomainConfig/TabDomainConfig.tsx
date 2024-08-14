import React, { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardRow from "~/components/CardRow";
import CardFooter from "~/components/CardFooter";
import EmptyPage from "~/components/EmptyPage";
import ConfirmModal from "~/components/ConfirmModal";
import { isSelfHosted } from "~/utils/helpers/instance";
import DomainModal from "./DomainModal";
import DomainVerifyModal from "./DomainVerifyModal";
import { deleteDomain, useFetchDomains } from "./actions";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (val: number) => void;
}

const TabDomainConfig: React.FC<Props> = ({ app, environment }) => {
  const selfHosted = useMemo(() => {
    return isSelfHosted();
  }, []);

  const [refreshToken, setRefreshToken] = useState(0);
  const [isDomainModalOpen, toggleDomainModal] = useState(false);
  const [domainToVerify, setDomainToVerify] = useState<Domain>();
  const [domainToDelete, setDomainToDelete] = useState<Domain>();
  const { domains, error, loading } = useFetchDomains({
    appId: app.id,
    envId: environment.id!,
    refreshToken,
    search: "",
  });

  return (
    <Card error={error} loading={loading} sx={{ color: "white" }}>
      <CardHeader
        title="Custom domains"
        subtitle="Set custom domains to serve your application from."
      />
      {!selfHosted && (
        <Alert color="info" sx={{ px: 4 }}>
          Use following A Records to point your domains:
          <Box sx={{ mt: 1 }}>
            <ArrowRightIcon /> 54.93.169.167
            <br />
            <ArrowRightIcon /> 3.64.188.62
          </Box>
        </Alert>
      )}
      <Box>
        {domains.map(domain => (
          <CardRow
            key={domain.id}
            chipLabel={
              domain.verified ? (
                "verified"
              ) : (
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={() => setDomainToVerify(domain)}
                >
                  verify now
                </Button>
              )
            }
            chipColor={domain.verified ? "success" : undefined}
            menuItems={[
              {
                text: "Delete",
                onClick: () => setDomainToDelete(domain),
              },
            ]}
          >
            <Typography sx={{ flex: 1 }}>{domain.domainName}</Typography>
          </CardRow>
        ))}
      </Box>
      {!loading && !error && !domains.length && (
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
              appId: app.id,
              envId: environment.id!,
              domainId: domainToDelete.id,
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
          This will completely remove the domain and it won't be reachable
          anymore.
        </ConfirmModal>
      )}
      {isDomainModalOpen && (
        <DomainModal
          setRefreshToken={setRefreshToken}
          onClose={() => toggleDomainModal(false)}
        />
      )}
      {domainToVerify && (
        <DomainVerifyModal
          domain={domainToVerify}
          environment={environment}
          app={app}
          onClose={() => {
            setDomainToVerify(undefined);
          }}
        />
      )}
    </Card>
  );
};

export default TabDomainConfig;
