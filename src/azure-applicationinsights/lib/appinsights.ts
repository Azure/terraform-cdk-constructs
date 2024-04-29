import { ApplicationInsights } from "@cdktf/provider-azurerm/lib/application-insights";
import { KeyVaultSecret } from "@cdktf/provider-azurerm/lib/key-vault-secret";
import { LogAnalyticsWorkspace } from "@cdktf/provider-azurerm/lib/log-analytics-workspace";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { AzureResource } from "../../core-azure/lib";

// Construct
/**
 * Properties for the resource group
 */

export interface AppInsightsProps {
  /**
   * The Azure Region to deploy.
   */
  readonly location: string;
  /**
   * The name of the Application Insights resource.
   */
  readonly name: string;
  /**
   * The name of the Azure Resource Group to deploy to.
   */
  readonly resourceGroup: ResourceGroup;
  /**
   * The number of days of retention.
   * Possible values are 30, 60, 90, 120, 180, 270, 365, 550 or 730. Defaults to 90.
   * @default 90
   */
  readonly retentionInDays?: number;
  /**
   * The tags to assign to the Application Insights resource.
   */
  readonly tags?: { [key: string]: string };
  /**
   * The Application type.
   */
  readonly applicationType: string;
  /**
   * The Application Insights daily data cap in GB.
   */
  readonly dailyDataCapInGb?: number;
  /**
   * The Application Insights daily data cap notifications disabled.
   */
  readonly dailyDataCapNotificationDisabled?: boolean;
  /**
   * The id of the Log Analytics Workspace.
   * @default - If no workspace id is provided, a new one will be created automatically
   * in the same resource group. The name will be the same as the Application Insights
   * resource with a "-la" suffix.
   */
  readonly workspaceId?: string;
}

export class AppInsights extends AzureResource {
  readonly props: AppInsightsProps;
  public resourceGroup: ResourceGroup;
  public id: string;
  private readonly instrumentationKey: string;

  /**
   * Constructs a new Azure Application Insights resource.
   *
   * @param scope - The scope in which to define this construct.
   * @param id - The ID of this construct.
   * @param props - The properties for configuring the Azure Application Insights. The properties include:
   *                - `name`: Required. Unique name for the Application Insights resource within Azure.
   *                - `location`: Required. Azure Region for deployment.
   *                - `resourceGroup`: Required. Reference to the Azure Resource Group for deployment.
   *                - `retentionInDays`: Optional. Number of days to retain data. Default is 90 days.
   *                - `tags`: Optional. Tags for resource management.
   *                - `applicationType`: Required. The type of application (e.g., web, other).
   *                - `dailyDataCapInGb`: Optional. Daily data cap in gigabytes.
   *                - `dailyDataCapNotificationDisabled`: Optional. Flag to disable notifications when the daily data cap is reached.
   *                - `workspaceId`: Optional. ID of the Log Analytics Workspace to associate with Application Insights. If not provided, a new workspace is created automatically.
   *
   * Example usage:
   * ```typescript
   * new AppInsights(this, 'myAppInsights', {
   *   name: 'myAppInsightsResource',
   *   location: 'West US',
   *   resourceGroup: resourceGroup,
   *   retentionInDays: 120,
   *   tags: {
   *     "environment": "production"
   *   },
   *   applicationType: 'web',
   *   dailyDataCapInGb: 10,
   *   dailyDataCapNotificationDisabled: true,
   *   workspaceId: 'existing-workspace-id'
   * });
   * ```
   */

  constructor(scope: Construct, id: string, props: AppInsightsProps) {
    super(scope, id);

    this.props = props;
    this.resourceGroup = props.resourceGroup;

    const azurermApplicationInsightsAppinsights = new ApplicationInsights(
      this,
      "appinsights",
      {
        location: props.location,
        name: props.name,
        resourceGroupName: props.resourceGroup.name,
        tags: props.tags,
        applicationType: props.applicationType,
        dailyDataCapInGb: props.dailyDataCapInGb,
        dailyDataCapNotificationsDisabled:
          props.dailyDataCapNotificationDisabled,
        retentionInDays: props.retentionInDays,
        workspaceId: this.setupLogAnalytics(props),
      },
    );

    this.instrumentationKey =
      azurermApplicationInsightsAppinsights.instrumentationKey;
    this.id = azurermApplicationInsightsAppinsights.id;

    // Terraform Outputs
    const cdktfTerraformOutputAppiID = new cdktf.TerraformOutput(this, "id", {
      value: azurermApplicationInsightsAppinsights.id,
    });
    const cdktfTerraformOutputAppiName = new cdktf.TerraformOutput(
      this,
      "name",
      {
        value: azurermApplicationInsightsAppinsights.name,
      },
    );
    const cdktfTerraformOutputAppiAppId = new cdktf.TerraformOutput(
      this,
      "app_id",
      {
        value: azurermApplicationInsightsAppinsights.appId,
      },
    );
    const cdktfTerraformOutputAppiIKey = new cdktf.TerraformOutput(
      this,
      "instrumentation_key",
      {
        value: azurermApplicationInsightsAppinsights.instrumentationKey,
        sensitive: true,
      },
    );
    const cdktfTerraformOutputAppiConnectStr = new cdktf.TerraformOutput(
      this,
      "connection_string",
      {
        value: azurermApplicationInsightsAppinsights.connectionString,
        sensitive: true,
      },
    );

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputAppiID.overrideLogicalId("id");
    cdktfTerraformOutputAppiName.overrideLogicalId("name");
    cdktfTerraformOutputAppiAppId.overrideLogicalId("app_id");
    cdktfTerraformOutputAppiIKey.overrideLogicalId("instrumentation_key");
    cdktfTerraformOutputAppiConnectStr.overrideLogicalId("connection_string");
  }

  /**
   * Saves the Application Insights instrumentation key to an Azure Key Vault.
   *
   * This method creates a new secret in the specified Azure Key Vault with the
   * instrumentation key of the Application Insights resource. This enables secure storage
   * and management of the instrumentation key, facilitating secure access across various
   * Azure services.
   *
   * @param keyVaultId - The unique identifier of the Azure Key Vault where the secret will be stored.
   * @param keyVaultSecretName - The name of the secret within the Key Vault. Defaults to 'instrumentation-key'.
   *                             This name can be used to retrieve the secret in client applications.
   *
   * Example usage:
   * ```typescript
   * appInsightsInstance.saveIKeyToKeyVault('my-key-vault-id');
   * ```
   */
  public saveIKeyToKeyVault(
    keyVaultId: string,
    keyVaultSecretName: string = "instrumentation-key",
  ) {
    new KeyVaultSecret(this, keyVaultSecretName, {
      keyVaultId: keyVaultId,
      name: keyVaultSecretName,
      value: this.instrumentationKey,
    });
  }

  private setupLogAnalytics(props: AppInsightsProps): string {
    if (cdktf.canInspect(props.workspaceId)) {
      // Use the provided Log Analytics Workspace
      return props.workspaceId!;
    } else {
      // Create a new Log Analytics Workspace
      const logAnalyticsWorkspace = new LogAnalyticsWorkspace(
        this,
        "log_analytics",
        {
          location: props.location,
          name: `${props.name}-la`,
          resourceGroupName: props.resourceGroup.name,
          sku: "PerGB2018",
          retentionInDays: props.retentionInDays,
          tags: props.tags,
        },
      );
      return logAnalyticsWorkspace.id;
    }
  }
}
