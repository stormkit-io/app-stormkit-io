import { Subscription as Stype } from "./fetch_subscriptions";

export { handleUpdatePaymentMethod } from "./handle_update_payments";
export { useFetchSubscription } from "./fetch_subscriptions";
export { useFetchCards } from "./fetch_cards";
export { removeCard } from "./handle_remove_payment_method";

export type Subscription = Stype;

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
