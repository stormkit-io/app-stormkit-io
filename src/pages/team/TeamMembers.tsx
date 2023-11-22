import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/lab/LoadingButton";
import { grey } from "@mui/material/colors";
import DotDotDot from "~/components/DotDotDotV2";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import ConfirmModal from "~/components/ConfirmModal";
import InviteMemberModal from "./InviteMemberModal";
import { useFetchTeamMembers, removeMember } from "./actions";

interface Props {
  user: User;
  team: Team;
  reloadTeams?: () => void;
}

export default function TeamMembers({ user, team, reloadTeams }: Props) {
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const tmFetchResult = useFetchTeamMembers({ team });
  const [memberToBeRemoved, setMemberToBeRemoved] = useState<TeamMember>();

  const { teamMembers, error: tmError } = tmFetchResult;

  return (
    <>
      <Card error={tmError} sx={{ mb: 4 }}>
        <CardHeader
          title="Team members"
          subtitle="Invite team members to collaborate on your projects."
        />
        {teamMembers?.map(member => (
          <Box
            key={member.userId}
            sx={{
              borderBottom: `1px solid ${grey[900]}`,
              display: "flex",
              alignItems: "center",
              mb: 2,
              pb: 2,
              ":last-child": {
                borderBottom: "none",
              },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography>
                {member.fullName?.trim() || member.displayName}
              </Typography>
              <Typography sx={{ opacity: 0.5 }}>{member.email}</Typography>
            </Box>
            <Chip label={member.role} size="small" sx={{ mr: 2 }} />
            <DotDotDot
              label={`Member ${member.id} menu`}
              items={[
                {
                  text: member.userId === user?.id ? "Leave" : "Remove",
                  onClick: () => {
                    setMemberToBeRemoved(member);
                  },
                },
              ]}
            />
          </Box>
        ))}
        <CardFooter>
          <Button
            variant="contained"
            color="secondary"
            onClick={e => {
              e.preventDefault();
              setIsNewMemberModalOpen(true);
            }}
          >
            Invite member
          </Button>
        </CardFooter>
      </Card>
      {isNewMemberModalOpen && (
        <InviteMemberModal
          teamId={team.id}
          onClose={() => {
            setIsNewMemberModalOpen(false);
          }}
        />
      )}
      {memberToBeRemoved && (
        <ConfirmModal
          onCancel={() => {
            setMemberToBeRemoved(undefined);
          }}
          onConfirm={({ setLoading, setError }) => {
            setLoading(true);
            setError(null);

            removeMember({
              memberId: memberToBeRemoved.id,
              teamId: team.id,
            })
              .then(() => {
                reloadTeams?.();
              })
              .catch(async res => {
                const data = await res.json();

                setError(
                  data.error || "Something went wrong while removing member."
                );
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <Typography sx={{ mb: 4 }}>
            {memberToBeRemoved.userId === user.id ? (
              <Box component="span">
                You are about to leave the team. You will need another
                invitation to re-join.
              </Box>
            ) : (
              <Box component="span">
                You are about to remove{" "}
                <Box component="span" sx={{ fontWeight: "bold", opacity: 0.5 }}>
                  {memberToBeRemoved.email}
                </Box>{" "}
                from the team.
                <br /> They will lose access to all apps under this team.
              </Box>
            )}
          </Typography>
        </ConfirmModal>
      )}
    </>
  );
}
