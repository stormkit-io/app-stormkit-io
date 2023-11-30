import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorage } from "~/utils/storage";
import { LS_PROVIDER } from "~/utils/api/Api";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import ImportExport from "@mui/icons-material/ImportExport";
import LinkIcon from "@mui/icons-material/Link";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForward from "@mui/icons-material/ArrowForwardIos";
import { AuthContext } from "~/pages/auth/Auth.context";
import ButtonDropdown from "~/components/ButtonDropdown";
import AppName from "~/components/AppName";
import InfoBox from "~/components/InfoBoxV2";
import Spinner from "~/components/Spinner";
import { useSelectedTeam } from "~/layouts/TopMenu/Teams/actions";
import { providerToText } from "~/utils/helpers/string";
import { useFetchAppList } from "./actions";
import { WelcomeModal, EmptyList } from "./_components";

let timeout: NodeJS.Timeout;
const limit = 20;
const welcomeModalId = "welcome_modal";

export default function Apps() {
  const navigate = useNavigate();
  const { teams } = useContext(AuthContext);
  const [from, setFrom] = useState(0);
  const [filter, setFilter] = useState("");
  const selectedTeam = useSelectedTeam({ teams });

  const { apps, loading, error, hasNextPage } = useFetchAppList({
    from,
    filter,
    teamId: selectedTeam?.id,
  });

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(
    LocalStorage.get(welcomeModalId) !== "shown"
  );

  const provider = LocalStorage.get<Provider>(LS_PROVIDER);
  const newAppHref = `/apps/new/${provider}`;

  if (!provider) {
    return (
      <Box maxWidth="md" sx={{ width: "100%", color: "white" }}>
        <Card error="We cannot detect the connected provider. Please login again.">
          <CardHeader title="Invalid provider" />
        </Card>
      </Box>
    );
  }

  const importFromProvider = `Import from ${providerToText[provider]}`;
  const isLoadingFirstTime = loading && apps.length === 0;

  if (isLoadingFirstTime) {
    return (
      <Box maxWidth="md" sx={{ width: "100%", color: "white" }}>
        <Card>
          <Box
            sx={{
              p: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
            }}
          >
            <Spinner primary width={8} height={8} />
          </Box>
        </Card>
      </Box>
    );
  }

  if (apps.length === 0 && !loading && !filter) {
    return (
      <Box sx={{ width: "100%", color: "white" }} maxWidth="md">
        <Card sx={{ p: 4 }}>
          <EmptyList actionLink={newAppHref} actionText={importFromProvider} />
        </Card>
      </Box>
    );
  }

  return (
    <Box maxWidth="md" sx={{ width: "100%", color: "white" }}>
      <Card
        errorTitle={false}
        error={
          !loading && apps.length === 0
            ? "This search produced no results."
            : ""
        }
      >
        <CardHeader
          title="My apps"
          actions={
            <ButtonDropdown
              buttonText="Create new app"
              items={[
                {
                  icon: <ImportExport />,
                  text: importFromProvider,
                  href: newAppHref,
                },
                {
                  icon: <LinkIcon />,
                  text: "Import from URL",
                  href: `/apps/new/url`,
                },
              ]}
            />
          }
        />
        <Box>
          <TextField
            fullWidth
            autoFocus
            placeholder="Search"
            aria-label="Search apps"
            label="Search apps"
            variant="filled"
            sx={{ mb: 4 }}
            onChange={e => {
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                setFrom(0);
                setFilter(e.target.value);
              }, 250);
            }}
            InputProps={{
              endAdornment: <SearchIcon sx={{ fontSize: 16 }} />,
            }}
          />
          {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
          {!error && (
            <>
              <Box>
                {apps.map(app => (
                  <Box
                    key={app.id}
                    bgcolor="container.paper"
                    sx={{
                      p: 2,
                      mb: 2,
                      width: "100%",
                      cursor: "pointer",
                      "&:hover": {
                        filter: "brightness(1.5)",
                        transition: "all 0.25s ease-in",
                      },
                      ":last-child": {
                        mb: 0,
                      },
                    }}
                    tabIndex={0}
                    role="button"
                    onKeyUp={e => {
                      if (e.key === "Enter") {
                        navigate(`/apps/${app.id}/environments`);
                      }
                    }}
                    onClick={() => {
                      navigate(`/apps/${app.id}/environments`);
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ display: "flex", flex: 1 }}>
                        <AppName app={app} withDisplayName imageWidth={23} />
                      </Box>
                      <ArrowForward sx={{ fontSize: 16 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
              {hasNextPage && (
                <div className="my-4 flex justify-center">
                  <LoadingButton
                    variant="contained"
                    color="secondary"
                    loading={loading}
                    onClick={() => {
                      setFrom(from + limit);
                    }}
                  >
                    Load more
                  </LoadingButton>
                </div>
              )}
            </>
          )}
        </Box>
      </Card>
      {!isLoadingFirstTime && (
        <WelcomeModal
          isOpen={isWelcomeModalOpen}
          toggleModal={setIsWelcomeModalOpen}
          welcomeModalId={welcomeModalId}
        />
      )}
    </Box>
  );
}
