import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RollbackIcon from "@mui/icons-material/RefreshOutlined";
import ShieldIcon from "@mui/icons-material/Shield";
import CloudIcon from "@mui/icons-material/Cloud";
import Skeleton from "@mui/material/Skeleton";
import qs from "query-string";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "~/components/Card";
import Logo from "~/components/Logo";
import { AuthContext } from "./Auth.context";
import { useFetchActiveProviders } from "./actions";
import BasicAuthRegister from "./BasicAuthRegister";
import BasicAuthLogin from "./BasicAuthLogin";
import ProviderAuth from "./ProviderAuth";
import { Link } from "@mui/material";

export default function Auth() {
  const { user } = useContext(AuthContext);
  const { providers, loading } = useFetchActiveProviders();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const { redirect = "/", template } = qs.parse(
        location.search.replace("?", "")
      );

      if (typeof redirect === "string") {
        if (template !== undefined) {
          navigate(`/clone?template=${template}`);
        } else {
          navigate(redirect);
        }
      }
    }
  }, [user]);

  if (user) {
    return null;
  }

  const isBasicAuth =
    !providers?.github && !providers?.gitlab && !providers?.bitbucket;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box sx={{ mb: 8, display: "flex", justifyContent: "center" }}>
          <Logo iconSize={150} />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            px: { xs: 1, lg: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mr: { lg: 8 },
              mb: { xs: 3, md: 0 },
              mt: { xs: 4, lg: 0 },
              px: 3,
              py: { xs: 0, md: 6 },
              order: { xs: 2, md: 1 },
              justifyContent: "center",
              maxWidth: { sm: "28rem" },
              minHeight: { xs: "auto", md: "27.5rem" },
            }}
          >
            <Typography sx={{ lineHeight: 2, fontSize: 14 }}>
              /def/{" "}
              <Typography component="span" color="secondary.dark">
                Noun.
              </Typography>
              <br />
              1. Serverless app development platform.
              <br />
              2. A set of tools built to save dev-ops time for your Javascript
              application.
            </Typography>
            <Box component="ul" sx={{ mt: 4 }}>
              <Typography
                component="li"
                sx={{ mb: 2, fontSize: 14 }}
                color="text.secondary"
              >
                <RollbackIcon sx={{ mr: 1 }} /> Environments with instant
                rollbacks
              </Typography>
              <Typography
                component="li"
                sx={{ mb: 2, fontSize: 14 }}
                color="text.secondary"
              >
                <ShieldIcon sx={{ mr: 1 }} /> Custom domains &amp; automated TLS
              </Typography>
              <Typography
                component="li"
                sx={{ fontSize: 14 }}
                color="text.secondary"
              >
                <CloudIcon sx={{ mr: 1 }} /> Serverless functions
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 4,
                pt: 2,
                textAlign: "center",
                borderTop: "1px solid",
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
              color="text.secondary"
            >
              By using Stormkit, you're agreeing to our{" "}
              <Link
                href="https://www.stormkit.io/policies/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                terms and services
              </Link>
              .
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              order: { xs: 1, md: 2 },
            }}
          >
            {loading ? (
              <Card sx={{ width: "100%", height: "100%" }}>
                <Skeleton variant="rectangular" height={30} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={30} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={30} />
              </Card>
            ) : !isBasicAuth ? (
              <ProviderAuth providers={providers} />
            ) : providers?.basicAuth === "enabled" ? (
              <BasicAuthLogin />
            ) : (
              <BasicAuthRegister />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
