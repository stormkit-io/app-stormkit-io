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

// /**
//  * Updates the given plan.
//  */
// export const useUpdatePlan = ({
//   api,
//   fetchSubscription,
//   setPckErr,
//   setPckSuc,
//   setLoading,
//   toggleModal,
//   toggleSuccessModal,
// }) => (name) => {
//   setLoading(name);

//   api
//     .put("user/subscription", { name })
//     .then(() => {
//       fetchSubscription();
//       setPckErr(null);
//       setPckSuc(
//         "Your subscription plan has been updated successfully. We appreciate your trust in Stormkit."
//       );
//       toggleSuccessModal(true);
//     })
//     .catch((res) => {
//       if (res.status === 401) {
//         return setPckErr(
//           "Selected package is too small for current usage. " +
//             "Please first remove some of your apps from your account to " +
//             "continue with the package selection."
//         );
//       }

//       if (res.status === 402) {
//         return toggleModal(true);
//       }
//     })
//     .then(() => {
//       setLoading(null);
//     });
// };

// /**
//  * This method loads stripe on demand. It will call the callback
//  * provided when the loading is completed.
//  */
// export const useLoadStripe = ({ setStripeLoaded }) => () => {
//   const id = "stripe-js";

//   // Ignore if stripe is already loaded.
//   if (document.querySelector(`#${id}`)) {
//     return setStripeLoaded(true);
//   }

//   const script = document.createElement("script");
//   script.id = id;
//   script.src = "https://js.stripe.com/v3/";
//   script.onload = () => setStripeLoaded(true);

//   document.body.appendChild(script);
// };

// /**
//  * Adds a new payment method, and makes an API call with to obtained token
//  * to attach the payment method to the customer.
//  */
// export const useAddPaymentMethod = ({
//   api,
//   stripe,
//   subscription,
//   setSubscription,
//   setState,
//   setCards,
//   cards,
//   toggleModal,
//   setPlanToBeUpdated,
//   planToBeUpdated,
//   updateSubs,
//   onCreditCardAdd,
// }) => ({ name = "" }) => {
//   name = name.trim();

//   if (!name) {
//     return setState({
//       errors: { name: "Please provide a cardholder name." },
//       loading: false,
//     });
//   } else {
//     setState({ errors: {}, loading: true });
//   }

//   stripe
//     .createSource({ type: "card", owner: { name } })
//     .then(({ source, error }) => {
//       if (source && source.id) {
//         if (source.status === "chargeable") {
//           api
//             .post("/user/subscription/card", { sourceId: source.id })
//             .then(({ customerId }) => {
//               if (planToBeUpdated) {
//                 updateSubs(planToBeUpdated);
//               }

//               setState({ errors: {}, loading: false });
//               setSubscription({ ...subscription, customerId, cardAdded: true });
//               setPlanToBeUpdated();
//               setCards({ ...cards, refresh: Date.now() });
//               toggleModal(false);

//               if (typeof onCreditCardAdd === "function") {
//                 onCreditCardAdd();
//               }
//             })
//             .catch(() => {
//               setState({
//                 loading: false,
//                 errors: {
//                   card:
//                     "An unexpected error occurred while updated payment information. Please contact us at hello@stormkit.io.",
//                 },
//               });
//             });
//         } else {
//           setState({
//             loading: false,
//             errors: {
//               card:
//                 "Your card seems not to be chargeable. Please try with a different card.",
//             },
//           });
//         }
//       } else if (error) {
//         if (error.code === "incomplete_number") {
//           setState({
//             errors: { card: "Please provide a valid card number." },
//             loading: false,
//           });
//         } else if (
//           error.code === "invalid_expiry_year_past" ||
//           error.code === "invalid_expiry_month_past"
//         ) {
//           setState({
//             errors: {
//               card: "Please provide an expiration date that is in the future.",
//             },
//             loading: false,
//           });
//         } else if (error.code === "incomplete_cvc") {
//           setState({
//             errors: {
//               card: "Please provide your CVC code.",
//             },
//             loading: false,
//           });
//         } else {
//           setState({
//             loading: false,
//             errors: {
//               card: "Stripe failed with following code: " + error.code,
//             },
//           });
//         }
//       } else {
//         setState({
//           errors: { card: "We could not create a payment source on Stripe." },
//           loading: false,
//         });
//       }
//     })
//     .catch((e) => {
//       console.error(e.message);
//       setState({
//         errors: { card: "We could not create a payment source on Stripe." },
//         loading: false,
//       });
//     });
// };

// /**
//  * Fetches list of cards.
//  */
// export const useFetchCards = ({ api, cards, setCards }) => () => {
//   setCards({ ...cards, loading: true });

//   api
//     .fetch("/user/subscription/cards")
//     .then((res) => {
//       setCards({ ...cards, list: res.cards, loading: false });
//     })
//     .catch((res) => {
//       setCards({ ...cards, loading: false });
//     });
// };

// /**
//  * Helper function to remove a card.
//  */
// export const removeCard = ({ api, cards, setCards, cardId, setError }) => (
//   e
// ) => {
//   e.preventDefault();
//   e.stopPropagation();

//   setCards({ ...cards, loading: true });

//   api
//     .delete("/user/subscription/card", { cardId })
//     .then(() => {
//       setCards({ list: cards, loading: false, refresh: Date.now() });
//     })
//     .catch((e) => {
//       setCards({ ...cards, loading: false });

//       if (e.status === 401) {
//         setError(
//           "Please downgrade your subscription to free plan in order to remove a card."
//         );
//       } else {
//         console.log(e.message);
//       }
//     });
// };
