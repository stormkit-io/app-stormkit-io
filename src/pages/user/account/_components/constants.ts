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
    "1 team seat",
    "1m requests (per app)",
    "50 GB bandwidth (per app)",
    "Unlimited domains",
    "Unlimited deployments",
    "Unlimited environments",
    "TLS certificates included",
  ],
  starter: ["Everything in free", "3 apps", "3 team seats"],
  medium: ["Everything in starter", "10 apps", "10 team seats"],
  enterprise: [
    "Everything in medium",
    "Unlimited apps",
    "Unlimited team seats",
  ],
};
