import { useContext, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { AuthContext } from "~/pages/auth/Auth.context";
import ConfirmModal from "~/components/ConfirmModal";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { deleteUser } from "../actions";

interface Props {
  user: User;
}

export default function UserProfile({ user }: Props) {
  const memberSince = useMemo(() => {
    return new Date(user.memberSince * 1000).toLocaleDateString("en", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  }, [user.memberSince]);

  const { logout } = useContext(AuthContext);
  const [deleteAccountConfirmModal, toggleDeleteAccountConfirmModal] =
    useState(false);

  return (
    <Card>
      <CardHeader title="Account settings" />
      <Box>
        <Box sx={{ display: "flex", flexDirection: "column", mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              textAlign: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                borderRadius: "100%",
                width: "7rem",
                height: "7rem",
                overflow: "hidden",
                margin: "0 auto",
                mb: 2,
              }}
            >
              <Box component="img" src={user.avatar} alt="User Profile" />
            </Box>
            <Typography>
              {user.fullName.trim() || user.displayName}
              <br />
              {user.email}
              <br />
              <Typography component="span" sx={{ color: "text.secondary" }}>
                Member since {memberSince}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
      <CardFooter>
        <Button
          color="secondary"
          variant="contained"
          type="submit"
          onClick={e => {
            e.preventDefault();
            toggleDeleteAccountConfirmModal(true);
          }}
        >
          Delete Account
        </Button>
      </CardFooter>
      {deleteAccountConfirmModal && (
        <ConfirmModal
          typeConfirmationText="Permanently delete account"
          onCancel={() => {
            toggleDeleteAccountConfirmModal(false);
          }}
          onConfirm={({ setLoading, setError }) => {
            setLoading(true);

            deleteUser()
              .then(() => {
                if (logout) logout();
              })
              .catch(() => {
                setLoading(false);
                setError(
                  "Something went wrong while deleting your account please contact us via email or discord."
                );
              });
          }}
        >
          This will completely remove the account. All associated files and
          endpoints will be gone. Remember there is no going back from here.
        </ConfirmModal>
      )}
    </Card>
  );
}
