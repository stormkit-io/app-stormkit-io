import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import DefaultLayout from "~/layouts/DefaultLayout";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import Spinner from "~/components/Spinner";
import Link from "~/components/Link";
import ExplanationBox from "~/components/ExplanationBox";
import { useFetchAppList } from "./actions";
import AppRow from "./_components/AppRow";

export const Home = ({ api }) => {
  const { apps, loading, error } = useFetchAppList({ api });

  if (apps.length === 0 && !loading) {
    return <Redirect to="/apps/new" />;
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col w-full mb-4">
        <div className="font-bold">
          <h1 className="text-lg text-pink-50 mb-2">My Apps</h1>
          <h2 className="text-2xl text-white mb-6">Overview</h2>
        </div>
        <div className="flex flex-auto">
          <div className="bg-white rounded-lg p-6 mr-6 flex-auto">
            {!loading && error && <InfoBox error>{error}</InfoBox>}
            {loading && (
              <div className="flex w-full items-center justify-center">
                <Spinner primary width={8} height={8} />
              </div>
            )}
            {!loading && !error && (
              <>
                {apps.map((app) => (
                  <AppRow key={app.id} {...app} />
                ))}
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

Home.propTypes = {
  api: PropTypes.object,
};

export default connect(Home, [{ Context: RootContext, props: ["api"] }]);
