import { useEffect, useMemo } from "react";
import MultiSelect from "~/components/MultiSelect";
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
  const { domains, loading, error } = useFetchDomains({
    appId,
    envId,
    verified: true,
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
