import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useFetchDomains } from "./actions";
import { useEffect, useState } from "react";

interface Props {
  envId: string;
  appId: string;
  onDomainSelect: (d: Domain | null) => void;
}

export default function DomainSelector({
  appId,
  envId,
  onDomainSelect,
}: Props) {
  const [selected, setSelected] = useState<string>();
  const { domains, loading, error } = useFetchDomains({
    appId,
    envId,
  });

  useEffect(() => {
    if (!loading && !error && !domains.length) {
      return onDomainSelect(null);
    }

    if (!selected && domains.length) {
      return onDomainSelect(domains[0]);
    }
  }, [domains, loading, error, selected]);

  return (
    <Select
      value={selected || domains?.[0]?.id || ""}
      size="small"
      onChange={e => {
        setSelected(e.target.value);
        onDomainSelect(domains.find(d => d.id === e.target.value)!);
      }}
    >
      {domains
        ?.filter(d => d.verified)
        ?.map(domain => (
          <MenuItem value={domain.id} key={domain.id}>
            {domain.domainName}
          </MenuItem>
        ))}
    </Select>
  );
}
