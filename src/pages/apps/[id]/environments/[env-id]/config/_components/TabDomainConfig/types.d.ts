interface DNS {
  verified: boolean;
  txt: {
    name: string;
    value: string;
    lookup: string;
  };
}

interface TLS {
  startDate: number;
  endDate: number;
  serialNo: string;
  signatureAlgorithm: string;
  issuer?: {
    name: string;
    organization: string[];
  };
}

declare interface Domain {
  tls: TLS | null;
  dns: DNS;
  domainName: string;
}
