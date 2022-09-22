import React from "react";
import Link from "~/components/Link";

const Sha: React.FC<{ repo: string; provider: Provider; sha?: string }> = ({
  repo,
  provider,
  sha,
}) => {
  if (!sha) {
    return <></>;
  }

  const shaShort = sha.substring(0, 8);
  let link = "";

  if (provider == "github") {
    link = `${repo.replace("github", "github.com")}/commit/${shaShort}`;
  } else if (provider == "gitlab") {
    link = `${repo.replace("gitlab", "gitlab.com")}/-/commit/${shaShort}`;
  } else {
    link = `${repo.replace("bitbucket", "bitbucket.org")}/commits/${shaShort}`;
  }

  return (
    <>
      ,{" "}
      <Link to={`https://${link}`} className="font-bold text-white">
        #{sha.substring(0, 6)}
      </Link>
    </>
  );
};

export default Sha;
