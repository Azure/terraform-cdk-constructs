import { Construct } from "constructs";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import {
  DiagnosticSettings,
  BaseDiagnosticSettingsProps,
} from "./diagsettings";
import { Rbac } from "./rbac";
import * as metricalert from "../../azure-metricalert";
import * as queryalert from "../../azure-queryrulealert";

export abstract class AzureResource extends Construct {
  public id: string;
  public abstract resourceGroupName: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.id = id;
  }

  public addAccess(objectId: string, customRoleName: string) {
    new Rbac(this, objectId + customRoleName, {
      objectId: objectId,
      roleDefinitionName: customRoleName,
      scope: this.id,
    });
  }

  // Diag Settings Methods
  public addDiagSettings(props: BaseDiagnosticSettingsProps): DiagnosticSettings {
    return new DiagnosticSettings(this, "diagsettings", {
      name: props.name || "diag-settings",
      logAnalyticsWorkspaceId: props.logAnalyticsWorkspaceId,
      eventhubAuthorizationRuleId: props.eventhubAuthorizationRuleId,
      eventhubName: props.eventhubName,
      storageAccountId: props.storageAccountId,
      targetResourceId: this.id,
      logAnalyticsDestinationType: undefined,
    });
  }

  protected setupResourceGroup(props: any): ResourceGroup {
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
      resourceGroupName: this.resourceGroupName,
      scopes: [this.id],
    });
  }
}
