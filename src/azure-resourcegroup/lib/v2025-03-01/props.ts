/**
 * Properties for Azure Resource Group using AZAPI provider with API version 2025-03-01
 */
export interface GroupProps {
  /**
   * The Azure Region where the Resource Group will be created.
   * @example "eastus", "westus2", "centralus"
   */
  readonly location: string;

  /**
   * The name of the Azure Resource Group.
   * Must be unique within your Azure subscription.
   * @example "rg-myapp-prod"
   */
  readonly name?: string;

  /**
   * A dictionary of tags to apply to the Resource Group for organizational, billing, or other purposes.
   * @example { environment: "production", project: "myapp" }
   */
  readonly tags?: { [key: string]: string };

  /**
   * Managed by information for the resource group.
   * Indicates what service or tool is managing this resource group.
   */
  readonly managedBy?: string;

  /**
   * The lifecycle rules to ignore changes.
   * Useful for properties that are externally managed or should not trigger updates.
   * @example ["tags", "managedBy"]
   */
  readonly ignoreChanges?: string[];
}

/**
 * The body/properties schema for Resource Group API version 2025-03-01
 * This matches the Azure REST API schema for resource groups
 */
export interface GroupBody {
  /**
   * The location of the resource group. Cannot be changed after creation.
   */
  readonly location: string;

  /**
   * The tags attached to the resource group.
   */
  readonly tags?: { [key: string]: string };

  /**
   * The ID of the resource that manages this resource group.
   */
  readonly managedBy?: string;

  /**
   * The provisioning state of the resource group.
   */
  readonly provisioningState?: string;
}
