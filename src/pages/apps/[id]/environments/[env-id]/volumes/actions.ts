import { useEffect, useState, useCallback } from "react";
import api from "~/utils/api/Api";

interface UseFetchConfigProps {
  refreshToken?: number;
}

export const useFetchConfig = ({ refreshToken }: UseFetchConfigProps) => {
  const [config, setConfig] = useState<VolumeConfig>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    api
      .fetch<{ config: VolumeConfig | boolean }>("/volumes/config")
      .then(({ config }) => {
        if (typeof config === "boolean") {
          setConfig(config ? {} : undefined);
        } else {
          setConfig(config);
        }
      })
      .catch(res => {
        if (res.status === 401) {
          setError("You are not authorized to perform this operation.");
        } else {
          setError("Unknown error while fetching volume configuration.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshToken]);

  return { config, loading, error };
};

interface UseFetchFilesProps {
  refreshToken?: number;
  appId: string;
  envId: string;
  beforeId?: string;
  setError: (v?: string) => void;
  setLoading: (v: boolean) => void;
}

export const useFetchFiles = ({
  refreshToken,
  appId,
  envId,
  beforeId = "",
  setLoading,
  setError,
}: UseFetchFilesProps) => {
  const [files, setFiles] = useState<VolumeFile[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    api
      .fetch<{ files: VolumeFile[] }>(
        `/volumes?appId=${appId}&envId=${envId}&beforeId=${beforeId}`
      )
      .then(({ files }) => {
        setFiles(files);
      })
      .catch(e => {
        console.log(e);
        setError("Unknown error while fetching files.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshToken]);

  return { files };
};

interface UploadFilesProps {
  appId: string;
  envId: string;
  setLoading: (v: boolean) => void;
  setError: (v: string) => void;
  setRefreshToken: (v: number) => void;
}

export const uploadFiles = ({
  appId,
  envId,
  setLoading,
  setError,
  setRefreshToken,
}: UploadFilesProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setLoading(true);

    // Create a FormData object to hold the files
    const formData = new FormData();

    // Append the files to the formData object
    acceptedFiles.forEach(file => {
      formData.append("files", file);
    });

    formData.append("appId", appId);
    formData.append("envId", envId);

    api
      .upload("/volumes", {
        body: formData,
      })
      .then(() => {
        setRefreshToken(Date.now());
      })
      .catch(() => {
        setError("Something went wrong while uploading files.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { onDrop };
};

interface RequestProps {
  appId: string;
  envId: string;
  fileId: string;
}

export const removeFiles = ({ appId, envId, fileId }: RequestProps) => {
  return api.delete(`/volumes?appId=${appId}&envId=${envId}&ids=${fileId}`);
};

export const fetchDownloadUrl = ({ appId, envId, fileId }: RequestProps) => {
  return api
    .fetch<{ downloadUrl: string }>(
      `/volumes/download/url?appId=${appId}&envId=${envId}&fileId=${fileId}`
    )
    .then(({ downloadUrl }) => downloadUrl);
};

interface ToggleVisibilityProps extends RequestProps {
  visibility: "public" | "private";
}

export const toggleVisibility = ({
  appId,
  envId,
  fileId,
  visibility,
}: ToggleVisibilityProps) => {
  return api.post("/volumes/visibility", { appId, envId, fileId, visibility });
};
