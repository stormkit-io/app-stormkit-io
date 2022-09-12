import React, { useContext, useState } from "react";
import cn from "classnames";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { AuthContext } from "~/pages/auth/Auth.context";
import DotDotDot from "~/components/DotDotDot";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import ConfirmModal from "~/components/ConfirmModal";
import { PlusButton } from "~/components/Buttons";
import { useFetchMembers, handleDelete } from "./actions";
import NewMemberModal from "./_components/NewMemberModal";

const Team: React.FC = (): React.ReactElement => {
  const [deleteMember, setDeleteMember] = useState<User>();
  const { app } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const { members, loading, error } = useFetchMembers({ app });
  const isCurrentUserTheOwner = app.userId === user!.id;

  return (
    <div className="w-full">
      <h1 className="mb-4 flex items-center justify-between">
        <span className="text-2xl text-white">Members</span>
        <div className="flex-shrink-0">
          {isNewModalOpen && (
            <NewMemberModal
              app={app}
              onClose={() => setIsNewModalOpen(false)}
            />
          )}
          <PlusButton
            onClick={() => setIsNewModalOpen(true)}
            className="text-white rounded"
            text="Invite new member"
            size="small"
            aria-label="Invite new member"
          />
        </div>
      </h1>
      {!isCurrentUserTheOwner && !loading && (
        <InfoBox type={InfoBox.WARNING} className="mb-4">
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
        <div className="flex justify-center bg-white rounded p-4">
          <Spinner primary />
        </div>
      ) : (
        members.map(({ user: member, isOwner }, i) => (
          <TableContainer
            key={member.id}
            className={cn(
              "flex flex-col justify-center bg-white border-b border-solid border-gray-83",
              {
                "rounded-tr rounded-tl": i === 0,
                "rounded-br rounded-bl mb-4": i === members.length - 1,
              }
            )}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-12">
                    <img
                      src={member.avatar}
                      alt={`${member.fullName || member.displayName} profile`}
                      className="rounded-full w-12 h-12 inline-block max-w-none"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">
                      {member.fullName || member.displayName}
                    </div>
                    {isOwner ? (
                      <span className="text-green-50">Owner</span>
                    ) : (
                      <span className="opacity-50">Developer</span>
                    )}
                  </TableCell>
                  {isCurrentUserTheOwner && !isOwner && (
                    <TableCell className="text-right">
                      <DotDotDot aria-label="More settings">
                        <DotDotDot.Item
                          icon="fas fa-times text-red-50 mr-2"
                          aria-label={`Delete ${
                            member.fullName || member.displayName
                          }`}
                          onClick={() => {
                            setDeleteMember(member);
                          }}
                        >
                          Delete
                        </DotDotDot.Item>
                      </DotDotDot>
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ))
      )}
      {deleteMember && (
        <ConfirmModal
          onCancel={() => {
            setDeleteMember(undefined);
          }}
          onConfirm={({ setError, setLoading }) => {
            handleDelete({
              setError,
              setLoading,
              userId: deleteMember.id,
              app,
            }).then(() => {
              setDeleteMember(undefined);
            });
          }}
        >
          Your are about to remove a member from this app. You will need to
          re-invite if the user needs access again.
        </ConfirmModal>
      )}
    </div>
  );
};

export default Team;
