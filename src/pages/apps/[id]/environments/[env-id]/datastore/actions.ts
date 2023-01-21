import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface WithCollectionsProps {
  appId: string;
  envId: string;
}

interface WithCollectionsReturnValue {
  loading: boolean;
  error?: string;
  collections: Collection[];
}

export const useWithCollections = ({
  appId,
  envId,
}: WithCollectionsProps): WithCollectionsReturnValue => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    api
      .post<{ collections: Collection[] }>(`/app/data-storage/collections`, {
        appId,
        envId,
      })
      .then(data => {
        setCollections(data.collections);
      })
      .catch(() => {
        setError("Something went wrong while fetching collections.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, error, collections };
};

interface WithRecordsProps {
  appId: string;
  envId: string;
  collectionName: string;
  filters?: Record<string, Filter | Primitive>;
}

type Primitive = string | number | boolean;

type Filter = {
  "="?: Primitive;
  ">"?: number;
  "<"?: number;
  ">="?: number;
  "<="?: number;
  "!="?: Primitive;
  in?: string[] | number[];
};

interface WithRecordsReturnValue {
  loading: boolean;
  records: CollectionRecord[];
  error?: string;
  setReload: (val: number) => void;
}

interface CollectionRecordAPI {
  recordId: string;
  record: Record<string, unknown>;
  createdAt: number;
}

export const useWithRecords = ({
  appId,
  envId,
  collectionName,
  filters,
}: WithRecordsProps): WithRecordsReturnValue => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<CollectionRecord[]>([]);
  const [reload, setReload] = useState<number>();

  useEffect(() => {
    setError(undefined);
    setLoading(true);

    api
      .post<CollectionRecordAPI[]>(`/app/data-storage/query`, {
        appId,
        envId,
        collectionName,
      })
      .then(data => {
        setRecords(
          data.map(d => ({
            id: d.recordId,
            value: d.record,
            createdAt: d.createdAt * 1000,
          }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reload]);

  return { error, loading, records, setReload };
};

interface DeleteRecordProps {
  appId: string;
  collectionName: string;
  recordId: string;
}

export const deleteRecord = ({
  appId,
  collectionName,
  recordId,
}: DeleteRecordProps) => {
  return api.delete("/app/data-storage", {
    appId,
    collectionName,
    recordIds: [recordId],
  });
};
