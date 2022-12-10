declare type FunctionTriggerMethod =
  | "POST"
  | "GET"
  | "PUT"
  | "DELETE"
  | "PATCH";

declare interface FunctionTriggerOptions {
  method: FunctionTriggerMethod;
  headers?: string;
  url: string;
  payload?: string;
}

declare interface FunctionTrigger {
  id?: string;
  cron: string;
  status: boolean;
  options: FunctionTriggerOptions;
}
