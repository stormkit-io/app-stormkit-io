import React, { useEffect, useContext, useState } from "react";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
import Link from "~/components/Link";
import Form from "~/components/Form";
import ConfirmModal from "~/components/ConfirmModal";
import Container from "~/components/Container";
import { useFetchSubscription, handleUpdateSubscriptionPlan } from "../actions";
import { SubscriptionName, ActivePlan } from "../actions/fetch_subscriptions";
import { packages, features } from "./constants";

type SubscriptionDowngradePros = {
  activePlan: ActivePlan;
};

const SubscriptionDowngrade: React.FC<SubscriptionDowngradePros> = ({
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

const SubscriptionDetails: React.FC = (): React.ReactElement => {
  const [isConfirmModalOpen, toggleConfirmModal] = useState(false);
  const { loading, error, subscription } = useFetchSubscription();

  const [selected, setSelected] = useState<SubscriptionName | undefined>(
    subscription?.name
  );

  useEffect(() => {
    setSelected(subscription?.name);
  }, [subscription?.name, loading]);

  const pckg = packages.find(i => i.name === subscription?.name);
  const activePlan = subscription?.activePlans?.[0];

  return (
    <Container title="Subscription details">
      <div className="p-4 mb-4">
        {loading && <Spinner width={6} height={6} primary />}
        {!loading && error && <InfoBox type="error">{error}</InfoBox>}
        {!loading && !error && (
          <div className="flex flex-col">
            {activePlan?.status === "trialing" && (
              <SubscriptionDowngrade activePlan={activePlan} />
            )}
            <Form
              className="w-full"
              handleSubmit={() => {
                toggleConfirmModal(true);
              }}
            >
              <div className="flex flex-wrap">
                {packages.map((p, i) => (
                  <div
                    key={p.name}
                    style={{
                      maxWidth: "49%",
                      minWidth: "49%",
                      marginRight: i % 2 === 0 ? "2%" : 0,
                    }}
                    className="price flex flex-col flex-auto shadow-lg border border-blue-20 p-6 mb-4 cursor-pointer"
                    tabIndex={0}
                    onKeyUp={e => {
                      if (e.key === "Enter") {
                        setSelected(p.name);
                      }
                    }}
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
                      {features[p.name].map(f => (
                        <li key={f} className="text-sm mb-2">
                          <span
                            className="fas fa-check-circle mr-2"
                            style={{ color: p.color }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
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
                <Button type="submit" category="action">
                  Change subscription
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
      {isConfirmModalOpen && (
        <ConfirmModal
          onCancel={() => {
            toggleConfirmModal(false);
          }}
          onConfirm={({ setError, setLoading }) => {
            if (!selected) {
              return setError("Subscription name is not valid.");
            }

            handleUpdateSubscriptionPlan({
              name: selected,
              setError,
              setLoading,
              closeModal: () => {
                toggleConfirmModal(false);
              },
            });
          }}
        >
          You're about to change your subscription plan. This may incur in
          additional costs.
        </ConfirmModal>
      )}
    </Container>
  );
};

export default SubscriptionDetails;
