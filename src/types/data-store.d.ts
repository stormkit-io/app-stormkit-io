declare type CollectionRecord = Record<string, unknown> & { recordId: string };

declare interface Collection {
  name: string;
  count: number;
}
