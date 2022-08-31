import api from "~/utils/api/Api";
import { History } from "history";

type RemoveCardProps = {
  history: History;
  cardId: string;
  setError: (value: string | null) => void;
  setLoading: (value: boolean) => void;
  closeModal: () => void;
};

export const handleRemovePaymentMethod = async ({
  history,
  cardId,
  setError,
  setLoading,
  closeModal,
}: RemoveCardProps): Promise<void> => {
  setLoading(true);

  try {
    await api.delete("/user/subscription/card", { cardId });
    setLoading(false);
    closeModal();
    history.push({ state: { cards: Date.now() } });
  } catch (e) {
    setLoading(false);

    if (e instanceof Response && e.status === 401) {
      return setError(
        "Please downgrade your subscription to free plan in order to remove a card."
      );
    } else {
      console.log(e instanceof Error ? e.message : e);

      return setError(
        "Something went wrong while removing card. Please try again later."
      );
    }
  }
};
