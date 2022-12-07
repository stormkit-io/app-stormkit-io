import { loadStripe } from "@stripe/stripe-js";
import { Subscription } from "../actions";

type Package = {
  name: Subscription["name"];
  title: string;
  price: number;
  color: string;
};

export const packages: Array<Package> = [
  {
    name: "free",
    title: "Free",
    price: 0,
    color: "#e4bb17",
  },
  {
    name: "starter",
    title: "Starter",
    price: 9.9,
    color: "#4388c7",
  },
  {
    name: "medium",
    title: "Medium",
    price: 49.9,
    color: "#50b950",
  },
  {
    name: "enterprise",
    title: "Enterprise",
    price: 99.9,
    color: "#f55c27",
  },
];

type Features = {
  free: Array<string>;
  starter: Array<string>;
  medium: Array<string>;
  enterprise: Array<string>;
};

export const features: Features = {
  free: [
    "1 app",
    "15 deployments per month",
    "1m requests",
    "50 GB bandwidth",
    "Unlimited team seats",
    "Unlimited domains",
    "Unlimited environments",
    "TLS certificates included",
  ],
  starter: ["Everything in free", "100 deployments per month"],
  medium: ["Everything in starter", "500 deployments per month"],
  enterprise: ["Everything in medium", "1000 deployments per month"],
};

export const stripePromise = loadStripe(process.env.STRIPE_API_KEY || "");
export const stripeStyles = {
  base: {
    fontSize: "16px",
    color: "#b2b2b2",
    "::placeholder": {
      color: "#32325d",
    },
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a",
  },
};
