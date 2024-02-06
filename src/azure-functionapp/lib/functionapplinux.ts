import {
  LinuxFunctionApp,
  LinuxFunctionAppSiteConfig,
  LinuxFunctionAppSiteConfigApplicationStack,
  LinuxFunctionAppAuthSettings,
  LinuxFunctionAppAuthSettingsV2,
  LinuxFunctionAppIdentity,
  LinuxFunctionAppConnectionString,
} from "@cdktf/provider-azurerm/lib/linux-function-app";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { ServicePlan } from "@cdktf/provider-azurerm/lib/service-plan";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

/**
 * Properties for the Azure Linux Function App
 */
export interface FunctionAppLinuxProps {
  /**
   * The name of the Function App. This name must be unique within Azure.
   */
  readonly name: string;

  /**
   * The Azure Region where the Function App will be deployed, e.g., 'East US', 'West Europe'.
   */
  readonly location: string;

  /**
   * An optional reference to the resource group in which to deploy the Function App.
   * If not provided, the Function App will be deployed in the default resource group.
   */
  readonly resourceGroup?: ResourceGroup;

  /**
   * An optional reference to the storage account to be used by the Function App.
   * If not provided, a new storage account will be created.
   */
  readonly storageAccount?: StorageAccount;

  /**
   * Optional runtime version specification for the Function App, such as Node.js, .NET, or Java version.
   */
  readonly runtimeVersion?: LinuxFunctionAppSiteConfigApplicationStack;

  /**
   * Optional ID of an existing App Service Plan to host the Function App.
   * If not provided, a new plan will be created.
   */
  readonly servicePlan?: ServicePlan;

  /**
   * Optional SKU for the App Service Plan, defines the pricing tier and capabilities.
   */
  readonly servicePlanSku?: string;

  /**
   * Optional tags for categorizing and managing the Function App resources within Azure.
   */
  readonly tags?: { [key: string]: string };

  /**
   * Optional site configuration for additional settings like environment variables, and connection strings.
   */
  readonly siteConfig?: LinuxFunctionAppSiteConfig;

  /**
   * Optional ID for the App Service Environment to be used by the service plan.
   */
  readonly servicePlanAppServiceEnvironmentId?: string;

  /**
   * Optional maximum count of elastic workers for the App Service Plan.
   */
  readonly servicePlanMaximumElasticWorkerCount?: number;

  /**
   * Optional worker count for the App Service Plan.
   */
  readonly servicePlanWorkerCount?: number;

  /**
   * Optional flag to enable per-site scaling for the App Service Plan.
   */
  readonly servicePlanPerSiteScalingEnabled?: boolean;

  /**
   * Optional flag to enable zone balancing for the App Service Plan.
   */
  readonly servicePlanZoneBalancingEnabled?: boolean;

  /**
   * Optional authentication settings for the Function App.
   */
  readonly authSettings?: LinuxFunctionAppAuthSettings;

  /**
   * Optional advanced version of authentication settings for the Function App.
   */
  readonly authSettingsV2?: LinuxFunctionAppAuthSettingsV2;

  /**
   * Optional identity configuration for the Function App, for use in Managed Service Identity scenarios.
   */
  readonly identity?: LinuxFunctionAppIdentity;

  /**
   * Optional flag to enforce HTTPS only traffic.
   */
  readonly httpsOnly?: boolean;

  /**
   * Optional flag to enable client certificate authentication.
   */
  readonly clientCertificateEnabled?: boolean;

  /**
   * Optional mode for client certificate requirement (e.g., 'Required', 'Optional').
   */
  readonly clientCertificateMode?: string;

  /**
   * Optional paths that are excluded from client certificate authentication.
   */
  readonly clientCertificateExclusionPaths?: string;

  /**
   * Optional version setting for the Azure Functions runtime.
   */
  readonly functionsExtensionVersion?: string;

  /**
   * Optional flag to enable or disable the Function App.
   */
  readonly enabled?: boolean;

  /**
   * Optional flag to enable built-in logging capabilities.
   */
  readonly builtinLoggingEnabled?: boolean;

  /**
   * Optional connection string for external services or databases.
   */
  readonly connectionString?: LinuxFunctionAppConnectionString[];

