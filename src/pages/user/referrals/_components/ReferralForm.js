import React, { useState } from "react";
import PropTypes from "prop-types";
import * as buttons from "~/components/Buttons";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";

const { GithubButton, GitlabButton, BitbucketButton } = buttons;
const provider = { github: "GitHub", bitbucket: "BitBucket", gitlab: "GitLab" };

export const ReferralForm = ({ onSubmit, loading, error }) => {
  const [checked, setChecked] = useState("github");

  return (
    <Form handleSubmit={onSubmit}>
      <div className="flex justify-around">
        <GithubButton onClick={() => setChecked("github")}>
          <Form.Radio
            value="github"
            name="provider"
            checked={checked === "github"}
          />
        </GithubButton>
        <BitbucketButton
          onClick={() => setChecked("bitbucket")}
          className="mx-4"
        >
          <Form.Radio
            value="bitbucket"
            name="provider"
            checked={checked === "bitbucket"}
          />
        </BitbucketButton>
        <GitlabButton onClick={() => setChecked("gitlab")}>
          <Form.Radio
            value="gitlab"
            name="provider"
            checked={checked === "gitlab"}
          />
        </GitlabButton>
      </div>
      <div className="mb-4 p-4 rounded bg-gray-85 mt-8">
        <Form.Input
          label="Username"
          name="displayName"
          autoFocus
          className="bg-white"
          required
          fullWidth
          inputProps={{
            "aria-label": "User display name"
          }}
        />
        <p className="opacity-50 text-sm pt-2">
          Specify the <b>{provider[checked]}</b> username of the new member to
          be invited.
        </p>
      </div>
      {error && (
        <InfoBox type={InfoBox.ERROR} className="mt-4">
          {error}
        </InfoBox>
      )}
      <div className="flex justify-end mt-4">
        <Button primary loading={loading}>
          Invite user
        </Button>
      </div>
    </Form>
  );
};

ReferralForm.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.node,
  onSubmit: PropTypes.func
};

export default ReferralForm;
