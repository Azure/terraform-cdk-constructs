import { RuleConfig } from ".";

interface RuleOverrides {
    sourceAddressPrefix?: string;
    destinationAddressPrefix?: string;
    priority?: number;
}


export class PreconfiguredRules {

    // Active Directory
    static ActiveDirectoryAllowADReplication: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "*",
        sourcePortRange: "*",
        destinationPortRange: "389",
        name: "AllowADReplication",
        priority: 601,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowADReplicationSSL: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "*",
        sourcePortRange: "*",
        destinationPortRange: "636",
        name: "AllowADReplicationSSL",
        priority: 602,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowADGCReplication: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "*",
        sourcePortRange: "*",
        destinationPortRange: "3268",
        name: "AllowADGCReplication",
        priority: 603,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowADGCReplicationSSL: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "*",
        sourcePortRange: "*",
        destinationPortRange: "3269",
        name: "AllowADGCReplicationSSL",
        priority: 604,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowDNS: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "*",
        sourcePortRange: "*",
        destinationPortRange: "53",
        name: "AllowDNS",
        priority: 605,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowKerberosAuthentication: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "*",
        sourcePortRange: "*",
        destinationPortRange: "88",
        name: "AllowKerberosAuthentication",
        priority: 606,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowADReplicationTrust: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "*",
        sourcePortRange: "*",
        destinationPortRange: "445",
        name: "AllowADReplicationTrust",
        priority: 607,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowSMTPReplication: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "25",
        name: "AllowSMTPReplication",
        priority: 608,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowRPCReplication: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "135",
        name: "AllowRPCReplication",
        priority: 609,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowFileReplication: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "5722",
        name: "AllowFileReplication",
        priority: 610,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowWindowsTime: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "UDP",
        sourcePortRange: "*",
        destinationPortRange: "123",
        name: "AllowWindowsTime",
        priority: 611,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowPasswordChangeKerberes: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "*",
        sourcePortRange: "*",
        destinationPortRange: "464",
        name: "AllowPasswordChangeKerberes",
        priority: 612,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowDFSGroupPolicy: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "UDP",
        sourcePortRange: "*",
        destinationPortRange: "138",
        name: "AllowDFSGroupPolicy",
        priority: 613,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowADDSWebServices: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "9389",
        name: "AllowADDSWebServices",
        priority: 614,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowNETBIOSAuthentication: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "UDP",
        sourcePortRange: "*",
        destinationPortRange: "137",
        name: "AllowNETBIOSAuthentication",
        priority: 615,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static ActiveDirectoryAllowNETBIOSReplication: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "139",
        name: "AllowNETBIOSReplication",
        priority: 616,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // Cassandra
    static Cassandra: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "9042",
        name: "Cassandra",
        priority: 551,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static CassandraJMX: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "7199",
        name: "Cassandra-JMX",
        priority: 552,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static CassandraThrift: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "9160",
        name: "Cassandra-Thrift",
        priority: 553,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // CouchDB      
    static CouchDB: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "5984",
        name: "CouchDB",
        priority: 554,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    static CouchDBHTTPS: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "6984",
        name: "CouchDB-HTTPS",
        priority: 555,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // DNS-Tcp
    static DNSTcp: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "53",
        name: "DNS-Tcp",
        priority: 520,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // DNS-UDP
    static DNSUDP: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "UDP",
        sourcePortRange: "*",
        destinationPortRange: "53",
        name: "DNS-UDP",
        priority: 521,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // DynamicPorts
    static DynamicPorts: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "49152-65535",
        name: "DynamicPorts",
        priority: 650,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // ElasticSearch
    static ElasticSearch: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "9200-9300",
        name: "ElasticSearch",
        priority: 556,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // FTP
    static FTP: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "21",
        name: "FTP",
        priority: 512,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // HTTP-Tcp
    static HTTP_Tcp: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "80",
        name: "HTTP",
        priority: 513,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // HTTP-UDP
    static HTTP_UDP: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "UDP",
        sourcePortRange: "*",
        destinationPortRange: "80",
        name: "HTTP",
        priority: 514,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // HTTPS-Tcp
    static HTTPS: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "443",
        name: "HTTPS",
        priority: 515,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // IMAP
    static IMAP: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "143",
        name: "IMAP",
        priority: 516,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // IMAPS
    static IMAPS: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "993",
        name: "IMAPS",
        priority: 516,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // Kestrel
    static Kestrel: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "22133",
        name: "Kestrel",
        priority: 517,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // LDAP
    static LDAP: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "389",
        name: "LDAP",
        priority: 558,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };


    // MongoDB
    static MongoDB: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "27017",
        name: "MongoDB",
        priority: 559,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // Memcached
    static Memcached: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "11211",
        name: "Memcached",
        priority:560,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // MSSQL
    static MSSQL: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "1433",
        name: "MSSQL",
        priority: 561,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // MySQL
    static MySQL: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "3306",
        name: "MySQL",
        priority: 562,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // Neo4J
    static Neo4J: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "7474",
        name: "Neo4J",
        priority: 563,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // POP3
    static POP3: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "110",
        name: "POP3",
        priority: 564,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // POP3S
    static POP3S: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "995",
        name: "POP3S",
        priority: 565,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // PostgreSQL
    static PostgreSQL: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "5432",
        name: "PostgreSQL",
        priority: 566,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // RabbitMQ
    static RabbitMQ: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "5672",
        name: "RabbitMQ",
        priority: 567,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // RDP
    static RDP: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "3389",
        name: "RDP",
        priority: 505,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // Redis
    static Redis: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "6379",
        name: "Redis",
        priority: 568,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // Riak
    static Riak: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "8093",
        name: "Riak",
        priority: 568,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // RiakJMX
    static RiakJMX: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "8985",
        name: "Riak-JMX",
        priority: 569,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // SMTP
    static SMTP: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "25",
        name: "SMTP",
        priority: 570,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // SMTPS
    static SMTPS: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "465",
        name: "SMTPS",
        priority: 571,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // SSH
    static SSH: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "22",
        name: "SSH",
        priority: 501,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };

    // WinRM
    static WinRM: RuleConfig = {
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "5986",
        name: "WinRM",
        priority: 502,
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*'
    };




    static applyRuleOverrides(baseRule: RuleConfig, overrides: RuleOverrides): RuleConfig {
        return {
            ...baseRule,
            ...overrides
        };
    }

    static addSourceAddress(rule: RuleConfig, sourceAddressPrefix: string): RuleConfig {
        return { ...rule, sourceAddressPrefix };
    }

    static addDestinationAddress(rule: RuleConfig, destinationAddressPrefix: string): RuleConfig {
        return { ...rule, destinationAddressPrefix };
    }

    static addPriority(rule: RuleConfig, priority: number): RuleConfig {
        return { ...rule, priority };
    }
}


