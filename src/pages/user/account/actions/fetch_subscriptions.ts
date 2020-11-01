import { useEffect, useState } from "react";
import Api from "~/utils/api/Api";

export type Subscription = {
  hasDeployHooks: boolean;
  concurrentBuilds: boolean; // Number of concurrent builds allowed
  maxTeamMembersPerApp: boolean; // -1 for unlimited
  remainingApps: boolean; // -1 for unlimited
  activePlans: Array<unknown>;
  currentPlan: unknown;
  name: "enterprise" | "medium" | "starter" | "free";
  stripeClientId: string;
  totalApps: number;
};

type FetchSubscriptionProps = {
  api: Api;
};

type FetchSubscriptionReturnValue = {
  loading: boolean;
  error: string | null;
  subscription: Subscription | undefined;
};

export const useFetchSubscription = ({
  api,
}: FetchSubscriptionProps): FetchSubscriptionReturnValue => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription>();

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch("/user/subscription")
      .then((res) => {
        if (unmounted !== true) {
          setLoading(false);
          setSubscription(res.subscription || {});
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
  }, [api]);

  return { loading, error, subscription };
};