  /**
   * Optional flag to enable or disable public network access to the Function App.
   */
  readonly publicNetworkAccessEnabled?: boolean;

  /**
   * Optional flag indicating if the storage account uses a Managed Identity.
   */
  readonly storageUsesManagedIdentity?: boolean;

  /**
   * Optional access key for the storage account.
   */
  readonly storageAccountAccessKey?: string;

  /**
   * Optional ID of a virtual network subnet for the Function App.
   */
  readonly virtualNetworkSubnetId?: string;

  /**
   * Optional path to a ZIP file for deployment to the Function App.
   */
  readonly zipDeployFile?: string;

  /**
   * Application settings for the Azure Function App.
   *
   * @property { [key: string]: string } appSettings - A collection of key-value pairs that contain the settings.
   *
   * Note on Runtime Settings:
   * - 'node_version' in 'site_config' sets the Node.js version.
   *   Terraform assigns this value to 'WEBSITE_NODE_DEFAULT_VERSION' in app settings.
   * - 'functions_extension_version' sets the Azure Functions runtime version.
   *   Terraform assigns this value to 'FUNCTIONS_EXTENSION_VERSION' in app settings.
   *
   * Note on Storage Settings:
   * - Properties like 'storage_account_access_key' are used for storage configurations.
   *   Terraform assigns these values to keys like 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING',
   *   'AzureWebJobsStorage' in app settings.
   *
   * Note on Application Insights Settings:
   * - Use 'application_insights_connection_string' and 'application_insights_key' for Application Insights configurations.
   *   Terraform assigns these to 'APPINSIGHTS_INSTRUMENTATIONKEY' and 'APPLICATIONINSIGHTS_CONNECTION_STRING' in app settings.
   *
   * Note on Health Check Settings:
   * - 'health_check_eviction_time_in_min' configures health check settings.
   *   Terraform assigns this value to 'WEBSITE_HEALTHCHECK_MAXPINGFAILURES' in app settings.
   *
   * Note on Storage Account Restriction:
   * - To restrict your storage account to a virtual network, set 'WEBSITE_CONTENTOVERVNET' to 1 in app settings.
   *   Ensure a predefined share is created for this configuration.
   */
  readonly appSettings?: { [key: string]: string };
}

