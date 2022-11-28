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

  useEffect(() => {
    setError(undefined);
    setLoading(true);

    api
      .post<CollectionRecord[]>(`/app/data-storage/query`, {
        appId,
        envId,
        keyName: collectionName,
      })
      .then(data => {
        setRecords(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { error, loading, records };
};
