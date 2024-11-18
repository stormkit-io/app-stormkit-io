import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import { useFetchInstanceDetails } from "./actions";

const LS_UPDATE_KEY = "STORMKIT_UPDATE";

export default function UpdateSnackbar() {
  const [isToasterOpen, setIsToasterOpen] = useState(false);
  const { details } = useFetchInstanceDetails();

  useEffect(() => {
    if (details?.update) {
      setIsToasterOpen(true);
    }
  }, [details?.update]);

  const previouslyDismissed =
    localStorage.getItem(LS_UPDATE_KEY)?.replace(/"/g, "") ===
    details?.latest?.apiVersion;

  if (!details || !details.stormkit?.selfHosted || previouslyDismissed) {
    return <></>;
  }

  const handleCloseUpdate = () => {
    setIsToasterOpen(false);
    localStorage.setItem(LS_UPDATE_KEY, details?.latest?.apiVersion || "");
  };

  const updateMessage = details?.update?.api
    ? "Stormkit API has a newer version"
    : "";

  if (updateMessage === "") {
    return <></>;
  }

  return (
    <Snackbar
      open={isToasterOpen}
      message={updateMessage}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleCloseUpdate}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}
