import React, { useState } from "react";
import * as buttons from "~/components/Buttons";
import Form from "~/components/FormV2";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";

interface Props {
  loading?: boolean;
  error?: React.ReactNode;
  onSubmit: (values: any) => void;
}

const { GithubButton, GitlabButton, BitbucketButton } = buttons;

const provider: Record<Provider, string> = {
  github: "GitHub",
  bitbucket: "BitBucket",
  gitlab: "GitLab",
};

export const ReferralForm: React.FC<Props> = ({ onSubmit, loading, error }) => {
  const [checked, setChecked] = useState<Provider>("github");

  return (
    <Form handleSubmit={onSubmit}>
      <div className="flex flex-col md:flex-row justify-center md:justify-around">
        <GithubButton
          onClick={() => setChecked("github")}
          className="max-w-none md:mr-4 mb-4 md:mb-0"
          itemsCenter
        >
          <Form.Radio
            value="github"
            name="provider"
            style={{ background: checked !== "github" ? "white" : "green" }}
            checked={checked === "github"}
          />
        </GithubButton>
        <BitbucketButton
          onClick={() => setChecked("bitbucket")}
          className="max-w-none md:mr-4 mb-4 md:mb-0"
          itemsCenter
        >
          <Form.Radio
            value="bitbucket"
            name="provider"
            style={{
              background: checked !== "bitbucket" ? "white" : "green",
            }}
            checked={checked === "bitbucket"}
          />
        </BitbucketButton>
        <GitlabButton
          className="max-w-none"
          onClick={() => setChecked("gitlab")}
          itemsCenter
        >
          <Form.Radio
            value="gitlab"
            name="provider"
            style={{ background: checked !== "gitlab" ? "white" : "green" }}
            checked={checked === "gitlab"}
          />
        </GitlabButton>
      </div>
      <Form.WithLabel
        label="Username"
        className="px-0"
        tooltip={
          <p>
            Specify the <b>{provider[checked]}</b> username of the new member to
            be invited.
          </p>
        }
      >
        <Form.Input name="displayName" autoFocus required fullWidth />
      </Form.WithLabel>
      {error && (
        <InfoBox type={InfoBox.ERROR} className="mb-4">
          {error}
        </InfoBox>
      )}
      <div className="flex justify-end mb-4">
        <Button category="action" loading={loading}>
          Invite user
        </Button>
      </div>
    </Form>
  );
};

export default ReferralForm;
