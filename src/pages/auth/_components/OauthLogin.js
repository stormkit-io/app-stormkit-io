import React from "react";
import PropTypes from "prop-types";
import { connect } from "~/utils/context";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import ProviderButton from "~/components/Buttons/_components/ProviderButton";
import AuthContext from "../Auth.context";

const logins = [
  { text: "GitHub", id: "github" },
  { text: "Bitbucket", id: "bitbucket" },
  { text: "GitLab", id: "gitlab" }
];

const OauthLogin = ({ loginOauth, error }) => (
  <>
    {logins.map((login, i) => (
      <Form
        handleSubmit={loginOauth(login.id)}
        key={login.id}
        className={`mb-${i === logins.length - 1 ? "0" : "8"}`}
      >
        <ProviderButton provider={login.id} text={login.text} type="submit">
          {login.id === "bitbucket" && (
            <span className="inline-block w-4">&nbsp;</span>
          )}
        </ProviderButton>
      </Form>
    ))}
    {error && <InfoBox className="mt-4">{error}</InfoBox>}
  </>
);

OauthLogin.propTypes = {
  loginOauth: PropTypes.func,
  error: PropTypes.string
};

export default connect(OauthLogin, [
  {
    Context: AuthContext,
    props: ["loginOauth", "error"]
  }
]);
