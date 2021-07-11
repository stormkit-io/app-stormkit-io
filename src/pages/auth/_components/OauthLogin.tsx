import React from "react";
import { connect } from "~/utils/context";
import InfoBox from "~/components/InfoBox";
import ProviderButton from "~/components/Buttons/_components/ProviderButton";
import AuthContext, { AuthContextProps } from "../Auth.context";

interface LoginItem {
  text: "GitHub" | "Bitbucket" | "GitLab";
  id: Provider;
}

const logins: Array<LoginItem> = [
  { text: "GitHub", id: "github" },
  { text: "Bitbucket", id: "bitbucket" },
  { text: "GitLab", id: "gitlab" },
];

const OauthLogin: React.FC<AuthContextProps> = ({
  loginOauth,
  error,
}): React.ReactElement => (
  <>
    {logins.map((login, i) => (
      <ProviderButton
        key={login.id}
        className={`mb-${i === logins.length - 1 ? "0" : "8"}`}
        provider={login.id}
        text={login.text}
        onClick={() => loginOauth(login.id)}
      >
        {login.id === "bitbucket" && (
          <span className="inline-block w-4">&nbsp;</span>
        )}
      </ProviderButton>
    ))}
    {error && <InfoBox className="mt-4">{error}</InfoBox>}
  </>
);

export default connect<unknown, AuthContextProps>(OauthLogin, [
  {
    Context: AuthContext,
    props: ["loginOauth", "error"],
  },
]);
