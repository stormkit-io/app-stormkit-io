import React, { FC, ReactElement } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Api from "~/utils/api/Api";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Link from "~/components/Link";
import Form from "~/components/Form";
import { useFetchCards } from "../actions";
import stripeLogoSvg from "~/assets/images/stripe-logo-white.svg";

type Props = {
  api: Api;
};

const stripePromise = loadStripe(process.env.STRIPE_API_KEY || "");
const stripeStyles = {
  base: {
    fontSize: "16px",
    color: "#32325d",
    "::placeholder": {
      color: "#b2b2b2",
    },
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a",
  },
};

const PaymentDetails: FC<Props> = ({ api }: Props): ReactElement => {
  const { cards, loading, error } = useFetchCards({ api });

  console.log(cards);

  return (
    <div>
      <h1 className="mb-4 text-2xl text-white">Payment details</h1>
      <div className="rounded bg-white p-8 mb-8">
        {loading && <Spinner width={6} height={6} primary />}
        {!loading && error && <InfoBox type="error">{error}</InfoBox>}
        {!loading && !error && (
          <Elements stripe={stripePromise}>
            <Form>
              <Form.Section label="Card number">
                <div className="border border-solid border-gray-83 rounded p-4 bg-gray-90">
                  <CardNumberElement options={{ style: stripeStyles }} />
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
                  placeholder="John Doe"
                  fullWidth
                  className="bg-gray-90"
                />
              </Form.Section>
              <div>
                <Link
                  to="https://www.stripe.com"
                  rel="nofollow"
                  className="inline-flex items-center rounded bg-stripe text-white py-1 px-4 text-sm"
                >
                  Powered by{" "}
                  <img src={stripeLogoSvg} alt="Stripe Logo" className="w-12" />
                </Link>
              </div>
            </Form>
          </Elements>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
