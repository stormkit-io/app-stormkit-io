import type { Member } from "~/pages/apps/[id]/team/actions";

interface Props {
  appId: string;
}

export default ({ appId }: Props): Member[] => [
  {
    appId,
    createdAt: 1551184200,
    isOwner: true,
    user: {
      displayName: "stormkit",
      avatar: "https://avatars2.githubusercontent.com/u/3321893?v=4",
      email: "foo@bar",
      memberSince: 1551184200,
      id: "1644802351",
      fullName: "Foo Bar",
      package: { id: "enterprise" },
    },
  },
  {
    appId,
    createdAt: 1551184200,
    isOwner: false,
    user: {
      displayName: "stormkit-account-2",
      avatar: "https://avatars2.githubusercontent.com/u/3321893?v=4",
      email: "voo@bar",
      memberSince: 1551184200,
      id: "16448021321",
      fullName: "Voo Bar",
      package: { id: "free" },
    },
  },
];
