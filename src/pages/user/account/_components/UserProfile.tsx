import { useContext, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import LaunchIcon from "@mui/icons-material/Launch";
import { grey, orange } from "@mui/material/colors";
import { formattedBytes } from "~/utils/helpers/string";
import { AuthContext } from "~/pages/auth/Auth.context";
import { RootContext } from "~/pages/Root.context";
import ConfirmModal from "~/components/ConfirmModal";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardRow from "~/components/CardRow";
import CardFooter from "~/components/CardFooter";
import UserAvatar from "~/components/UserAvatar";
import CopyBox from "~/components/CopyBox";
import api from "~/utils/api/Api";
import { deleteUser } from "../actions";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{
          position: "relative",
          zIndex: 1,
          color: props.color,
          ...props.sx,
        }}
      />
      <CircularProgress
        variant="determinate"
        sx={{
          position: "absolute",
          color: grey[800],
          zIndex: 0,
        }}
        value={100}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface UsageRowProps {
  progress: number;
  label: string;
  used: string;
  max: string;
  color: string;
}

function UsageRow({ progress, label, used, max, color }: UsageRowProps) {
  return (
    <CardRow>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          gap: 2,
        }}
      >
        <CircularProgressWithLabel value={progress} sx={{ color }} />
        <Box>
          <Typography>{label}</Typography>
          <Typography data-testid={`${label}-usage`}>
            {used}{" "}
            <Typography component="span" color="text.secondary">
              out of {max}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </CardRow>
  );
}

interface Props {
  user: User;
  metrics?: UserMetrics;
}

const portalLink = {
  dev: "https://billing.stripe.com/p/login/test_4gw9CvdOF3eabhSeUU",
  prod: "https://billing.stripe.com/p/login/9AQ7sKfcx2Or41ibII",
}[process.env.NODE_ENV === "development" ? "dev" : "prod"];

const paymentLink = {
  premium: "https://buy.stripe.com/7sY3cwebC1TEesO8qXbAs06",
  ultimate: "https://buy.stripe.com/eVacOwbDc3dW2IgdQU",
};

const formatNumber = (num: number) => {
  return num.toLocaleString("en-US");
};

interface SubscriptionDetailsProps {
  edition?: "cloud" | "self-hosted" | "development";
  metrics?: UserMetrics;
  user?: User;
}

function SubscriptionDetails({
  edition,
  metrics,
  user,
}: SubscriptionDetailsProps) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 4,
        }}
      >
        <Typography variant="h2" sx={{ fontSize: 20, flex: 1 }}>
          Subscription details
        </Typography>
        <Button
          endIcon={<LaunchIcon />}
          variant="contained"
          color="secondary"
          href={user?.package.id === "free" ? paymentLink.premium : portalLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Manage subscription
        </Button>
      </Box>
      {edition !== "cloud" ? (
        <Alert color="warning" sx={{ mx: 4, mb: 4 }}>
          <Typography>
            Visit your Cloud Account on{" "}
            <Link href="https://app.stormkit.io" target="_blank">
              app.stormkit.io
            </Link>{" "}
            to manage your subscription.
          </Typography>
        </Alert>
      ) : metrics ? (
        <>
          <UsageRow
            label="Build minutes"
            color="success.main"
            used={formatNumber(metrics.used.buildMinutes)}
            max={formatNumber(metrics.max.buildMinutes)}
            progress={
              (metrics.used.buildMinutes / metrics.max.buildMinutes) * 100
            }
          />

          <UsageRow
            label="Bandwidth"
            color="info.main"
            used={formattedBytes(metrics.used.bandwidthInBytes, { si: true })}
            max={formattedBytes(metrics.max.bandwidthInBytes, { si: true })}
            progress={
              (metrics.used.bandwidthInBytes / metrics.max.bandwidthInBytes) *
              100
            }
          />

          <UsageRow
            label="Function invocations"
            color="warning.main"
            used={formatNumber(metrics.used.functionInvocations)}
            max={formatNumber(metrics.max.functionInvocations)}
            progress={
              (metrics.used.functionInvocations /
                metrics.max.functionInvocations) *
              100
            }
          />

          <UsageRow
            label="Storage"
            color={orange[500]}
            used={formattedBytes(metrics.used.storageInBytes, { si: true })}
            max={formattedBytes(metrics.max.storageInBytes, { si: true })}
            progress={
              (metrics.used.storageInBytes / metrics.max.storageInBytes) * 100
            }
          />
        </>
      ) : (
        ""
      )}
    </Box>
  );
}

interface UseFetchLicenseProps {
  edition?: "cloud" | "self-hosted" | "development";
  user?: User;
  refreshToken: number;
}

