import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import qs from "query-string";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Logo from "~/components/Logo";
import { AuthContext } from "./Auth.context";
import InfoBox from "~/components/InfoBoxV2";
import * as buttons from "~/components/Buttons";
import { LocalStorage } from "~/utils/storage";

const Auth: React.FC = () => {
  const { user, authError, loginOauth } = useContext(AuthContext);
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
        flexDirection: "column",
        position: "relative",
        top: { lg: -40 },
        maxWidth: "62rem",
      }}
    >
      <Box sx={{ mb: 8, display: "flex", justifyContent: "center" }}>
        <Logo iconSize={150} />
      </Box>
      <Box
        sx={{
          display: "flex",
          color: "white",
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
            px: { xs: 1, lg: 3 },
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
        <Box
          sx={{
            bgcolor: "rgba(0,0,0,0.25)",
            py: 6,
            px: 3,
            textAlign: "center",
            maxWidth: { sm: "28rem" },
            minWidth: { sm: "28rem" },
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold", fontSize: 20 }}>
            Authentication
          </Typography>
          <Typography sx={{ mb: 4, mt: 1, opacity: 0.5 }}>
            Log in with your provider
          </Typography>
          <Box>
            <buttons.GithubButton
              onClick={() => loginOauth?.("github")}
              className="mb-8 mx-12"
            />
            <buttons.GitlabButton
              onClick={() => loginOauth?.("gitlab")}
              className="mb-8 mx-12"
            />
            <buttons.BitbucketButton
              onClick={() => loginOauth?.("bitbucket")}
              className="mx-12"
            />
            {authError && <InfoBox className="mt-8 mx-10">{authError}</InfoBox>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;
