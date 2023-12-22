import { Construct } from "constructs";
import { Rbac } from './rbac';
import { DiagnosticSettings, DiagnosticSettingsProps } from './diagsettings';
import * as queryalert from "../../azure-queryrulealert";


export class AzureResource extends Construct {
    public readonly id: string;


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
      public addDiagSettings(props: Omit<DiagnosticSettingsProps, 'targetResourceId'>) {
        new DiagnosticSettings(this, 'diagsettings', {
          name: props.name || `diag-settings`,
          logAnalyticsWorkspaceId: props.logAnalyticsWorkspaceId,
          eventhubAuthorizationRuleId: props.eventhubAuthorizationRuleId,
          eventhubName: props.eventhubName,
          storageAccountId: props.storageAccountId,
          targetResourceId: this.id,
          logAnalyticsDestinationType: undefined,
        });
      }
}

export class AzureResourceWithAlert extends AzureResource {
  public readonly id: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.id = id;
  }

  public addQueryRuleAlert(props: Omit<queryalert.AzureQueryRuleAlertProps, 'scopes'>) {
    new queryalert.QueryRuleAlert(this, 'queryrulealert', {
      ...props,
      scopes: [this.id],
    });
  }
}