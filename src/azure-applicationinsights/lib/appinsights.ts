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

  // Save Instrumentation Key to Key Vault
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
