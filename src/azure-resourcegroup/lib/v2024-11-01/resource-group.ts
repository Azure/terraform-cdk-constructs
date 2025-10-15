import * as cdktf from "cdktf";
import { Construct } from "constructs";
import { GroupProps, GroupBody } from "./props";
import { AzapiResource } from "../../../core-azure/lib";
import { DataAzapiClientConfig } from "../../../core-azure/lib/providers-azapi/data-azapi-client-config";

/**
 * Azure Resource Group using AZAPI provider with API version 2024-11-01
 *
 * This class provides direct access to the Azure REST API for Resource Groups,
 * offering more control and faster access to new Azure features compared to the AzureRM provider.
 */
export class Group extends AzapiResource {
  // Required abstract properties from AzapiResource
  protected readonly resourceType = "Microsoft.Resources/resourceGroups";
  protected readonly apiVersion = "2024-11-01";

  public readonly props: GroupProps;

  // Output properties for easy access
  public readonly idOutput: cdktf.TerraformOutput;
  public readonly locationOutput: cdktf.TerraformOutput;
  public readonly nameOutput: cdktf.TerraformOutput;
  public readonly tagsOutput: cdktf.TerraformOutput;

  // Public properties that match the original ResourceGroup interface
  public readonly id: string;
  public readonly tags: { [key: string]: string };

  /**
   * Creates an Azure Resource Group using AZAPI provider with API version 2024-11-01
   *
   * @param scope - The scope in which to define this construct
   * @param id - The unique identifier for this instance
   * @param props - Configuration properties for the Resource Group
   */
  constructor(scope: Construct, id: string, props: GroupProps) {
    super(scope, id, {
      name: props.name,
      location: props.location,
      tags: props.tags,
    });

    this.props = props;

    // Set defaults
    const defaults = {
      name: props.name || `rg-${this.node.path.split("/")[0]}`,
    };

    // The resourceBody represents the JSON payload sent to Azure REST API
    // This must match the Azure API schema for Resource Groups API version 2024-11-01
    // See: https://docs.microsoft.com/en-us/rest/api/resources/resource-groups/create-or-update
    const resourceBody: GroupBody = {
      location: props.location, // Required: Azure region where RG will be created
      tags: props.tags || {}, // Optional: Key-value pairs for resource tagging
      managedBy: props.managedBy, // Optional: ID of resource that manages this RG
    };

    // Create the AZAPI resource
    // Unlike AzureRM provider, AZAPI requires us to specify:
    // 1. The exact Azure resource type with API version
    // 2. The resource name
    // 3. The JSON body that matches Azure's REST API schema
    // 4. The parent ID (for resource groups, this is the subscription)

    // For resource groups, the parent ID should be the subscription
    // Use AZAPI data source to get the current subscription ID
    const clientConfig = new DataAzapiClientConfig(this, "client_config", {});
    const subscriptionId = `/subscriptions/\${${clientConfig.fqn}.subscription_id}`;

    this.terraformResource = this.createAzapiResource(
      resourceBody, // properties object
      subscriptionId, // parent ID (subscription for resource groups)
      defaults.name, // resource name
      props.location, // location (optional since it's in resourceBody)
    );

    // Apply ignore changes if specified
    if (props.ignoreChanges && props.ignoreChanges.length > 0) {
      // Filter out properties that are not valid for AZAPI resource ignore_changes
      // managedBy should be in the resource body, not in ignore_changes
      const validIgnoreChanges = props.ignoreChanges.filter(
        (change) => change !== "managedBy",
      );

      if (validIgnoreChanges.length > 0) {
        this.terraformResource.addOverride("lifecycle", [
          {
            ignore_changes: validIgnoreChanges,
          },
        ]);
      }
    }

    // Extract properties from the AZAPI resource outputs using Terraform interpolation
    // These reference the actual deployed resource's attributes
    this.id = `\${${this.terraformResource.fqn}.id}`;
    this.tags = props.tags || {};

    // Create Terraform outputs for easy access and referencing from other resources
    this.idOutput = new cdktf.TerraformOutput(this, "id", {
      value: this.id,
      description: "The ID of the Resource Group",
    });

    this.locationOutput = new cdktf.TerraformOutput(this, "location", {
      value: `\${${this.terraformResource.fqn}.location}`,
      description: "The location of the Resource Group",
    });

    this.nameOutput = new cdktf.TerraformOutput(this, "name", {
      value: `\${${this.terraformResource.fqn}.name}`,
      description: "The name of the Resource Group",
    });

    this.tagsOutput = new cdktf.TerraformOutput(this, "tags", {
      value: `\${${this.terraformResource.fqn}.tags}`,
      description: "The tags assigned to the Resource Group",
    });

    // Override logical IDs to match original naming convention
    this.idOutput.overrideLogicalId("id");
    this.locationOutput.overrideLogicalId("location");
    this.nameOutput.overrideLogicalId("name");
    this.tagsOutput.overrideLogicalId("tags");
  }

  /**
   * Get the subscription ID from the Resource Group ID
   */
  public get subscriptionId(): string {
    const idParts = this.id.split("/");
    const subscriptionIndex = idParts.indexOf("subscriptions");
    if (subscriptionIndex !== -1 && subscriptionIndex + 1 < idParts.length) {
      return idParts[subscriptionIndex + 1];
    }
    throw new Error("Unable to extract subscription ID from Resource Group ID");
  }

  /**
   * Get the full resource identifier for use in other Azure resources
   */
  public get resourceId(): string {
    return this.id;
  }

  /**
   * Add a tag to the Resource Group
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public addTag(key: string, value: string): void {
    if (!this.props.tags) {
      (this.props as any).tags = {};
    }
    this.props.tags![key] = value;
  }

  /**
   * Remove a tag from the Resource Group
   * Note: This modifies the construct props but requires a new deployment to take effect
   */
  public removeTag(key: string): void {
    if (this.props.tags && this.props.tags[key]) {
      delete this.props.tags[key];
    }
  }
}
