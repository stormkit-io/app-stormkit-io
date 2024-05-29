import api from "~/utils/api/Api";

export type StatusName = "trialing" | "active";
export type SubscriptionName = "enterprise" | "medium" | "starter" | "free";

export const fetchCheckoutEndpoint = (deployments: string): Promise<string> => {
  return api
    .fetch<{ url: string }>(
      `/user/subscription/session?deployments=${deployments}`
    )
    .then(res => {
      return res.url;
    });
};
