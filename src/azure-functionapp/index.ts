import { Construct } from 'constructs';
import {AzureResource} from "../core-azure";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { ServicePlan } from "@cdktf/provider-azurerm/lib/service-plan";
import { LinuxFunctionApp, LinuxFunctionAppSiteConfig, LinuxFunctionAppSiteConfigApplicationStack } from "@cdktf/provider-azurerm/lib/linux-function-app";
import { ResourceGroup } from '@cdktf/provider-azurerm/lib/resource-group';

enum HostingPlanType {
  Consumption = 'Consumption',
  Premium = 'Premium',
  ServicePlan = 'ServicePlan',
}

/**
 * Properties for the Azure Function App
 */
export interface AzureFunctionAppProps {
  /**
   * The name of the Function App.
   */
  readonly name: string;
  /**
   * The Azure Region to deploy.
   */
  readonly location: string;
  /**
   * The resource group name where the Function App will be deployed.
   */
  readonly resourceGroup?: ResourceGroup;
  /**
   * The storage account name. If not provided, a new one will be created.
   */
  readonly storageAccount?: StorageAccount;
  /**
   * The runtime for the Function App (e.g., 'node', 'dotnet', 'java').
   */
  readonly runtimeVersion?: LinuxFunctionAppSiteConfigApplicationStack;
 
  /**
   * The ID of an existing App Service Plan. If not provided, a new one will be created.
   */
  readonly servicePlan?: ServicePlan;

  servicePlanSku?: string;

  readonly tags?: { [key: string]: string };

  appSettings?: { [key: string]: string };

  siteConfig?: LinuxFunctionAppSiteConfig;

  /**
   * The hosting plan for the Azure Function App.
   * 
   * Options:
   * - 'Consumption (Serverless)': Optimized for serverless and event-driven workloads.
   * - 'Functions Premium': Event based scaling and network isolation, ideal for workloads running continuously.
   * - 'App Service Plan': Fully isolated and dedicated environment suitable for workloads that need large SKUs or need to co-locate Web Apps and Functions.
   */
  readonly hostingPlan?: HostingPlanType;
}

export class AzureLinuxFunctionApp extends AzureResource {
  public readonly id: string;
  public readonly defaultHostname: string;
  public readonly kind: string;
  public readonly name: string;
  public readonly storageAccount: StorageAccount;
  public readonly servicePlan: ServicePlan;
  public readonly resourceGroup: ResourceGroup;
  
   /**
   * Constructs a new AzureLinuxFunctionApp.
   * 
   * @param scope - The scope in which to define this construct.
   * @param id - The ID of this construct.
   * @param props - The properties for the Azure Function App.
   *
   * 
   * Example usage:
   * ```typescript
   * const functionApp = new AzureLinuxFunctionApp(this, 'MyFunctionApp', {
   *   name: 'myfunctionapp',
   *   location: 'West Europe',
   *   resourceGroup: myResourceGroup,
   *   storageAccount: myStorageAccount,
   *   runtimeVersion: { nodeVersion: '14' },
   *   hostingPlan: 'Consumption',
   *   // other configurations...
   * });
   * ```
   */
  constructor(scope: Construct, id: string, props: AzureFunctionAppProps) {
    super(scope, id);

    this.resourceGroup = this.setupResourceGroup(props);
    this.storageAccount = this.setupStorageAccount(props);
    this.servicePlan = this.setupServicePlan(props);

    // Default siteConfig settings for each hosting plan
    let defaultSiteConfig: LinuxFunctionAppSiteConfig = {
      use32BitWorker: false,
      applicationStack: {
        nodeVersion: '14', 
      }
    };

    
    // Merge user provided siteConfig with defaults
    const siteConfig = { ...defaultSiteConfig, ...props.siteConfig };

    // Create the Function App
    const functionApp =  new LinuxFunctionApp(this, 'FunctionApp', {
      name: props.name,
      location: props.location,
      resourceGroupName: this.resourceGroup.name,
      servicePlanId: this.servicePlan.id,
      storageAccountName: this.storageAccount.name,
      storageAccountAccessKey: this.storageAccount.primaryAccessKey,
      tags: props.tags,
      siteConfig: siteConfig,
      appSettings: props.appSettings,
    });

    this.id = functionApp.id;
    this.defaultHostname = functionApp.defaultHostname
    this.kind = functionApp.kind
    this.name = functionApp.name

  }

  private setupResourceGroup(props: AzureFunctionAppProps): ResourceGroup {

    if (!props.resourceGroup) {
      // Create a new resource group
      const newResourceGroup = new ResourceGroup(this, 'rg', {
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

  private setupStorageAccount(props: AzureFunctionAppProps): StorageAccount {
    // Reference or create a new storage account
    if (!props.storageAccount) {
      return new StorageAccount(this, 'sa', {
        name: `${props.name}stacc`,
        resourceGroupName: this.resourceGroup.name,
        location: props.location,
        accountReplicationType: 'LRS',
        accountTier: 'Standard',
        tags: props.tags,
      });
    } else {
      return props.storageAccount;
    }
  }

  private setupServicePlan(props: AzureFunctionAppProps): ServicePlan {
    const servicePlanSKU = props.servicePlanSku || 'Y1';

  
    // Use an existing App Service Plan if the ID is provided, otherwise create a new one
    if (!props.servicePlan) {
      return new ServicePlan(this, 'AppServicePlan', {
        name: `${props.name}asp`,
        location: props.location,
        resourceGroupName: this.resourceGroup.name,
        skuName: servicePlanSKU,
        osType: 'Linux',
        // Other properties...
        tags: props.tags,
      });
    } else {
      return props.servicePlan;
    }
  }
  

}

