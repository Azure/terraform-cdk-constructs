import { Construct } from "constructs";
import { DiagnosticSettings, DiagnosticSettingsProps } from "./diagsettings";
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
  public addDiagSettings(
    props: Omit<DiagnosticSettingsProps, "targetResourceId">,
  ) {
    new DiagnosticSettings(this, "diagsettings", {
      name: props.name || "diag-settings",
      logAnalyticsWorkspaceId: props.logAnalyticsWorkspaceId,
      eventhubAuthorizationRuleId: props.eventhubAuthorizationRuleId,
      eventhubName: props.eventhubName,
      storageAccountId: props.storageAccountId,
      targetResourceId: this.id,
      logAnalyticsDestinationType: undefined,
    });
  }
}

export abstract class AzureResourceWithAlert extends AzureResource {
  public addQueryRuleAlert(
    props: Omit<queryalert.AzureQueryRuleAlertProps, "scopes">,
  ) {
    new queryalert.QueryRuleAlert(this, "queryrulealert", {
      ...props,
      scopes: [this.id],
    });
  }

  public addMetricAlert(
    props: Omit<metricalert.MetricAlertProps, "resourceGroupName" | "scopes">,
  ) {
    new metricalert.MetricAlert(this, "metricalert", {
      ...props,
      resourceGroupName: this.resourceGroupName,
      scopes: [this.id],
    });
  }
}
