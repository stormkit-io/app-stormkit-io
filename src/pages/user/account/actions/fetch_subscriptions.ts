import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

export type StatusName = "trialing" | "active";
export type SubscriptionName = "enterprise" | "medium" | "starter" | "free";

export type Subscription = {
  concurrentBuilds: boolean; // Number of concurrent builds allowed
  remainingApps: boolean; // -1 for unlimited
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

interface FetchSubscriptionReturnValue {
  loading: boolean;
  error: string | null;
  subscription: Subscription | undefined;
}

interface FetchSubscriptionAPIResponse {
  subscription: Subscription;
}

export const fetchCheckoutEndpoint = (deployments: string): Promise<string> => {
  return api
    .fetch<{ url: string }>(
      `/user/subscription/session?deployments=${deployments}`
    )
    .then(res => {
      return res.url;
    });
};

export const useFetchSubscription = (): FetchSubscriptionReturnValue => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription>();

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch<FetchSubscriptionAPIResponse>("/user/subscription")
      .then(res => {
        if (!unmounted) {
          setSubscription(res.subscription || {});
        }
      })
      .catch(() => {
        if (!unmounted) {
          setError(
            "Something went wrong file fetching subscriptions. Please try again. If the problem persists reach us out through Discord or email."
          );
        }
      })
      .finally(() => {
        if (!unmounted) {
          setLoading(false);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api]);

  return { loading, error, subscription };
};
