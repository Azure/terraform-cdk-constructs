import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Construct } from "constructs";
import {
  DiagnosticSettings,
  BaseDiagnosticSettingsProps,
} from "./diagsettings";
import { Rbac } from "./rbac";
import * as metricalert from "../../azure-metricalert";
import * as queryalert from "../../azure-queryrulealert";

export abstract class AzureResource extends Construct {
  public id: string;
  public abstract resourceGroup: ResourceGroup;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.id = id;
  }

  /**
   * Adds an access role assignment for a specified Azure AD object (e.g., user, group, service principal) within this RBAC construct's scope.
   *
   * This method creates a new role assignment which grants the specified Azure AD object access to resources
   * at the scope defined by this construct. This is useful for programmatically managing access controls,
   * ensuring only authorized users or systems can perform specific actions on Azure resources.
   *
   * @param objectId - The unique identifier of the Azure AD object (user, group, or service principal) that will receive the role assignment.
   * @param customRoleName - The human-readable name of the Azure RBAC role to be assigned. This role defines the permissions that the object will have.
   *
   * Example usage:
   * ```typescript
   * // Example: Assign a "Reader" role to a user for the current RBAC scope
   * rbacInstance.addAccess('user-object-id', 'Reader');
   * ```
   */
  public addAccess(objectId: string, customRoleName: string) {
    new Rbac(this, objectId + customRoleName, {
      objectId: objectId,
      roleDefinitionName: customRoleName,
      scope: this.id,
    });
  }

  /**
   * Adds diagnostic settings to a specified resource within this construct.
   *
   * This method creates and configures a new DiagnosticSettings instance which captures and routes
   * diagnostic data (logs and metrics) to the specified destinations such as Azure Monitor,
   * an Event Hubs instance, a Log Analytics workspace, or an Azure Storage account.
   *
   * @param props - The properties required to configure the diagnostic settings. These include:
   *                - `name`: Optional. The name of the diagnostic settings resource. Defaults to 'diag-settings'.
   *                - `logAnalyticsWorkspaceId`: Optional. The identifier of the Log Analytics workspace to send logs.
   *                - `eventhubAuthorizationRuleId`: Optional. The authorization rule ID for an Event Hub where logs will be forwarded.
   *                - `eventhubName`: Optional. The name of the Event Hub to which logs will be sent.
   *                - `storageAccountId`: Optional. The identifier of the Azure Storage account where logs will be stored.
   *                - `logAnalyticsDestinationType`: Optional. Determines if logs are sent to dedicated or legacy tables in Log Analytics. Defaults to undefined which uses the default settings.
   *                The `targetResourceId` is automatically set to the ID of this construct instance.
   *
   * @returns An instance of the DiagnosticSettings class, configured with the provided properties.
   *
   * Example usage:
   * ```typescript
   * const diagSettings = resource.addDiagSettings({
   *   name: 'custom-diag-settings',
   *   logAnalyticsWorkspaceId: 'workspace-id',
   *   eventhubAuthorizationRuleId: 'auth-rule-id',
   *   eventhubName: 'eventhub-name',
   *   storageAccountId: 'storage-account-id'
   * });
   * ```
   */
  public addDiagSettings(
    props: BaseDiagnosticSettingsProps,
  ): DiagnosticSettings {
    return new DiagnosticSettings(this, "diagsettings", {
      name: props.name || "diag-settings",
      logAnalyticsWorkspaceId: props.logAnalyticsWorkspaceId,
      eventhubAuthorizationRuleId: props.eventhubAuthorizationRuleId,
      eventhubName: props.eventhubName,
      storageAccountId: props.storageAccountId,
      targetResourceId: this.id,
      logAnalyticsDestinationType: undefined,
      log: props?.log,
      metric: props?.metric,
    });
  }

  protected setupResourceGroup(props: any): ResourceGroup {
    if (!props.resourceGroup) {
      // Create a new resource group
      const newResourceGroup = new ResourceGroup(this, "rg", {
        name: `rg-${props.name}`,
        location: props.location || "eastus",
        tags: props.tags,
      });
      // Use the name of the new resource group
      return newResourceGroup;
    } else {
      // Use the provided resource group name
      return props.resourceGroup;
    }
  }
}

export abstract class AzureResourceWithAlert extends AzureResource {
  public addQueryRuleAlert(props: queryalert.BaseAzureQueryRuleAlertProps) {
    new queryalert.QueryRuleAlert(this, "queryrulealert", {
      ...props,
      scopes: [this.id],
    });
  }

  public addMetricAlert(props: metricalert.IBaseMetricAlertProps) {
    new metricalert.MetricAlert(this, "metricalert", {
      ...props,
      resourceGroup: this.resourceGroup,
      scopes: [this.id],
    });
  }
}
