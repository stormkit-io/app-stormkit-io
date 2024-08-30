import { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import HttpsIcon from "@mui/icons-material/Https";
import WarningIcon from "@mui/icons-material/Warning";
import { yellow } from "@mui/material/colors";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardRow from "~/components/CardRow";
import CardFooter from "~/components/CardFooter";
import EmptyPage from "~/components/EmptyPage";
import ConfirmModal from "~/components/ConfirmModal";
import IconBg from "~/components/IconBg";
import { isSelfHosted } from "~/utils/helpers/instance";
import DomainModal from "./DomainModal";
import DomainVerifyModal from "./DomainVerifyModal";
import CustomCertModal from "./CustomCertModal";
import { deleteDomain, useFetchDomains } from "./actions";
import Dot from "~/components/Dot";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (val: number) => void;
}

export default function TabDomainConfig({ app, environment }: Props) {
  const selfHosted = useMemo(() => {
    return isSelfHosted();
  }, []);

  const [refreshToken, setRefreshToken] = useState(0);
  const [isDomainModalOpen, toggleDomainModal] = useState(false);
  const [domainToModifyCustomCert, toggleCustomCertModal] = useState<Domain>();
  const [success, setSuccess] = useState<string>();
  const [domainToVerify, setDomainToVerify] = useState<Domain>();
  const [domainToDelete, setDomainToDelete] = useState<Domain>();
  const { domains, error, loading } = useFetchDomains({
    appId: app.id,
    envId: environment.id!,
    refreshToken,
    search: "",
  });

  return (
    <Card error={error} success={success} loading={loading}>
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
              !domain.verified && (
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={() => setDomainToVerify(domain)}
                  sx={{ lineHeight: 1 }}
                >
                  verify now
                </Button>
              )
            }
            chipColor={domain.verified ? "success" : undefined}
            menuItems={[
              {
                text: "Custom certificate",
                onClick: () => toggleCustomCertModal(domain),
              },
              {
                text: "Delete",
                onClick: () => setDomainToDelete(domain),
              },
            ]}
          >
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
              <Typography sx={{ display: "inline-flex", alignItems: "center" }}>
                <IconBg>
                  {domain.verified ? (
                    <HttpsIcon color="success" sx={{ fontSize: 14 }} />
                  ) : (
                    <WarningIcon sx={{ color: yellow[500], fontSize: 14 }} />
                  )}
                </IconBg>
                {domain.domainName}
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: 12, color: "text.secondary", ml: 4.2 }}
              data-testid={`${domain.domainName}-status`}
            >
              Status: {!domain.verified ? "needs verification" : "verified"}
              {domain.customCert && (
                <>
                  <Dot sx={{ mx: 1 }} />
                  Custom certificate
                </>
              )}
            </Typography>
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
      {domainToModifyCustomCert && (
        <CustomCertModal
          appId={app.id}
          envId={environment.id!}
          domain={domainToModifyCustomCert}
          setSuccess={setSuccess}
          onClose={() => toggleCustomCertModal(undefined)}
          onUpdate={() => {
            setRefreshToken(Date.now());
            toggleCustomCertModal(undefined);
          }}
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
}