const useFetchLicense = ({
  edition,
  user,
  refreshToken,
}: UseFetchLicenseProps) => {
  const [license, setLicense] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (edition !== "cloud" || user?.package.id === "free") {
      setLoading(false);
      return;
    }

    api
      .fetch<{ license: License | null }>("/user/license")
      .then(({ license }) => {
        if (license) {
          setLicense(license.raw);
        }
      })
      .catch(() => {
        setError("Something went wrong while fetching license");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshToken, edition, user?.package?.id]);

  return { license, error, loading };
};

function License({ edition, user }: SubscriptionDetailsProps) {
  const [generateError, setGenerateError] = useState<string>();
  const [generateLoading, setGenerateLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const { license, loading, error } = useFetchLicense({
    edition,
    refreshToken,
    user,
  });

  if (edition !== "cloud") {
    return;
  }

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 20, flex: 1, p: 4 }}>
        Self-Hosted License
      </Typography>
      {error || generateError ? (
        <Alert color="error" sx={{ mx: 4, mb: 4 }}>
          <Typography>{error || generateError}</Typography>
        </Alert>
      ) : user?.package.id === "free" ? (
        <Alert color="warning" sx={{ mx: 4, mb: 4 }}>
          <Typography>
            Upgrade your package to issue a Self-Hosted License.
          </Typography>
        </Alert>
      ) : !license && !loading ? (
        <Alert
          color="info"
          sx={{ mx: 4, mb: 4, display: "flex", alignItems: "center" }}
        >
          <Typography>
            No Self-Hosted License found.{" "}
            <Button
              variant="text"
              color="secondary"
              size="small"
              loading={generateLoading}
              sx={{ m: 0 }}
              onClick={() => {
                setGenerateLoading(true);
                setGenerateError(undefined);

                api
                  .post<{ key?: string; error?: string }>("/user/license")
                  .then(({ key, error }) => {
                    if (key) {
                      setRefreshToken(Date.now());
                    } else if (error) {
                      setGenerateError(error);
                    }
                  })
                  .catch(() => {
                    setGenerateError(
                      "Something went wrong while issuing license"
                    );
                  })
                  .finally(() => {
                    setGenerateLoading(false);
                  });
              }}
            >
              Click here to issue one.
            </Button>
          </Typography>
        </Alert>
      ) : (
        <Box sx={{ mx: 4, mb: 4 }}>
          <CopyBox
            type="password"
            variant="filled"
            label="License Key"
            value={license}
          />
        </Box>
      )}
    </Box>
  );
}

export default function UserProfile({ user, metrics }: Props) {
  const { details } = useContext(RootContext);
  const memberSince = useMemo(() => {
    return new Date(user.memberSince * 1000).toLocaleDateString("en", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  }, [user.memberSince]);

  const { logout } = useContext(AuthContext);

  const [delAccountConfirm, toggleDelAccountConfirm] = useState(false);

  if (!user) {
    return <></>;
  }

  return (
    <Card contentPadding={false}>
      <CardHeader title="Account settings">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <UserAvatar
            user={user}
            sx={{ width: "7rem", height: "7rem", margin: "0 auto", mb: 2 }}
          />
          <Typography sx={{ mb: 4 }}>
            {user.fullName?.trim() || user.displayName}
            <br />
            {user.email}
            <br />
            <Typography component="span" sx={{ color: "text.secondary" }}>
              Member since {memberSince}
            </Typography>
          </Typography>
        </Box>
      </CardHeader>
      <SubscriptionDetails
        user={user}
        metrics={metrics}
        edition={details?.stormkit?.edition}
      />
      <License user={user} edition={details?.stormkit?.edition} />
      <CardFooter>
        <Button
          variant="outlined"
          type="submit"
          onClick={e => {
            e.preventDefault();
            toggleDelAccountConfirm(true);
          }}
        >
          Delete Account
        </Button>
      </CardFooter>
      {delAccountConfirm && (
        <ConfirmModal
          typeConfirmationText="Permanently delete account"
          onCancel={() => {
            toggleDelAccountConfirm(false);
          }}
          onConfirm={({ setLoading, setError }) => {
            setLoading(true);

            deleteUser()
              .then(() => {
                if (logout) logout();
              })
              .catch(() => {
                setLoading(false);
                setError(
                  "Something went wrong while deleting your account please contact us via email or discord."
                );
              });
          }}
        >
          This will completely remove the account. All associated files and
          endpoints will be gone. Remember there is no going back from here.
        </ConfirmModal>
      )}
    </Card>
  );
}
