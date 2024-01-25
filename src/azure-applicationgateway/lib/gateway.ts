import { ApplicationGateway } from "@cdktf/provider-azurerm/lib/application-gateway";
import * as azapgw from "@cdktf/provider-azurerm/lib/application-gateway";
import { KeyVault } from "@cdktf/provider-azurerm/lib/key-vault";
import { KeyVaultAccessPolicyA } from "@cdktf/provider-azurerm/lib/key-vault-access-policy";
import { PublicIp } from "@cdktf/provider-azurerm/lib/public-ip";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Subnet } from "@cdktf/provider-azurerm/lib/subnet";
import { UserAssignedIdentity } from "@cdktf/provider-azurerm/lib/user-assigned-identity";
import { Construct } from "constructs";
import * as vnet from "../../azure-virtualnetwork";
import { AzureResource } from "../../core-azure";

// Define the interface for Application Gateway properties
export interface GatewayProps {
  /**
   * Optional public IP address for the frontend of the Application Gateway.
   */
  publicIpAddress?: PublicIp;

  /**
   * Optional private IP address for the frontend of the Application Gateway.
   */
  privateIpAddress?: string;

  /**
   * Allocation method for the private IP address (e.g., Static, Dynamic).
   */
  privateIpAddressAllocation?: string;

  /**
   * The name of the Application Gateway.
   */
  readonly name: string;

  /**
   * The location where the Application Gateway will be deployed (e.g., region).
   */
  readonly location: string;

  /**
   * The resource group under which the Application Gateway will be deployed.
   */
  readonly resourceGroup: ResourceGroup;

  /**
   * The SKU tier of the Application Gateway (e.g., Standard, WAF).
   */
  readonly skuTier: string;

  /**
   * The size of the SKU for the Application Gateway.
   */
  readonly skuSize: string;

  /**
   * The capacity (instance count) of the Application Gateway.
   */
  readonly capacity: number;

  /**
   * The backend address pools for the Application Gateway.
   */
  readonly backendAddressPools: azapgw.ApplicationGatewayBackendAddressPool[];

  /**
   * The backend HTTP settings for the Application Gateway.
   */
  readonly backendHttpSettings: azapgw.ApplicationGatewayBackendHttpSettings[];

  /**
   * Optional frontend ports for the Application Gateway.
   */
  readonly frontendPorts?: azapgw.ApplicationGatewayFrontendPort[];

  /**
   * The HTTP listeners for the Application Gateway.
   */
  readonly httpListeners: azapgw.ApplicationGatewayHttpListener[];

  /**
   * The request routing rules for the Application Gateway.
   */
  readonly requestRoutingRules: azapgw.ApplicationGatewayRequestRoutingRule[];

  /**
   * Optional subnet for the Application Gateway.
   */
  readonly subnet?: Subnet;

  /**
   * Optional tenant ID for use with Key Vault, if applicable.
   */
  readonly tenantId?: string;

  /**
   * Flag to enable HTTP2.
   */
  readonly enableHttp2?: boolean;

  /**
   * Flag to enable FIPS-compliant algorithms.
   */
  readonly fipsEnabled?: boolean;

  /**
   * Optional ID of the firewall policy.
   */
  readonly firewallPolicyId?: string;

  /**
   * Flag to enforce association of the firewall policy.
   */
  readonly forceFirewallPolicyAssociation?: boolean;

  /**
   * Optional tags for the Application Gateway resource.
   */
  readonly tags?: { [key: string]: string };

  /**
   * Optional availability zones for the Application Gateway.
   */
  readonly zones?: string[];

  /**
   * Optional Key Vault resource for storing SSL certificates.
   */
  readonly keyVault?: KeyVault;

    /**
   * Optional authentication certificates for mutual authentication.
   */
    readonly authenticationCertificate?: azapgw.ApplicationGatewayAuthenticationCertificate[];

    /**
     * Optional autoscale configuration for dynamically adjusting the capacity of the Application Gateway.
     */
    readonly autoscaleConfiguration?: azapgw.ApplicationGatewayAutoscaleConfiguration;
  
    /**
     * Optional custom error configurations to specify custom error pages.
     */
    readonly customErrorConfiguration?: azapgw.ApplicationGatewayCustomErrorConfiguration[];
  
    /**
     * Optional identity for the Application Gateway, used for accessing other Azure resources.
     */
    readonly identity?: azapgw.ApplicationGatewayIdentity;
  
    /**
     * Optional configurations for enabling Private Link on the Application Gateway.
     */
    readonly privateLinkConfiguration?: azapgw.ApplicationGatewayPrivateLinkConfiguration[];
  
    /**
     * Optional probes for health checks of the backend HTTP settings.
     */
    readonly probe?: azapgw.ApplicationGatewayProbe[];
  
    /**
     * Optional configurations for redirect rules.
     */
    readonly redirectConfiguration?: azapgw.ApplicationGatewayRedirectConfiguration[];
  
    /**
     * Optional rewrite rule sets for modifying HTTP request and response headers and bodies.
     */
    readonly rewriteRuleSet?: azapgw.ApplicationGatewayRewriteRuleSet[];
  
    /**
     * Optional SSL certificates for enabling HTTPS on the Application Gateway.
     */
    readonly sslCertificate?: azapgw.ApplicationGatewaySslCertificate[];
  
