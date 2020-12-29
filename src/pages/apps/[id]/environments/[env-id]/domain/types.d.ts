interface DNS {
  domainInUse: boolean;
  verified: boolean;
  cname: string;
  ips: Array<string>;
  txt: Record<string, unkown>;
}

declare interface Domain {
  DNS: DNS;
  TLS: unknown;
  domainName: string;
}
