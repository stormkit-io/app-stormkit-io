import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorage } from "~/utils/storage";
import { LS_PROVIDER } from "~/utils/api/Api";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import ImportExport from "@mui/icons-material/ImportExport";
import LinkIcon from "@mui/icons-material/Link";
import Typography from "@mui/material/Typography";
import { AuthContext } from "~/pages/auth/Auth.context";
import ButtonDropdown from "~/components/ButtonDropdown";
import AppName from "~/components/AppName";
import ContainerV2 from "~/components/ContainerV2";
import Form from "~/components/FormV2";
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
      <ContainerV2 title="Invalid provider">
        <Typography sx={{ p: 2, pt: 0 }}>
          We cannot detect the connected provider. Please login again.
        </Typography>
      </ContainerV2>
    );
  }

  const importFromProvider = `Import from ${providerToText[provider]}`;
  const isLoadingFirstTime = loading && apps.length === 0;

  if (isLoadingFirstTime) {
    return (
      <ContainerV2>
        <Box
          sx={{
            p: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
          }}
        >
          <Spinner primary width={8} height={8} />
        </Box>
      </ContainerV2>
    );
  }

  if (apps.length === 0 && !loading && !filter) {
    return (
      <ContainerV2>
        <Box sx={{ p: 4 }}>
          <EmptyList actionLink={newAppHref} actionText={importFromProvider} />
        </Box>
      </ContainerV2>
    );
  }

  return (
    <>
      <ContainerV2
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
                href: "/apps/new/url",
              },
            ]}
          />
        }
      >
        <div className="flex flex-auto text-gray-80">
          <div className="w-full px-4">
            <Form.Input
              fullWidth
              autoFocus
              placeholder="Search"
              aria-label="Search apps"
              className="mb-4"
              onChange={e => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                  setFrom(0);
                  setFilter(e.target.value);
                }, 250);
              }}
              InputProps={{
                startAdornment: (
                  <span className="fas fa-search mr-1 text-gray-80" />
                ),
              }}
            />
            {!loading && error && (
              <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>
            )}
            {!error && (
              <>
                <div className="flex-1 w-full">
                  {apps.length === 0 && (
                    <InfoBox>This search produced no results.</InfoBox>
                  )}
                  {apps.map(app => (
                    <Box
                      key={app.id}
                      bgcolor="container.paper"
                      sx={{
                        px: 2,
                        py: 3,
                        mb: 2,
                        width: "100%",
                        cursor: "pointer",
                        "&:hover": {
                          filter: "brightness(1.5)",
                          transition: "all 0.25s ease-in",
                        },
                      }}
                      tabIndex={0}
                      role="button"
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          navigate(`/apps/${app.id}`);
                        }
                      }}
                      onClick={() => {
                        navigate(`/apps/${app.id}`);
                      }}
                    >
                      <div className="flex">
                        <div className="flex flex-1">
                          <AppName app={app} withDisplayName imageWidth={23} />
                        </div>
                        <span className="fas fa-chevron-right text-base ml-2" />
                      </div>
                    </Box>
                  ))}
                </div>
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
          </div>
        </div>
      </ContainerV2>
      {!isLoadingFirstTime && (
        <WelcomeModal
          isOpen={isWelcomeModalOpen}
          toggleModal={setIsWelcomeModalOpen}
          welcomeModalId={welcomeModalId}
        />
      )}
    </>
  );
}
