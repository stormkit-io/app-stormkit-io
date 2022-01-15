import { useEffect, useState } from "react";
import { Location } from "history";
import Api from "~/utils/api/Api";

export type StatusName = "trialing" | "active";
export type SubscriptionName = "enterprise" | "medium" | "starter" | "free";

export type ActivePlan = {
  start_date?: number;
  trial_end: number;
  trial_start?: number;
  status: StatusName;
  plan: {
    nickname: SubscriptionName;
  };
};

export type Subscription = {
  concurrentBuilds: boolean; // Number of concurrent builds allowed
  maxTeamMembersPerApp: boolean; // -1 for unlimited
  remainingApps: boolean; // -1 for unlimited
  activePlans: Array<ActivePlan>;
  currentPlan: {
    current_period_end: number;
    current_period_start: number;
    cancel_at: number;
    cancel_at_period_end: boolean;
  };
  name: SubscriptionName;
  stripeClientId: string;
  totalApps: number;
};

type LocationState = {
  subscription: Location;
};

type FetchSubscriptionProps = {
  api: Api;
  location: Location;
};

interface FetchSubscriptionReturnValue {
  loading: boolean;
  error: string | null;
  subscription: Subscription | undefined;
}

interface FetchSubscriptionAPIResponse {
  subscription: Subscription;
}

export const useFetchSubscription = ({
  api,
  location,
}: FetchSubscriptionProps): FetchSubscriptionReturnValue => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription>();
  const state = location.state as LocationState;
  const refresh = state?.subscription;

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch<FetchSubscriptionAPIResponse>("/user/subscription")
      .then(res => {
        if (unmounted !== true) {
          const sub = res.subscription || {};

          // When the package is downgraded to free, Stripe returns the `activePlans` as
          // an empty array. This tiny hack makes sure that we have a consistent behaviour
          // and the activePlans is always populated when the subscription is downgraded.
          if (sub?.currentPlan?.cancel_at && sub?.activePlans?.length === 0) {
            sub.activePlans.push({
              trial_end: sub.currentPlan?.cancel_at || 0,
              status: "trialing",
              plan: {
                nickname: "free",
              },
            });
          }

          setLoading(false);
          setSubscription(sub);
        }
      })
      .catch(() => {
        if (unmounted !== true) {
          setLoading(false);
          setError(
            "Something went wrong file fetching subscriptions. Please try again. If the problem persists reach us out through Discord or email."
          );
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api, refresh]);

  return { loading, error, subscription };
};
