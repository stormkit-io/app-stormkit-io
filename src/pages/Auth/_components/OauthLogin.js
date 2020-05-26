import React from "react";
import PropTypes from "prop-types";
import { connect } from "~/utils/context";
import Button from "~/components/Button";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import AuthContext from "../Auth.context";

const logins = [
  { text: "GitHub", id: "github" },
  { text: "Bitbucket", id: "bitbucket" },
  { text: "GitLab", id: "gitlab" },
];

const OauthLogin = ({ loginOauth, error }) => (
  <>
    {logins.map((login, i) => (
      <Form
        handleSubmit={loginOauth(login.id)}
        key={login.id}
        className={`mb-${i === logins.length - 1 ? "0" : "4"}`}
      >
        <Button
          className={[
            "w-full",
            "border",
            "border-blue-50",
            "items-center",
            `text-${login.id}`,
            `hover:bg-${login.id}`,
            "hover:text-white",
          ]}
        >
          {login.id === "bitbucket" && (
            <span className="inline-block w-4">&nbsp;</span>
          )}
          <span className={`text-xl mr-3 fab fa-${login.id}`} />
          <span>{login.text}</span>
        </Button>
      </Form>
    ))}
    {error && <InfoBox className="mt-4">{error}</InfoBox>}
  </>
);

OauthLogin.propTypes = {
  loginOauth: PropTypes.func,
  error: PropTypes.string,
};

export default connect(OauthLogin, [
  {
    Context: AuthContext,
    props: ["loginOauth", "error"],
  },
]);
