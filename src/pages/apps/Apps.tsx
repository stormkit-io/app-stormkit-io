import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorage } from "~/utils/storage";
import { LS_PROVIDER } from "~/utils/api/Api";
import AppName from "~/components/AppName";
import Button from "~/components/ButtonV2";
import Container from "~/components/Container";
import Form from "~/components/FormV2";
import InfoBox from "~/components/InfoBoxV2";
import Spinner from "~/components/Spinner";
import { useFetchAppList } from "./actions";
import { WelcomeModal, EmptyList } from "./_components";

let timeout: NodeJS.Timeout;
const limit = 20;
const welcomeModalId = "welcome_modal";
const provider: string = LocalStorage.get(LS_PROVIDER);
const newAppHref = `/apps/new/${provider}`;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState(0);
  const [filter, setFilter] = useState("");
  const { apps, loading, error, hasNextPage } = useFetchAppList({
    from,
    filter,
  });

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(
    LocalStorage.get(welcomeModalId) !== "shown"
  );

  if (apps.length === 0 && !loading && !filter) {
    return (
      <Container className="flex flex-1 items-center justify-center">
        <EmptyList actionLink={newAppHref} />
      </Container>
    );
  }

  const isLoadingFirstTime = loading && apps.length === 0;

  return (
    <>
      <Container
        className={"flex-1"}
        title="My apps"
        actions={
          <Button href={newAppHref} category="action">
            Create new app
          </Button>
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
            {isLoadingFirstTime && (
              <div className="flex w-full items-center justify-center">
                <Spinner primary width={8} height={8} />
              </div>
            )}
            {!isLoadingFirstTime && !error && (
              <>
                <div className="flex-1 w-full">
                  {apps.length === 0 && (
                    <InfoBox>This search produced no results.</InfoBox>
                  )}
                  {apps.map(app => (
                    <div
                      key={app.id}
                      className="px-4 py-6 mb-4 bg-blue-10 w-full cursor-pointer hover:bg-black transition-colors"
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
                        <div className="flex-1">
                          <AppName app={app} withDisplayName />
                        </div>
                        <span className="fas fa-chevron-right text-base ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
                {hasNextPage && (
                  <div className="my-4 flex justify-center">
                    <Button
                      category="action"
                      loading={loading}
                      onClick={() => {
                        setFrom(from + limit);
                      }}
                    >
                      Load more
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
      {!isLoadingFirstTime && (
        <WelcomeModal
          isOpen={isWelcomeModalOpen}
          toggleModal={setIsWelcomeModalOpen}
          welcomeModalId={welcomeModalId}
        />
      )}
    </>
  );
};

export default Home;
