import React from "react";

const Author: React.FC<{ author?: string }> = ({ author }) => {
  if (!author) {
    return <></>;
  }

  return <>by {author.split("<")[0].trim()}</>;
};

export default Author;
