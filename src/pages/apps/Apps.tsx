import React from "react";
import { Location } from "history";
import { Redirect, useLocation } from "react-router-dom";
import { connect } from "~/utils/context";
import Api from "~/utils/api/Api";
import RootContext from "~/pages/Root.context";
import DefaultLayout from "~/layouts/DefaultLayout";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import Spinner from "~/components/Spinner";
import Link from "~/components/Link";
import ExplanationBox from "~/components/ExplanationBox";
import { useFetchAppList } from "./actions";
import { AppRow, Title } from "./_components";

interface Props {
  api: Api;
}

interface LocationState extends Location {
  repoInsert: boolean;
}

export const Home: React.FC<Props> = ({ api }): React.ReactElement => {
  const location = useLocation<LocationState>();
  const { apps, loading, error } = useFetchAppList({ api });

  if (apps.length === 0 && !loading) {
    return <Redirect to="/apps/new" />;
  }

  return (
    <DefaultLayout>
      {location.state?.repoInsert && (
        <InfoBox type={InfoBox.SUCCESS} toaster dismissable>
          <p className="flex-auto">
            Great, your app has been created! You can now start deploying.
          </p>
        </InfoBox>
      )}
      <section className="flex flex-col w-full mb-4">
        <Title>
          <Title.Main>My apps</Title.Main>
          <Title.Sub>Overview</Title.Sub>
        </Title>
        <div className="flex flex-auto">
          <div className="page-section mr-6 flex flex-col">
            {!loading && error && (
              <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>
            )}
            {loading && (
              <div className="flex w-full items-center justify-center">
                <Spinner primary width={8} height={8} />
              </div>
            )}
            {!loading && !error && (
              <>
                <div className="flex-auto">
                  {apps.map(app => (
                    <AppRow key={app.id} {...app} />
                  ))}
                </div>
                <div className="mt-4">
                  Want some extra features for free?{" "}
                  <Link to="/user/referral" secondary>
                    Invite friends
                  </Link>{" "}
                  and earn up to 3 months of Pro.
                </div>
              </>
            )}
          </div>
          <div className="w-1/3">
            <ExplanationBox title="Did you know?">
              <p>
                We keep a running instance of every one of your deploy versions
                across all your branches.
                <br />
                Whenever you push, we build it!
              </p>
            </ExplanationBox>
            <Button href="/apps/new" className="w-full mt-6" primary>
              New App
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default connect(Home, [{ Context: RootContext, props: ["api"] }]);
