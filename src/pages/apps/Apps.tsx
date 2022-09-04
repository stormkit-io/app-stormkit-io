import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorage } from "~/utils/storage";
import CenterLayout from "~/layouts/CenterLayout";
import Container from "~/components/Container";
import AppName from "~/components/AppName";
import Button from "~/components/ButtonV2";
import InfoBox from "~/components/InfoBox";
import Spinner from "~/components/Spinner";
import { useFetchAppList } from "./actions";
import { WelcomeModal } from "./_components";

const limit = 20;
const welcomeModalId = "welcome_modal";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState(0);
  const { apps, loading, error, hasNextPage } = useFetchAppList({ from });
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(
    LocalStorage.get(welcomeModalId) !== "shown"
  );

  useEffect(() => {
    if (apps.length === 0 && !loading) {
      navigate("/apps/new");
    }
  }, [apps, loading]);

  if (apps.length === 0 && !loading) {
    return null;
  }

  const isLoadingFirstTime = loading && apps.length === 0;

  return (
    <CenterLayout>
      <Container
        className={"flex-1"}
        title="My apps"
        actions={
          <Button href="/apps/new" category="action">
            Create new app
          </Button>
        }
      >
        <div className="flex flex-auto text-gray-80">
          <div className="w-full px-4">
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
                      onClick={() => setFrom(from + limit)}
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
    </CenterLayout>
  );
};

export default Home;
