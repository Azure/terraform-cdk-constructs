import { Construct } from "constructs";
import { AzureRbac } from './rbac';
import { AzureDiagnosticSettings, AzureDiagnosticSettingsProps } from './diagsettings';


export class AzureResource extends Construct {
    public readonly id: string;


    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.id = id;


    }
    public addAccess(objectId: string, customRoleName: string) {
        new AzureRbac(this, objectId + customRoleName, {
          objectId: objectId,
          roleDefinitionName: customRoleName,
          scope: this.id,
        });
      }
    
      // Diag Settings Methods
      public addDiagSettings(props: Omit<AzureDiagnosticSettingsProps, 'targetResourceId'>) {
        new AzureDiagnosticSettings(this, 'diagsettings', {
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
