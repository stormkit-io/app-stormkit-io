import { History } from "history";
import {
  Stripe,
  StripeElement,
  StripeElements,
  StripeError,
} from "@stripe/stripe-js";
import { CardNumberElement } from "@stripe/react-stripe-js";
import Api from "~/utils/api/Api";

type UpdatePaymentMethodProps = {
  stripe: Stripe | null;
  elements: StripeElements | null;
  api: Api;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  history: History;
};

type UpdatePaymentMethodFormValues = {
  name: string;
};

type HandleStripeErrorProps = {
  error: StripeError | undefined;
  setError: (value: string | null) => void;
};

const handleStripeError = ({ error, setError }: HandleStripeErrorProps) => {
  if (!error) {
    return setError("We could not create a payment source on Stripe.");
  }

  if (error.type === "invalid_request_error") {
    return setError(
      "Please make sure that provided information is complete and correct."
    );
  }

  return setError(
    error.message ||
      "An unexpected error occurred while processing card information."
  );
};

export const handleUpdatePaymentMethod = (
  props: UpdatePaymentMethodProps
) => async (formValues: UpdatePaymentMethodFormValues): Promise<void> => {
  const { api, stripe, elements, setLoading, setError, history } = props;
  const name = formValues.name?.trim();

  if (!stripe || !elements) {
    return setError("Stripe is not loaded yet.");
  }

  if (!name) {
    return setError("Please provide a cardholder's name.");
  }

  try {
    setError(null);
    setLoading(true);

    const element = elements.getElement(CardNumberElement);

    const { source, error } = await stripe.createSource(
      element as StripeElement,
      {
        type: "card",
        currency: "usd",
        owner: { name },
      }
    );

    setLoading(false);

    if (!source?.id) {
      return handleStripeError({ error, setError });
    }

    if (source?.status === "chargeable") {
      const { customerId } = await api.post("/user/subscription/card", {
        sourceId: source.id,
      });

      if (customerId) {
        return history.push({ state: { cards: Date.now() } });
      }
    }

    return setError(
      "Your card seems not to be chargeable. Please try using a different card."
    );
  } catch (e) {
    console.error(e.message);
    setLoading(false);
    setError(
      "We were not able to create a payment source on Stripe. Please contact us on Discord or through email."
    );
  }
};