export class FunctionAppLinux extends AzureResource {
  public id: string;
  public readonly defaultHostname: string;
  public readonly kind: string;
  public readonly name: string;
  public readonly storageAccount: StorageAccount;
  public readonly servicePlan: ServicePlan;
  public resourceGroup: ResourceGroup;
  /**
   * Constructs a new FunctionAppLinux.
   *
   * @param scope - The scope in which to define this construct.
   * @param id - The ID of this construct.
   * @param props - The properties for configuring the Azure Function App on Linux. The properties include:
   *                - `name`: Required. Unique name for the Function App within Azure.
   *                - `location`: Required. Azure Region for deployment.
   *                - `resourceGroup`: Optional. Reference to the resource group for deployment.
   *                - `storageAccount`: Optional. Reference to the storage account used by the Function App.
   *                - `runtimeVersion`: Optional. Specifies the runtime version (Node.js, .NET, Java, etc.).
   *                - `servicePlan`: Optional. ID of an existing App Service Plan.
   *                - `servicePlanSku`: Optional. SKU for the App Service Plan.
   *                - `tags`: Optional. Tags for resource management.
   *                - `siteConfig`: Optional. Additional site configuration settings.
   *                - Additional optional properties as described in `FunctionAppLinuxProps` interface.
   *
   * Example usage:
   * ```typescript
   * new FunctionAppLinux(this, 'premiumFA', {
   *   name: `faprem${this.name}`,
   *   location: 'eastus',
   *   servicePlanSku: ServicePlanSkus.PremiumEP1,
   *   runtimeVersion: {
   *     dotnetVersion: '5.0',
   *   },
   *   tags: {
   *     "test": "test"
   *   }
   * });
   * ```
   */
  constructor(scope: Construct, id: string, props: FunctionAppLinuxProps) {
    super(scope, id);

    this.resourceGroup = this.setupResourceGroup(props);
    this.storageAccount = this.setupStorageAccount(props);
    this.servicePlan = this.setupServicePlan(props);

    this.resourceGroup = this.resourceGroup;

    // Default siteConfig settings for each hosting plan
    let defaultSiteConfig: LinuxFunctionAppSiteConfig = {
      use32BitWorker: false,
      applicationStack: {
        nodeVersion: "14",
      },
    };

    // Merge user provided siteConfig with defaults
    const siteConfig = { ...defaultSiteConfig, ...props.siteConfig };

    const defaults = {
      httpsOnly: props.httpsOnly || true,
      clientCertificateEnabled: props.clientCertificateEnabled || false,
      clientCertificateMode: props.clientCertificateMode || "Required",
      identity: props.identity || { type: "SystemAssigned" },
      clientCertificateExclusionPaths:
        props.clientCertificateExclusionPaths || "",
      functionsExtensionVersion: props.functionsExtensionVersion || "~4",
      enabled: props.enabled || true,
      builtinLoggingEnabled: props.builtinLoggingEnabled || true,
      publicNetworkAccessEnabled: props.publicNetworkAccessEnabled || true,
      storageUsesManagedIdentity: props.storageUsesManagedIdentity || true,
      storageAccountAccessKey: undefined || props.storageAccountAccessKey,
    };

    // Create the Function App
    const functionApp = new LinuxFunctionApp(this, "FunctionApp", {
      ...defaults,
      name: props.name,
      location: props.location,
      resourceGroupName: this.resourceGroup.name,
      servicePlanId: this.servicePlan.id,
      storageAccountName: this.storageAccount.name,
      tags: props.tags,
      siteConfig: siteConfig,
      appSettings: props.appSettings,
      authSettings: props.authSettings,
      authSettingsV2: props.authSettingsV2,
      connectionString: props.connectionString,
      virtualNetworkSubnetId: props.virtualNetworkSubnetId,
      zipDeployFile: props.zipDeployFile,
    });

    this.id = functionApp.id;
    this.defaultHostname = functionApp.defaultHostname;
    this.kind = functionApp.kind;
    this.name = functionApp.name;
  }

  private setupResourceGroup(props: FunctionAppLinuxProps): ResourceGroup {
    if (!props.resourceGroup) {
      // Create a new resource group
      const newResourceGroup = new ResourceGroup(this, "rg", {
        name: `rg-${props.name}`,
        location: props.location,
        tags: props.tags,
      });
      // Use the name of the new resource group
      return newResourceGroup;
    } else {
      // Use the provided resource group name
      return props.resourceGroup;
    }
  }

  private setupStorageAccount(props: FunctionAppLinuxProps): StorageAccount {
    // Reference or create a new storage account that will be used by the Function App to store files
    if (!props.storageAccount) {
      return new StorageAccount(this, "sa", {
        name: `${props.name}stacc`,
        resourceGroupName: this.resourceGroup.name,
        location: props.location,
        accountReplicationType: "LRS",
        accountTier: "Standard",
        minTlsVersion: "TLS1_2",
        tags: props.tags,
        publicNetworkAccessEnabled: false,
        networkRules: {
          bypass: ["AzureServices"],
          defaultAction: "Deny",
        },
      });
    } else {
      return props.storageAccount;
    }
  }

  private setupServicePlan(props: FunctionAppLinuxProps): ServicePlan {
    const servicePlanSKU = props.servicePlanSku || "Y1";

    // Use an existing App Service Plan if the ID is provided, otherwise create a new one
    if (!props.servicePlan) {
      return new ServicePlan(this, "AppServicePlan", {
        name: `${props.name}asp`,
        location: props.location,
        resourceGroupName: this.resourceGroup.name,
        skuName: servicePlanSKU,
        osType: "Linux",
        appServiceEnvironmentId: props.servicePlanAppServiceEnvironmentId,
        maximumElasticWorkerCount: props.servicePlanMaximumElasticWorkerCount,
        workerCount: props.servicePlanWorkerCount,
        perSiteScalingEnabled: props.servicePlanPerSiteScalingEnabled,
        zoneBalancingEnabled: props.servicePlanZoneBalancingEnabled,
        tags: props.tags,
      });
    } else {
      return props.servicePlan;
    }
  }
}
