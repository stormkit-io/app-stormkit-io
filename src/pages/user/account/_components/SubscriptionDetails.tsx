import React, { FC, ReactElement, useEffect, useState } from "react";
import { History, Location } from "history";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import Link from "~/components/Link";
import Form from "~/components/Form";
import { TConfirmModal } from "~/components/ConfirmModal";
import Api from "~/utils/api/Api";
import { useFetchSubscription, handleUpdateSubscriptionPlan } from "../actions";
import { SubscriptionName, ActivePlan } from "../actions/fetch_subscriptions";
import { packages, features } from "./constants";

type Props = {
  api: Api;
  location: Location;
  history: History;
  confirmModal: TConfirmModal;
};

type SubscriptionDowngradePros = {
  activePlan: ActivePlan;
};

const SubscriptionDowngrade: FC<SubscriptionDowngradePros> = ({
  activePlan,
}) => {
  return (
    <InfoBox type="default" className="mb-4">
      Your current subscription will end on{" "}
      {new Date(activePlan.trial_end * 1000).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      })}
      . After that you'll be downgraded to <b>{activePlan.plan.nickname}</b>{" "}
      package.
    </InfoBox>
  );
};

const SubscriptionDetails: FC<Props> = ({
  api,
  confirmModal,
  history,
  location,
}: Props): ReactElement => {
  const { loading, error, subscription } = useFetchSubscription({
    api,
    location,
  });

  const [selected, setSelected] = useState<SubscriptionName | undefined>(
    subscription?.name
  );

  useEffect(() => {
    setSelected(subscription?.name);
  }, [subscription?.name, loading]);

  const pckg = packages.find((i) => i.name === subscription?.name);
  const activePlan = subscription?.activePlans?.[0];

  return (
    <div>
      <h1 className="mb-4 text-2xl text-white">Subscription details</h1>
      <div className="rounded bg-white p-8 mb-8">
        {loading && <Spinner width={6} height={6} primary />}
        {!loading && error && <InfoBox type="error">{error}</InfoBox>}
        {!loading && !error && (
          <div className="flex flex-col">
            {activePlan?.status === "trialing" && (
              <SubscriptionDowngrade activePlan={activePlan} />
            )}
            <Form
              className="w-full"
              handleSubmit={() =>
                confirmModal(
                  "You're about to change your subscription plan. This may incur in additional costs.",
                  {
                    onConfirm: (props) => {
                      if (!selected) {
                        return props.setError(
                          "Subscription name is not valid."
                        );
                      }

                      handleUpdateSubscriptionPlan({
                        api,
                        history,
                        name: selected,
                        ...props,
                      });
                    },
                  }
                )
              }
            >
              <div className="flex flex-wrap">
                {packages.map((p, i) => (
                  <Button
                    as="div"
                    key={p.name}
                    styled={false}
                    style={{
                      maxWidth: "49%",
                      minWidth: "49%",
                      marginRight: i % 2 === 0 ? "2%" : 0,
                    }}
                    className="price flex flex-col flex-auto shadow-lg border border-gray-80 p-6 bg-white mb-4"
                    onClick={() => {
                      setSelected(p.name);
                    }}
                  >
                    <div className="flex justify-between mb-4">
                      <span
                        className="inline-block py-1 px-4 rounded-lg text-xs text-white"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.name}
                      </span>
                      <Form.Radio
                        checked={selected === p.name}
                        value={p.name}
                        name="subscription"
                        style={{ marginRight: 0 }}
                      />
                    </div>
                    <div className="mb-4">
                      <b>{p.price}$</b>
                      <span className="text-xs">/ month</span>
                    </div>
                    <ul className="flex-auto">
                      {features[p.name].map((f) => (
                        <li key={f} className="text-sm mb-2">
                          <span
                            className="fas fa-check-circle mr-2"
                            style={{ color: p.color }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </Button>
                ))}
              </div>
              <p>
                You are currently using <b>{pckg?.title}</b> tier. Learn more
                about{" "}
                <Link
                  to="https://www.stormkit.io/pricing"
                  className="inline-block mt-4"
                  secondary
                >
                  <>
                    pricing <i className="fas fa-external-link-square-alt" />
                  </>
                </Link>
              </p>
              <div className="mt-4 text-right">
                <Button type="submit" primary>
                  Change subscription
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetails;
