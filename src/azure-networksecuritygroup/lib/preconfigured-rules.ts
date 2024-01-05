import { RuleConfig } from ".";

/**
 * Properties for defining overrides for a rule in an Azure Network Security Group.
 */
export interface RuleOverrides {
  /**
   * Optional source address prefix to be matched for the rule. This can be an IP address or a range of IP addresses.
   * If not specified, the default behavior is to match any source address.
   */
  readonly sourceAddressPrefix?: string;

  /**
   * Optional destination address prefix to be matched for the rule. Similar to the source address prefix,
   * this can be a specific IP address or a range. If not provided, it defaults to matching any destination address.
   */
  readonly destinationAddressPrefix?: string;

  /**
   * Optional priority for the rule. Rules are processed in the order of their priority,
   * with lower numbers processed before higher numbers. If not provided, a default priority will be assigned.
   */
  readonly priority?: number;
}

export class PreconfiguredRules {
  // Active Directory
  static activeDirectoryAllowADReplication: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "*",
    sourcePortRange: "*",
    destinationPortRange: "389",
    name: "AllowADReplication",
    priority: 601,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowADReplicationSSL: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "*",
    sourcePortRange: "*",
    destinationPortRange: "636",
    name: "AllowADReplicationSSL",
    priority: 602,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowADGCReplication: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "*",
    sourcePortRange: "*",
    destinationPortRange: "3268",
    name: "AllowADGCReplication",
    priority: 603,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowADGCReplicationSSL: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "*",
    sourcePortRange: "*",
    destinationPortRange: "3269",
    name: "AllowADGCReplicationSSL",
    priority: 604,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowDNS: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "*",
    sourcePortRange: "*",
    destinationPortRange: "53",
    name: "AllowDNS",
    priority: 605,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowKerberosAuthentication: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "*",
    sourcePortRange: "*",
    destinationPortRange: "88",
    name: "AllowKerberosAuthentication",
    priority: 606,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowADReplicationTrust: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "*",
    sourcePortRange: "*",
    destinationPortRange: "445",
    name: "AllowADReplicationTrust",
    priority: 607,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowSMTPReplication: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "25",
    name: "AllowSMTPReplication",
    priority: 608,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowRPCReplication: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "135",
    name: "AllowRPCReplication",
    priority: 609,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowFileReplication: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "5722",
    name: "AllowFileReplication",
    priority: 610,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowWindowsTime: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "UDP",
    sourcePortRange: "*",
    destinationPortRange: "123",
    name: "AllowWindowsTime",
    priority: 611,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowPasswordChangeKerberes: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "*",
    sourcePortRange: "*",
    destinationPortRange: "464",
    name: "AllowPasswordChangeKerberes",
    priority: 612,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowDFSGroupPolicy: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "UDP",
    sourcePortRange: "*",
    destinationPortRange: "138",
    name: "AllowDFSGroupPolicy",
    priority: 613,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowADDSWebServices: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "9389",
    name: "AllowADDSWebServices",
    priority: 614,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowNETBIOSAuthentication: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "UDP",
    sourcePortRange: "*",
    destinationPortRange: "137",
    name: "AllowNETBIOSAuthentication",
    priority: 615,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static activeDirectoryAllowNETBIOSReplication: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "139",
    name: "AllowNETBIOSReplication",
    priority: 616,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // Cassandra
  static cassandra: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "9042",
    name: "Cassandra",
    priority: 551,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static cassandraJmx: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "7199",
    name: "Cassandra-JMX",
    priority: 552,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static cassandraThrift: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "9160",
    name: "Cassandra-Thrift",
    priority: 553,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // CouchDB
  static couchDb: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "5984",
    name: "CouchDB",
    priority: 554,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static couchDbHttps: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "6984",
    name: "CouchDB-HTTPS",
    priority: 555,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // DNS-Tcp
  static dnsTcp: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "53",
    name: "DNS-Tcp",
    priority: 520,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // DNS-UDP
  static dnsUdp: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "UDP",
    sourcePortRange: "*",
    destinationPortRange: "53",
    name: "DNS-UDP",
    priority: 521,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // DynamicPorts
  static dynamicPorts: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "49152-65535",
    name: "DynamicPorts",
    priority: 650,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // ElasticSearch
  static elasticSearch: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "9200-9300",
    name: "ElasticSearch",
    priority: 556,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // FTP
  static ftp: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "21",
    name: "FTP",
    priority: 512,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // HTTP-Tcp
  static httpTcp: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "80",
    name: "HTTP",
    priority: 513,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // HTTP-UDP
  static httpUdp: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "UDP",
    sourcePortRange: "*",
    destinationPortRange: "80",
    name: "HTTP",
    priority: 514,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // HTTPS-Tcp
  static https: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "443",
    name: "HTTPS",
    priority: 515,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // IMAP
  static imap: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "143",
    name: "IMAP",
    priority: 516,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // IMAPS
  static imaps: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "993",
    name: "IMAPS",
    priority: 516,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // Kestrel
  static kestrel: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "22133",
    name: "Kestrel",
    priority: 517,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // LDAP
  static ldap: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "389",
    name: "LDAP",
    priority: 558,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // MongoDB
  static mongoDB: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "27017",
    name: "MongoDB",
    priority: 559,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // Memcached
  static memcached: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "11211",
    name: "Memcached",
    priority: 560,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // MSSQL
  static mssql: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "1433",
    name: "MSSQL",
    priority: 561,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // MySQL
  static mySQL: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "3306",
    name: "MySQL",
    priority: 562,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // Neo4J
  static neo4J: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "7474",
    name: "Neo4J",
    priority: 563,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // POP3
  static pop3: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "110",
    name: "POP3",
    priority: 564,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // POP3S
  static pop3s: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "995",
    name: "POP3S",
    priority: 565,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // PostgreSQL
  static postgreSQL: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "5432",
    name: "PostgreSQL",
    priority: 566,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // RabbitMQ
  static rabbitMQ: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "5672",
    name: "RabbitMQ",
    priority: 567,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // RDP
  static rdp: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "3389",
    name: "RDP",
    priority: 505,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // Redis
  static redis: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "6379",
    name: "Redis",
    priority: 568,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // Riak
  static riak: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "8093",
    name: "Riak",
    priority: 568,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // RiakJMX
  static riakJMX: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "8985",
    name: "Riak-JMX",
    priority: 569,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // SMTP
  static smtp: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "25",
    name: "SMTP",
    priority: 570,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // SMTPS
  static smtps: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "465",
    name: "SMTPS",
    priority: 571,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // SSH
  static ssh: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "22",
    name: "SSH",
    priority: 501,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  // WinRM
  static winRM: RuleConfig = {
    direction: "Inbound",
    access: "Allow",
    protocol: "Tcp",
    sourcePortRange: "*",
    destinationPortRange: "5986",
    name: "WinRM",
    priority: 502,
    sourceAddressPrefix: "*",
    destinationAddressPrefix: "*",
  };

  static applyRuleOverrides(
    baseRule: RuleConfig,
    overrides: RuleOverrides,
  ): RuleConfig {
    return {
      ...baseRule,
      ...overrides,
    };
  }

  static addSourceAddress(
    rule: RuleConfig,
    sourceAddressPrefix: string,
  ): RuleConfig {
    return { ...rule, sourceAddressPrefix };
  }

  static addDestinationAddress(
    rule: RuleConfig,
    destinationAddressPrefix: string,
  ): RuleConfig {
    return { ...rule, destinationAddressPrefix };
  }

  static addPriority(rule: RuleConfig, priority: number): RuleConfig {
    return { ...rule, priority };
  }
}
