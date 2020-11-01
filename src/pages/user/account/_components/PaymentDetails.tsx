import React, { FC, ReactElement, useState } from "react";
import { History, Location } from "history";
import * as stripejs from "@stripe/react-stripe-js";
import Api from "~/utils/api/Api";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Link from "~/components/Link";
import Form from "~/components/Form";
import Button from "~/components/Button";
import { useFetchCards, handleUpdatePaymentMethod } from "../actions";
import { stripePromise, stripeStyles } from "./constants";
import stripeLogoSvg from "~/assets/images/stripe-logo-white.svg";

type Props = {
  api: Api;
  history: History;
  location: Location;
};

const {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} = stripejs;

const PaymentDetails: FC<Props> = ({
  api,
  history,
  location,
}: Props): ReactElement => {
  const [showForm, setShowForm] = useState(false);
  const [formError, setError] = useState<string | null>(null);
  const [formLoading, setLoading] = useState(false);
  const { cards, loading, error } = useFetchCards({ api, location });
  const stripe = useStripe();
  const elements = useElements();
  const errorMsg = error || formError;
  const isLoading = loading || !stripe || !elements;

  console.log(cards, formError, formLoading);

  return (
    <div>
      <h1 className="mb-4 text-2xl text-white">Payment details</h1>
      <div className="rounded bg-white p-8 mb-8">
        {isLoading && <Spinner width={6} height={6} primary />}
        {!isLoading && (
          <>
            {cards.length && (
              <div className="mb-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex justify-between bg-gray-90 border border-solid border-gray-83 p-4"
                  >
                    <div>
                      <div className="mb-4 font-bold">Active Card</div>
                      <span className="fas fa-credit-card mr-2" />
                      <span className="inline-block mr-4">
                        xxxx xxxx xxxx {card.TypeData.last4}
                      </span>
                      <span className="opacity-50">
                        {card.TypeData.exp_month} / {card.TypeData.exp_year}
                      </span>
                    </div>
                    <div>
                      <Button
                        styled={false}
                        className="hover:text-pink-50 px-2"
                        onClick={() => setShowForm(!showForm)}
                      >
                        Edit
                      </Button>{" "}
                      |{" "}
                      <Button
                        styled={false}
                        className="hover:text-pink-50 px-2"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(showForm || cards.length === 0) && (
              <Form
                handleSubmit={handleUpdatePaymentMethod({
                  stripe,
                  elements,
                  api,
                  history,
                  setError,
                  setLoading,
                })}
              >
                {errorMsg && (
                  <InfoBox type="error" className="mb-4">
                    {errorMsg}
                  </InfoBox>
                )}
                <Form.Section label="Card number">
                  <div className="border border-solid border-gray-83 rounded p-4 bg-gray-90">
                    <CardNumberElement
                      options={{ style: stripeStyles, showIcon: true }}
                    />
                  </div>
                </Form.Section>
                <Form.Section label="Expiry">
                  <div className="border border-solid border-gray-83 rounded p-4 w-32 bg-gray-90">
                    <CardExpiryElement options={{ style: stripeStyles }} />
                  </div>
                </Form.Section>
                <Form.Section label="CVC">
                  <div className="border border-solid border-gray-83 rounded p-4 w-32 bg-gray-90">
                    <CardCvcElement options={{ style: stripeStyles }} />
                  </div>
                </Form.Section>
                <Form.Section label="Cardholder's Name">
                  <Form.Input
                    name="name"
                    defaultValue={cards[0]?.owner?.name}
                    placeholder="John Doe"
                    fullWidth
                    className="bg-gray-90"
                  />
                </Form.Section>
                <div className="flex justify-center mb-4">
                  <Button primary loading={formLoading}>
                    Update payment method
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Link
                    to="https://www.stripe.com"
                    rel="nofollow"
                    className="inline-flex items-center rounded bg-stripe text-white py-1 px-4 text-xs"
                  >
                    Powered by{" "}
                    <img
                      src={stripeLogoSvg}
                      alt="Stripe Logo"
                      className="w-8"
                    />
                  </Link>
                </div>
              </Form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default (props: Props): ReactElement => (
  <Elements stripe={stripePromise}>
    <PaymentDetails {...props} />
  </Elements>
);
