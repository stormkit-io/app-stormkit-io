import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import qs from "query-string";
import Logo from "~/components/Logo";
import { AuthContext } from "./Auth.context";
import InfoBox from "~/components/InfoBoxV2";
import * as buttons from "~/components/Buttons";
import { LocalStorage } from "~/utils/storage";
import "./Auth.css";

const Auth: React.FC = () => {
  const { user, authError, loginOauth } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const { redirect = "/" } = qs.parse(location.search.replace("?", ""));

      if (typeof redirect === "string") {
        navigate(redirect);
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
    <>
      <div className="mb-16 text-center pt-6 sm:pt-0">
        <Logo iconOnly iconSize={20} />
      </div>
      <div className="flex flex-col-reverse sm:flex-row px-6 text-gray-80">
        <div className="flex flex-col sm:max-w-sm sm:mr-16 pt-12 mb-4 sm:mb-0">
          <p className="leading-loose text-base">
            /def/ <span className="text-pink-50">Noun.</span>
            <br />
            1. Serverless application development platform.
            <br />
            2. A set of tools built to save dev-ops time for your Javascript
            application.
          </p>
          <ul className="mt-8 rounded leading-loose">
            <li>
              <i className="fas fa-undo-alt mr-4" /> Environments with instant
              rollbacks
            </li>
            <li>
              <i className="fas fa-shield-alt mr-4" /> Custom domains &amp;
              automated SSL
            </li>
            <li>
              <i className="fas fa-cloud mr-3" /> Serverless functions
            </li>
          </ul>
        </div>
        <div className="auth-box p-6 py-12 bg-blue-50 text-center">
          <h1 className="font-bold text-xl">Authentication</h1>
          <p className="mt-2 mb-12 text-base">Log in with your provider</p>
          <div>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
