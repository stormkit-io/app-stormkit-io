import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/apps/App.context";
import AuthContext from "~/pages/auth/Auth.context";
import DotDotDot from "~/components/DotDotDot";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import ConfirmModal from "~/components/ConfirmModal";
import { PlusButton } from "~/components/Buttons";
import { connect } from "~/utils/context";
import { useFetchMembers, handleDelete } from "./actions";
import NewMemberModal from "./_components/NewMemberModal";

const Team = ({
  api,
  app,
  user,
  confirmModal,
  toggleModal,
  history,
  location,
}) => {
  const { members, loading, error } = useFetchMembers({ api, app, location });
  const isCurrentUserTheOwner = app.userId === user.id;

  return (
    <div>
      <h1 className="mb-4 flex items-center justify-between">
        <span className="text-2xl text-white">Members</span>
        <div className="flex-shrink-0">
          <NewMemberModal api={api} app={app} />
          <PlusButton
            onClick={() => toggleModal(true)}
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
                          aria-label={`Delete ${member.fullName ||
                            member.displayName}`}
                          onClick={handleDelete({
                            userId: member.id,
                            app,
                            api,
                            history,
                            confirmModal,
                          })}
                        >
                          <span className="fas fa-times text-red-50 mr-2" />
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
    </div>
  );
};

Team.propTypes = {
  api: PropTypes.object,
  app: PropTypes.object,
  user: PropTypes.object,
  toggleModal: PropTypes.func,
  confirmModal: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default connect(Team, [
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app"] },
  { Context: AuthContext, props: ["user"] },
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
  { Context: NewMemberModal, props: ["toggleModal"], wrap: true },
]);
