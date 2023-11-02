import { Construct } from 'constructs';
import { RoleAssignment } from "@cdktf/provider-azurerm/lib/role-assignment";


export interface AzureRbacProps {
    /**
     * The unique identifier for objects in Azure AD, such as users, groups, or service principals.
     */
    objectId: string;

    /**
     * The universally unique identifier (UUID) for the Azure RBAC role definition.
     * To find the UUID for a role using Azure CLI, use the command:
     * `az role definition list --name "Role Name" --query "[].name" -o tsv`
     */
    roleDefinitionUUID?: string;

    /**
     * The human-readable name of the Azure RBAC role, e.g., "Virtual Machine Contributor".
     */
    roleDefinitionName: string;

    /**
     * The scope at which the RBAC role assignment is applied. 
     * This could be a subscription, resource group, or a specific resource.
     */
    scope: string;
}

export class AzureRbac extends Construct {

    /**
     * Constructs a new instance of the AzureRbac class.
     * 
     * @param scope - The scope in which this construct is defined.
     * @param id - The ID of this construct.
     * @param props - The properties required for Azure RBAC.
     */
    constructor(scope: Construct, id: string, props: AzureRbacProps) {
        super(scope, id);
  
        // Create a new role assignment using the provided properties.
        new RoleAssignment(this, "role", {
            name: props.roleDefinitionUUID,
            principalId: props.objectId,
            roleDefinitionName: props.roleDefinitionName,
            scope: props.scope,
          });
    };
}