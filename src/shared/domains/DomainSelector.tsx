import { useEffect, useMemo, useState } from "react";
import MultiSelect from "~/components/MultiSelect";
import { debounce } from "@mui/material/utils";
import { useFetchDomains } from "./actions";

interface Props {
  envId: string;
  appId: string;
  multiple?: boolean;
  selected?: string[];
  variant?: "outlined" | "filled";
  size?: "small" | "medium";
  label?: string;
  fullWidth?: boolean;
  withDevDomains?: boolean;
  onFetch?: (d: Domain[]) => void;
  // If withDevDomains is true, returns selected domain names
  // Otherwise, returns the domains.
  onDomainSelect: (d: Domain[] | string[] | null) => void;
}

export default function DomainSelector({
  appId,
  envId,
  fullWidth,
  multiple = false,
  withDevDomains = false,
  selected,
  label,
  size = "small",
  variant = "outlined",
  onFetch,
  onDomainSelect,
}: Props) {
  const [search, setSearch] = useState("");
  const { domains, loading, error } = useFetchDomains({
    appId,
    envId,
    verified: true,
    search,
  });

  useEffect(() => {
    if (!loading && !error) {
      onFetch?.(domains);
    }
  }, [domains, loading, error]);

  const items = useMemo(() => {
    return [
      withDevDomains
        ? { value: "*.dev", text: "All development endpoints (*.dev)" }
        : { value: "", text: "" },
      ...domains?.map(d => ({ value: d.domainName, text: d.domainName })),
    ].filter(i => i.value);
  }, [withDevDomains, domains]);

  const debouncedSearch = debounce((s: string) => {
    if (s.length > 2) {
      setSearch(s);
    }
  }, 300);

  if (loading || error) {
    return <></>;
  }

  return (
    <MultiSelect
      label={label}
      variant={variant}
      size={size}
      placeholder="All domains"
      fullWidth={fullWidth}
      multiple={multiple}
      items={items}
      selected={selected}
      onSearch={debouncedSearch}
      onSelect={values => {
        if (withDevDomains) {
          onDomainSelect(values);
        } else {
          onDomainSelect(domains.filter(d => values.includes(d.domainName)));
        }
      }}
    />
  );
}
