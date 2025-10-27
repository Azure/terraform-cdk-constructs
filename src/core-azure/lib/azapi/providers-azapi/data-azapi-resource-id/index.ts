// https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_id
// generated from terraform resource schema

import * as cdktf from "cdktf";
import { Construct } from "constructs";

// Configuration

export interface DataAzapiResourceIdConfig
  extends cdktf.TerraformMetaArguments {
  /**
   * The name of the Azure resource.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_id#name DataAzapiResourceId#name}
   */
  readonly name?: string;
  /**
  * The ID of the azure resource in which this resource is created. It supports different kinds of deployment scope for **top level** resources:

  - resource group scope: `parent_id` should be the ID of a resource group, it's recommended to manage a resource group by azurerm_resource_group.
	- management group scope: `parent_id` should be the ID of a management group, it's recommended to manage a management group by azurerm_management_group.
	- extension scope: `parent_id` should be the ID of the resource you're adding the extension to.
	- subscription scope: `parent_id` should be like \x60/subscriptions/00000000-0000-0000-0000-000000000000\x60
	- tenant scope: `parent_id` should be /

  For child level resources, the `parent_id` should be the ID of its parent resource, for example, subnet resource's `parent_id` is the ID of the vnet.

  For type `Microsoft.Resources/resourceGroups`, the `parent_id` could be omitted, it defaults to subscription ID specified in provider or the default subscription (You could check the default subscription by azure cli command: `az account show`).
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_id#parent_id DataAzapiResourceId#parent_id}
  */
  readonly parentId?: string;
  /**
   * The ID of an existing Azure source.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_id#resource_id DataAzapiResourceId#resource_id}
   */
  readonly resourceId?: string;
  /**
   * In a format like `<resource-type>@<api-version>`. `<resource-type>` is the Azure resource type, for example, `Microsoft.Storage/storageAccounts`. `<api-version>` is version of the API used to manage this azure resource.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_id#type DataAzapiResourceId#type}
   */
  readonly type: string;
  /**
   * timeouts block
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_id#timeouts DataAzapiResourceId#timeouts}
   */
  readonly timeouts?: DataAzapiResourceIdTimeouts;
}
export interface DataAzapiResourceIdTimeouts {
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Read operations occur during any refresh or planning operation when refresh is enabled.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_id#read DataAzapiResourceId#read}
   */
  readonly read?: string;
}

export function dataAzapiResourceIdTimeoutsToTerraform(
  struct?: DataAzapiResourceIdTimeouts | cdktf.IResolvable,
): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) {
    return struct;
  }
  if (cdktf.isComplexElement(struct)) {
    throw new Error(
      "A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration",
    );
  }
  return {
    read: cdktf.stringToTerraform(struct!.read),
  };
}

export class DataAzapiResourceIdTimeoutsOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
   * @param terraformResource The parent resource
   * @param terraformAttribute The attribute on the parent resource this class is referencing
   */
  public constructor(
    terraformResource: cdktf.IInterpolatingParent,
    terraformAttribute: string,
  ) {
    super(terraformResource, terraformAttribute, false);
  }

  public get internalValue():
    | DataAzapiResourceIdTimeouts
    | cdktf.IResolvable
    | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._read !== undefined) {
      hasAnyValues = true;
      internalValueResult.read = this._read;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(
    value: DataAzapiResourceIdTimeouts | cdktf.IResolvable | undefined,
  ) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._read = undefined;
    } else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    } else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._read = value.read;
    }
  }

  // read - computed: false, optional: true, required: false
  private _read?: string;
  public get read() {
    return this.getStringAttribute("read");
  }
  public set read(value: string) {
    this._read = value;
  }
  public resetRead() {
    this._read = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get readInput() {
    return this._read;
  }
}

/**
 * Represents a {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_id azapi_resource_id}
 */
export class DataAzapiResourceId extends cdktf.TerraformDataSource {
  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "azapi_resource_id";

  // ===========
  // INITIALIZER
  // ===========

  /**
   * Create a new {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_id azapi_resource_id} Data Source
   *
   * @param scope The scope in which to define this construct
   * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
   * @param options DataAzapiResourceIdConfig
   */
  public constructor(
    scope: Construct,
    id: string,
    config: DataAzapiResourceIdConfig,
  ) {
    super(scope, id, {
      terraformResourceType: "azapi_resource_id",
      terraformGeneratorMetadata: {
        providerName: "azapi",
        providerVersion: "2.7.0",
        providerVersionConstraint: "~> 2.7.0",
      },
      provider: config.provider,
      dependsOn: config.dependsOn,
      count: config.count,
      lifecycle: config.lifecycle,
      provisioners: config.provisioners,
      connection: config.connection,
      forEach: config.forEach,
    });
    this._name = config.name;
    this._parentId = config.parentId;
    this._resourceId = config.resourceId;
    this._type = config.type;
    this._timeouts.internalValue = config.timeouts;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute("id");
  }

  // name - computed: true, optional: true, required: false
  private _name?: string;
  public get name() {
    return this.getStringAttribute("name");
  }
  public set name(value: string) {
    this._name = value;
  }
  public resetName() {
    this._name = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get nameInput() {
    return this._name;
  }

  // parent_id - computed: true, optional: true, required: false
  private _parentId?: string;
  public get parentId() {
    return this.getStringAttribute("parent_id");
  }
  public set parentId(value: string) {
    this._parentId = value;
  }
  public resetParentId() {
    this._parentId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get parentIdInput() {
    return this._parentId;
  }

  // parts - computed: true, optional: false, required: false
  private _parts = new cdktf.StringMap(this, "parts");
  public get parts() {
    return this._parts;
  }

  // provider_namespace - computed: true, optional: false, required: false
  public get providerNamespace() {
    return this.getStringAttribute("provider_namespace");
  }

  // resource_group_name - computed: true, optional: false, required: false
  public get resourceGroupName() {
    return this.getStringAttribute("resource_group_name");
  }

  // resource_id - computed: true, optional: true, required: false
  private _resourceId?: string;
  public get resourceId() {
    return this.getStringAttribute("resource_id");
  }
  public set resourceId(value: string) {
    this._resourceId = value;
  }
  public resetResourceId() {
    this._resourceId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get resourceIdInput() {
    return this._resourceId;
  }

  // subscription_id - computed: true, optional: false, required: false
  public get subscriptionId() {
    return this.getStringAttribute("subscription_id");
  }

  // type - computed: false, optional: false, required: true
  private _type?: string;
  public get type() {
    return this.getStringAttribute("type");
  }
  public set type(value: string) {
    this._type = value;
  }
  // Temporarily expose input value. Use with caution.
  public get typeInput() {
    return this._type;
  }

  // timeouts - computed: false, optional: true, required: false
  private _timeouts = new DataAzapiResourceIdTimeoutsOutputReference(
    this,
    "timeouts",
  );
  public get timeouts() {
    return this._timeouts;
  }
  public putTimeouts(value: DataAzapiResourceIdTimeouts) {
    this._timeouts.internalValue = value;
  }
  public resetTimeouts() {
    this._timeouts.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get timeoutsInput() {
    return this._timeouts.internalValue;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      name: cdktf.stringToTerraform(this._name),
      parent_id: cdktf.stringToTerraform(this._parentId),
      resource_id: cdktf.stringToTerraform(this._resourceId),
      type: cdktf.stringToTerraform(this._type),
      timeouts: dataAzapiResourceIdTimeoutsToTerraform(
        this._timeouts.internalValue,
      ),
    };
  }
}
