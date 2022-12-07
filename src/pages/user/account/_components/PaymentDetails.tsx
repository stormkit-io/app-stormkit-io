import React, { useState, useEffect } from "react";
import * as stripejs from "@stripe/react-stripe-js";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import Link from "~/components/Link";
import Form from "~/components/FormV2";
import Button from "~/components/ButtonV2";
import Container from "~/components/Container";
import ConfirmModal from "~/components/ConfirmModal";
import * as actions from "../actions";
import { stripePromise, stripeStyles } from "./constants";
import stripeLogoSvg from "~/assets/images/stripe-logo-white.svg";

const { useFetchCards, handleUpdatePaymentMethod, handleRemovePaymentMethod } =
  actions;

const {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} = stripejs;

const PaymentDetails: React.FC = (): React.ReactElement => {
  const [cardIdToRemove, setCardIdToRemove] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [formError, setError] = useState<string | null>(null);
  const [formLoading, setLoading] = useState(false);
  const { cards, loading, error } = useFetchCards();
  const stripe = useStripe();
  const elements = useElements();
  const errorMsg = error || formError;
  const isLoading = loading || !stripe || !elements;

  useEffect(() => {
    setShowForm(cards?.length === 0);
  }, [cards]);

  return (
    <Container title="Payment details">
      <div className="pb-4 mb-4">
        {isLoading && (
          <div className="px-4">
            <Spinner width={6} height={6} primary />
          </div>
        )}
        {!isLoading && (
          <>
            {cards.length ? (
              <div className="px-4">
                {cards.map(card => (
                  <div
                    key={card.id}
                    className="flex justify-between border border-solid border-blue-20 p-4"
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
                        onClick={() => {
                          setCardIdToRemove(card.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
            {(showForm || cards.length === 0) && (
              <Form
                handleSubmit={handleUpdatePaymentMethod({
                  stripe,
                  elements,
                  setError,
                  setLoading,
                })}
              >
                {errorMsg && (
                  <InfoBox type="error" className="mx-4 mt-4">
                    {errorMsg}
                  </InfoBox>
                )}
                <Form.WithLabel label="Card number" className="p-0 pb-4">
                  <div className="w-full px-4">
                    <CardNumberElement
                      options={{ style: stripeStyles, showIcon: true }}
                    />
                  </div>
                </Form.WithLabel>
                <Form.WithLabel label="Expiry">
                  <div className="w-full px-4">
                    <CardExpiryElement options={{ style: stripeStyles }} />
                  </div>
                </Form.WithLabel>
                <Form.WithLabel label="CVC">
                  <div className="w-full px-4">
                    <CardCvcElement options={{ style: stripeStyles }} />
                  </div>
                </Form.WithLabel>
                <Form.WithLabel label="Cardholder's Name">
                  <Form.Input
                    name="name"
                    defaultValue={cards[0]?.owner?.name}
                    placeholder="John Doe"
                    fullWidth
                  />
                </Form.WithLabel>
                <div className="flex justify-between px-4">
                  <Link
                    to="https://www.stripe.com"
                    rel="nofollow"
                    className="inline-flex items-center rounded bg-stripe text-white py-1 px-4 text-xs self-center"
                  >
                    Powered by{" "}
                    <img
                      src={stripeLogoSvg}
                      alt="Stripe Logo"
                      className="w-8"
                    />
                  </Link>
                  <Button category="action" type="submit" loading={formLoading}>
                    Update payment method
                  </Button>
                </div>
              </Form>
            )}
          </>
        )}
      </div>
      {cardIdToRemove && (
        <ConfirmModal
          onCancel={() => {
            setCardIdToRemove(undefined);
          }}
          onConfirm={({ setLoading, setError }) => {
            handleRemovePaymentMethod({
              cardId: cardIdToRemove,
              setLoading,
              setError,
              closeModal: () => {
                setCardIdToRemove(undefined);
              },
            });
          }}
        >
          You are going to remove your credit card details forever. If you have
          a subscription, you'll have to downgrade in order to continue.
        </ConfirmModal>
      )}
    </Container>
  );
};

export default (): React.ReactElement => (
  // @ts-ignore
  <Elements stripe={stripePromise}>
    <PaymentDetails />
  </Elements>
);
