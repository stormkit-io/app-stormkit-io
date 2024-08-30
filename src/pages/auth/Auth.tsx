import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import qs from "query-string";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import Logo from "~/components/Logo";
import { AuthContext } from "./Auth.context";
import {
  GithubButton,
  BitbucketButton,
  GitlabButton,
} from "~/components/Buttons";
import { LocalStorage } from "~/utils/storage";
import { useFetchActiveProviders } from "./actions";

export default function Auth() {
  const { user, authError, loginOauth } = useContext(AuthContext);
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

  const referral = new URLSearchParams(location.search).get("referral");

  if (referral !== null) {
    // set cookie for a week
    LocalStorage.set("referral", referral);
  }

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
        sx={{
          flexDirection: "column",
          position: "relative",
          maxWidth: "62rem",
        }}
      >
        <Box sx={{ mb: 8, display: "flex", justifyContent: "center" }}>
          <Logo iconSize={150} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", lg: "row" },
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
              pt: { xs: 0, lg: 6 },
              maxWidth: { sm: "28rem" },
            }}
          >
            <Typography sx={{ lineHeight: 2 }}>
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
            <Box component="ul" sx={{ mt: 4, lineHeight: 2 }}>
              <Box component="li">
                <i className="fas fa-undo-alt mr-4" /> Environments with instant
                rollbacks
              </Box>
              <Box component="li">
                <i className="fas fa-shield-alt mr-4" /> Custom domains &amp;
                automated SSL
              </Box>
              <Box component="li">
                <i className="fas fa-cloud mr-3" /> Serverless functions
              </Box>
            </Box>
          </Box>
          <Card
            sx={{
              px: 3,
              maxWidth: { sm: "28rem" },
              minWidth: { sm: "28rem" },
            }}
            error={authError}
            loading={loading}
          >
            <CardHeader
              title="Authentication"
              subtitle="Log in with your provider"
              sx={{ textAlign: "center" }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                px: 4,
                mb: authError ? 4 : 2,
              }}
            >
              {providers?.github && (
                <GithubButton
                  sx={{ mb: providers?.gitlab || providers.bitbucket ? 4 : 0 }}
                  onClick={() => loginOauth?.("github")}
                />
              )}
              {providers?.gitlab && (
                <GitlabButton
                  sx={{ mb: providers?.bitbucket ? 4 : 0 }}
                  onClick={() => loginOauth?.("gitlab")}
                />
              )}
              {providers?.bitbucket && (
                <BitbucketButton onClick={() => loginOauth?.("bitbucket")} />
              )}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
