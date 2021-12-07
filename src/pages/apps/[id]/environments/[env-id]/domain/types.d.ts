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
  };
}

declare interface Domain {
  tls: TLS;
  dns: DNS;
  domainName: string;
}
