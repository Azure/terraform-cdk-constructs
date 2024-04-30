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
   * Manages Role-Based Access Control (RBAC) assignments within Azure.
   *
   * This class is responsible for creating and managing RBAC role assignments in Azure, which control permissions for Azure AD
   * identities to manage Azure resources. It supports assigning roles at different scopes such as subscriptions, resource groups,
   * or specific resources.
   *
   * @param scope - The scope in which to define this construct, typically representing the Cloud Development Kit (CDK) stack.
   * @param id - The unique identifier for this instance of the RBAC assignment.
   * @param props - Configuration properties for the RBAC assignment. These properties include:
   *                - `objectId`: The Azure AD object ID for the user, group, or service principal to which the role is assigned.
   *                - `roleDefinitionUUID`: Optional. The UUID of the Azure RBAC role definition. This can be obtained via Azure CLI.
   *                - `roleDefinitionName`: The name of the role to be assigned, such as 'Contributor', 'Reader', or 'Owner'.
   *                - `scope`: The scope at which the role is assigned, which could be a subscription, resource group, or specific resource.
   *
   * Example usage:
   * ```typescript
   * const rbac = new Rbac(this, 'rbacAssignment', {
   *   objectId: 'user-or-group-object-id',
   *   roleDefinitionName: 'Contributor',
   *   scope: '/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}'
   * });
   * ```
   * This RBAC instance assigns the 'Contributor' role to a user or group specified by 'objectId' at the scope of a specific resource group.
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
