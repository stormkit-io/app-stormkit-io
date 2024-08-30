import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import emptyListSvg from "~/assets/images/empty-list.svg";

interface Props {
  actionLink: string;
  actionText?: string;
}

const EmptyList: React.FC<Props> = ({
  actionLink,
  actionText = "Create new app",
}) => {
  return (
    <div className="text-center">
      <img src={emptyListSvg} alt="Empty app list" className="m-auto" />
      <Typography sx={{ my: 6 }}>
        It's quite empty in here.
        <br />
        Connect your repository to get started.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        href={actionLink}
        sx={{ mr: 2 }}
      >
        {actionText}
      </Button>
      or
      <Button
        variant="contained"
        color="secondary"
        href={`/apps/new/url`}
        sx={{ ml: 2 }}
      >
        Import from URL
      </Button>
    </div>
  );
};

export default EmptyList;