    /**
     * Optional SSL policy configurations, defining the protocol and cipher suites used.
     */
    readonly sslPolicy?: azapgw.ApplicationGatewaySslPolicy;
  
    /**
     * Optional SSL profiles for managing SSL termination and policy settings.
     */
    readonly sslProfile?: azapgw.ApplicationGatewaySslProfile[];
  
    /**
     * Optional timeout settings for the Application Gateway resources.
     */
    readonly timeouts?: azapgw.ApplicationGatewayTimeouts;
  
    /**
     * Optional trusted client certificates for mutual authentication.
     */
    readonly trustedClientCertificate?: azapgw.ApplicationGatewayTrustedClientCertificate[];
  
    /**
     * Optional trusted root certificates for backend authentication.
     */
    readonly trustedRootCertificate?: azapgw.ApplicationGatewayTrustedRootCertificate[];
  
    /**
     * Optional URL path map for routing based on URL paths.
     */
    readonly urlPathMap?: azapgw.ApplicationGatewayUrlPathMap[];
  
    /**
     * Optional Web Application Firewall (WAF) configuration to provide enhanced security.
     */
    readonly wafConfiguration?: azapgw.ApplicationGatewayWafConfiguration;
  
}

// Define the class for Azure Application Gateway
export class Gateway extends AzureResource {
  public resourceGroup: ResourceGroup;
  public id: string;

  constructor(scope: Construct, id: string, props: GatewayProps) {
    super(scope, id);

    // Define the identity
    let identity;

    // Check if Azure Key Vault is used and no identity is provided
    if (props.keyVault && !props.identity) {
      // Create a managed identity and add it to identityIds
      const managedIdentity = new UserAssignedIdentity(
        this,
        "ManagedIdentity",
        {
          name: `mi-${props.name}`,
          resourceGroupName: props.resourceGroup.name,
          location: props.location,
        },
      );

      identity = {
        identityIds: [managedIdentity.id],
        type: "UserAssigned",
      };

      new KeyVaultAccessPolicyA(this, "policy", {
        keyVaultId: props.keyVault.id,
        tenantId: props.tenantId || "",
        objectId: managedIdentity.principalId,
        secretPermissions: ["Get", "List"],
      });
    }

    const defaults = {
      subnetId:
        props.subnet?.id ||
        new vnet.Network(this, "vnet", {
          resourceGroup: props.resourceGroup,
        }).subnets.default.id,
      identity: props.identity || identity,
    };

    // WAF configuration
    let wafConfiguration = props.wafConfiguration
      ? {
          enabled: props.wafConfiguration.enabled,
          firewallMode: props.wafConfiguration.firewallMode || "Detection",
          ruleSetVersion: props.wafConfiguration.ruleSetVersion || "3.0",
        }
      : undefined;

    // Dynamically create frontend IP configurations
    let frontendIpConfigs = [];

    // Public IP configuration
    if (props.publicIpAddress) {
      frontendIpConfigs.push({
        name: "Public-frontend-ip-configuration",
        publicIpAddressId: props.publicIpAddress.id,
      });
    }

    // Private IP configuration
    if (props.privateIpAddress || props.privateIpAddressAllocation) {
      frontendIpConfigs.push({
        name: "Private-frontend-ip-configuration",
        subnetId: defaults.subnetId,
        privateIpAddress: props.privateIpAddress,
        privateIpAddressAllocation: props.privateIpAddressAllocation,
      });
    }

    // Set default frontend ports if not provided
    const defaultFrontendPorts = [
      { name: "80", port: 80 },
      { name: "443", port: 443 },
    ];

    const frontendPorts =
      props.frontendPorts && props.frontendPorts.length > 0
        ? props.frontendPorts
        : defaultFrontendPorts;

    // Create the Application Gateway
    const apgw = new ApplicationGateway(this, "ApplicationGateway", {
      name: props.name,
      resourceGroupName: props.resourceGroup.name,
      location: props.location,
      sslCertificate: props.sslCertificate,
      sslPolicy: props.sslPolicy,
      sslProfile: props.sslProfile,
      authenticationCertificate: props.authenticationCertificate,
      autoscaleConfiguration: props.autoscaleConfiguration,
      customErrorConfiguration: props.customErrorConfiguration,
      redirectConfiguration: props.redirectConfiguration,
      rewriteRuleSet: props.rewriteRuleSet,
      privateLinkConfiguration: props.privateLinkConfiguration,
      wafConfiguration: wafConfiguration,
      sku: {
        name: props.skuSize,
        tier: props.skuTier,
        capacity: props.capacity,
      },
      gatewayIpConfiguration: [
        {
          subnetId: defaults.subnetId,
          name: `${props.name}-configuration`,
        },
      ],
      frontendPort: frontendPorts,
      frontendIpConfiguration: frontendIpConfigs,
      backendAddressPool: props.backendAddressPools,
      backendHttpSettings: props.backendHttpSettings,
      httpListener: props.httpListeners,
      urlPathMap: props.urlPathMap,
      trustedRootCertificate: props.trustedRootCertificate,
      requestRoutingRule: props.requestRoutingRules,
      probe: props.probe,
      identity: defaults.identity,
      zones: props.zones,
      tags: props.tags,

    });

    this.id = apgw.id;
    this.resourceGroup = props.resourceGroup;
  }
}
