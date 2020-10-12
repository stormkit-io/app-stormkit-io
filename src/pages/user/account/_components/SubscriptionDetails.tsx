import React, { FC, ReactElement, useEffect, useState } from "react";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import Link from "~/components/Link";
import Api from "~/utils/api/Api";
import Form from "~/components/Form";
import { User } from "~/types/user";
import { useFetchSubscription } from "../actions";
import { packages, features } from "./constants";

type Props = {
  api: Api;
  user: User;
};

const SubscriptionDetails: FC<Props> = ({ api, user }: Props): ReactElement => {
  const { loading, error, subscription } = useFetchSubscription({ api });
  const [selected, setSelected] = useState(subscription?.name);

  useEffect(() => {
    setSelected(subscription?.name);
  }, [subscription?.name]);

  const pckg = packages.find((i) => i.name === subscription?.name);

  return (
    <div>
      <h1 className="mb-4 text-2xl text-white">Subscription details</h1>
      <div className="rounded bg-white p-8 mb-8">
        {loading && <Spinner width={6} height={6} primary />}
        {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
        {!loading && !error && (
          <div className="flex">
            <Form className="w-full">
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
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetails;
