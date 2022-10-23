import React, { useContext, useState } from "react";
import cn from "classnames";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { AuthContext } from "~/pages/auth/Auth.context";
import Container from "~/components/Container";
import DotDotDot from "~/components/DotDotDotV2";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
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
    <Container
      maxWidth="max-w-none"
      title="Members"
      actions={
        <Button
          type="button"
          category="button"
          onClick={() => {
            setIsNewModalOpen(true);
          }}
        >
          Invite new member
        </Button>
      }
    >
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
        <div className="pb-4">
          {members.map(({ user: member, isOwner }, i) => (
            <div
              key={member.id}
              className={cn("bg-blue-10 mx-4 flex p-4 items-center", {
                "mt-4": i > 0,
              })}
            >
              <div className="mr-4">
                <img
                  src={member.avatar}
                  alt={`${member.fullName || member.displayName} profile`}
                  className="rounded-full w-8 h-8 inline-block max-w-none"
                />
              </div>
              <div className="flex-grow">
                <div className="font-bold">
                  {member.fullName || member.displayName}
                </div>
                {isOwner ? (
                  <span className="text-green-50">Owner</span>
                ) : (
                  <span className="opacity-50">Developer</span>
                )}
              </div>
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
            </div>
          ))}
        </div>
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
    </Container>
  );
};

export default Team;
