import React, { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import CardFooter from "~/components/CardFooter";
import CardHeader from "~/components/CardHeader";
import Modal from "~/components/Modal";
import Card from "~/components/Card";
import CardRow from "~/components/CardRow";
import CopyBox from "~/components/CopyBox";
import { useDomainLookup } from "./actions";
import { Tooltip } from "@mui/material";

interface Props {
  domain: Domain;
  app: App;
  environment: Environment;
  onClose: () => void;
}

const DomainVerificationStatus: React.FC<Props> = ({
  app,
  environment,
  domain,
  onClose,
}) => {
  const [refreshToken, setRefreshToken] = useState(0);
  const { error, loading, info } = useDomainLookup({
    appId: app.id,
    envId: environment.id!,
    domainId: domain.id,
    refreshToken,
  });

  return (
    <Modal open onClose={onClose}>
      <Card
        loading={loading}
        error={error}
        contentPadding={false}
        info={
          refreshToken > 0 && !info?.dns.verified
            ? "Domain is still not yet verified. If you updated your TXT record, please give it a bit time to propagate."
            : ""
        }
      >
        <CardHeader
          title={domain.domainName}
          subtitle="Follow these steps to verify your domain."
        />
        {info && (
          <Box>
            <CardRow>
              <Typography sx={{ color: grey[500], mb: 2 }}>Status</Typography>
              <Chip
                color={info.dns.verified ? "success" : undefined}
                sx={{ color: "white" }}
                label={info.dns.verified ? "verified" : "not yet verified"}
                size="small"
              />
            </CardRow>
            <CardRow>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Typography sx={{ color: grey[500], mb: 2 }}>
                  TXT Lookup Value
                </Typography>
                <Tooltip placement="top" title="You can verify if the TXT value is propagated from https://mxtoolbox.com/txtlookup.aspx">
                  <span className="fas fa-question-circle" />
                </Tooltip>
              </Box>
              <Chip
                sx={{ color: "white" }}
                label={info.dns.txt.lookup}
                size="small"
              />
            </CardRow>

            <CardRow sx={{ mb: refreshToken > 0 ? 1 : 0 }}>
              <Typography sx={{ color: grey[500], mb: 2 }}>
                Login to your external DNS provider and create the following TXT
                record.
              </Typography>
              <CopyBox
                value={info.dns.txt.name}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Txt Host"
                variant="outlined"
                margin="normal"
              />
              <CopyBox
                value={info.dns.txt.value}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label="Txt Value"
                variant="outlined"
                margin="normal"
              />
            </CardRow>
          </Box>
        )}
        <CardFooter>
          <Button
            color="secondary"
            variant="contained"
            loading={loading}
            onClick={() => {
              setRefreshToken(Date.now());
            }}
          >
            Verify now
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default DomainVerificationStatus;
