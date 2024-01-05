import { RoleAssignment } from "@cdktf/provider-azurerm/lib/role-assignment";
import { Construct } from "constructs";

export interface RbacProps {
  /**
   * The unique identifier for objects in Azure AD, such as users, groups, or service principals.
   */
  readonly objectId: string;

  /**
   * The universally unique identifier (UUID) for the Azure RBAC role definition.
   * To find the UUID for a role using Azure CLI, use the command:
   * `az role definition list --name "Role Name" --query "[].name" -o tsv`
   */
  readonly roleDefinitionUUID?: string;

  /**
   * The human-readable name of the Azure RBAC role, e.g., "Virtual Machine Contributor".
   */
  readonly roleDefinitionName: string;

  /**
   * The scope at which the RBAC role assignment is applied.
   * This could be a subscription, resource group, or a specific resource.
   */
  readonly scope: string;
}

export class Rbac extends Construct {
  /**
   * Constructs a new instance of the AzureRbac class.
   *
   * @param scope - The scope in which this construct is defined.
   * @param id - The ID of this construct.
   * @param props - The properties required for Azure RBAC.
   */
  constructor(scope: Construct, id: string, props: RbacProps) {
    super(scope, id);

    // Create a new role assignment using the provided properties.
    new RoleAssignment(this, "role", {
      name: props.roleDefinitionUUID,
      principalId: props.objectId,
      roleDefinitionName: props.roleDefinitionName,
      scope: props.scope,
    });
  }
}
