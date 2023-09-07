import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { AuthContext } from "~/pages/auth/Auth.context";
import DotDotDot from "~/components/DotDotDotV2";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import ConfirmModal from "~/components/ConfirmModal";
import { useFetchMembers, deleteTeamMember } from "./actions";
import NewMemberModal from "./_components/NewMemberModal";

const Team: React.FC = (): React.ReactElement => {
  const [deleteMember, setDeleteMember] = useState<User>();
  const { app } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const { members, loading, error } = useFetchMembers({ app });
  const isCurrentUserTheOwner = app.userId === user!.id;

  return (
    <Box>
      {!isCurrentUserTheOwner && !loading && (
        <InfoBox type={InfoBox.WARNING} className="mb-4 mx-4">
          <div>
            In order to remove members from the team you'll need to have{" "}
            <span className="font-bold">owner</span> access.
          </div>
        </InfoBox>
      )}
      {error && (
        <InfoBox type={InfoBox.ERROR} className="mb-4">
          {error}
        </InfoBox>
      )}
      {loading ? (
        <div className="flex justify-center p-4">
          <Spinner primary />
        </div>
      ) : (
        <Box>
          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setIsNewModalOpen(true);
              }}
              sx={{ textTransform: "capitalize" }}
            >
              Invite new member
            </Button>
          </Box>
          {members.map(({ user: member, isOwner }) => (
            <Box
              key={member.id}
              bgcolor="container.paper"
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                mt: 2,
                "&:first-child": {
                  mt: 0,
                },
              }}
            >
              <Box sx={{ mr: 2 }}>
                <img
                  src={member.avatar}
                  alt={`${member.fullName || member.displayName} profile`}
                  className="rounded-full w-8 h-8 inline-block max-w-none"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: "normal", color: "white" }}>
                  {member.fullName || member.displayName}
                </Typography>
                <Typography
                  sx={{
                    color: isOwner ? "green" : "white",
                    opacity: isOwner ? 1 : 0.5,
                  }}
                >
                  {isOwner ? "Owner" : "Developer"}
                </Typography>
              </Box>
              {isCurrentUserTheOwner && !isOwner && (
                <div className="self-baseline">
                  <DotDotDot
                    aria-label="More settings"
                    items={[
                      {
                        icon: "fas fa-times text-red-50",
                        text: "Remove member",
                        onClick: () => {
                          setDeleteMember(member);
                        },
                      },
                    ]}
                  />
                </div>
              )}
              {!isCurrentUserTheOwner && user?.id === member.id && (
                <div className="self-baseline">
                  <DotDotDot
                    aria-label="More settings"
                    items={[
                      {
                        icon: "fa-solid fa-right-from-bracket",
                        text: "Leave team",
                        onClick: () => {
                          setDeleteMember(member);
                        },
                      },
                    ]}
                  />
                </div>
              )}
            </Box>
          ))}
        </Box>
      )}
      {deleteMember && (
        <ConfirmModal
          onCancel={() => {
            setDeleteMember(undefined);
          }}
          onConfirm={({ setError, setLoading }) => {
            setLoading(true);
            setError(null);

            deleteTeamMember({
              userId: deleteMember.id,
              app,
            })
              .then(() => {
                if (deleteMember.id === user?.id) {
                  window.location.assign("/");
                } else {
                  window.location.reload();
                }

                setDeleteMember(undefined);
              })
              .catch(e => {
                console.log(e);
                setError(
                  "Something went wrong while removing member from the team."
                );
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          {deleteMember.id === user?.id ? (
            <p>You won't be able to access this app anymore.</p>
          ) : (
            <p>User will no longer have access to this app anymore.</p>
          )}
        </ConfirmModal>
      )}
      {isNewModalOpen && (
        <NewMemberModal app={app} onClose={() => setIsNewModalOpen(false)} />
      )}
    </Box>
  );
};

export default Team;
