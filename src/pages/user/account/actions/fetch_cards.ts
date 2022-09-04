import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

type CardTypeData = {
  last4: string;
  exp_month: number;
  exp_year: number;
  cvc_check: "pass";
};

export type Card = {
  TypeData: CardTypeData;
  amount: number;
  id: string;
  status: "pending" | "chargeable";
  currency: "usd";
  created: number;
  owner: {
    name: string;
  };
};

export type Cards = Array<Card>;

type FetchCardsReturnValue = {
  cards: Cards;
  error: string | null;
  loading: boolean;
};

interface FetchCardsAPIResponse {
  cards: Cards;
}

export const useFetchCards = (): FetchCardsReturnValue => {
  const [cards, setCards] = useState<Cards>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unmounted = false;

    setLoading(true);
    setError(null);

    api
      .fetch<FetchCardsAPIResponse>("/user/subscription/cards")
      .then(res => {
        if (unmounted !== true) {
          setLoading(false);
          setCards(res.cards.filter(c => c.TypeData.last4));
        }
      })
      .catch(res => {
        if (unmounted !== true) {
          setLoading(false);

          if (res.status !== 404) {
            setError(
              "Something went wrong while fetching the cards. Please try again, if the problem persists contact us from Discord or email."
            );
          } else {
            setCards([]);
          }
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api]);

  return { cards, loading, error };
};
