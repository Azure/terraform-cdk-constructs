// https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface UpdateResourceConfig extends cdktf.TerraformMetaArguments {
  /**
  * A dynamic attribute that contains the request body.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#body UpdateResource#body}
  */
  readonly body?: { [key: string]: any };
  /**
  * Whether ignore the casing of the property names in the response body. Defaults to `false`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#ignore_casing UpdateResource#ignore_casing}
  */
  readonly ignoreCasing?: boolean | cdktf.IResolvable;
  /**
  * Whether ignore not returned properties like credentials in `body` to suppress plan-diff. Defaults to `true`. It's recommend to enable this option when some sensitive properties are not returned in response body, instead of setting them in `lifecycle.ignore_changes` because it will make the sensitive fields unable to update.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#ignore_missing_property UpdateResource#ignore_missing_property}
  */
  readonly ignoreMissingProperty?: boolean | cdktf.IResolvable;
  /**
  * A list of ARM resource IDs which are used to avoid create/modify/delete azapi resources at the same time.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#locks UpdateResource#locks}
  */
  readonly locks?: string[];
  /**
  * Specifies the name of the Azure resource. Changing this forces a new resource to be created.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#name UpdateResource#name}
  */
  readonly name?: string;
  /**
  * The ID of the azure resource in which this resource is created. It supports different kinds of deployment scope for **top level** resources:
  * 
  *   - resource group scope: `parent_id` should be the ID of a resource group, it's recommended to manage a resource group by azurerm_resource_group.
  * 	- management group scope: `parent_id` should be the ID of a management group, it's recommended to manage a management group by azurerm_management_group.
  * 	- extension scope: `parent_id` should be the ID of the resource you're adding the extension to.
  * 	- subscription scope: `parent_id` should be like \x60/subscriptions/00000000-0000-0000-0000-000000000000\x60
  * 	- tenant scope: `parent_id` should be /
  * 
  *   For child level resources, the `parent_id` should be the ID of its parent resource, for example, subnet resource's `parent_id` is the ID of the vnet.
  * 
  *   For type `Microsoft.Resources/resourceGroups`, the `parent_id` could be omitted, it defaults to subscription ID specified in provider or the default subscription (You could check the default subscription by azure cli command: `az account show`).
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#parent_id UpdateResource#parent_id}
  */
  readonly parentId?: string;
  /**
  * A mapping of headers to be sent with the read request.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#read_headers UpdateResource#read_headers}
  */
  readonly readHeaders?: { [key: string]: string };
  /**
  * A mapping of query parameters to be sent with the read request.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#read_query_parameters UpdateResource#read_query_parameters}
  */
  readonly readQueryParameters?: { [key: string]: string[] } | cdktf.IResolvable;
  /**
  * The ID of an existing Azure source.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#resource_id UpdateResource#resource_id}
  */
  readonly resourceId?: string;
  /**
  * The attribute can accept either a list or a map.
  * 
  * - **List**: A list of paths that need to be exported from the response body. Setting it to `["*"]` will export the full response body. Here's an example. If it sets to `["properties.loginServer", "properties.policies.quarantinePolicy.status"]`, it will set the following HCL object to the computed property output.
  * 
  * 	```text
  * 	{
  * 		properties = {
  * 			loginServer = "registry1.azurecr.io"
  * 			policies = {
  * 				quarantinePolicy = {
  * 					status = "disabled"
  * 				}
  * 			}
  * 		}
  * 	}
  * 	```
  * 
  * - **Map**: A map where the key is the name for the result and the value is a JMESPath query string to filter the response. Here's an example. If it sets to `{"login_server": "properties.loginServer", "quarantine_status": "properties.policies.quarantinePolicy.status"}`, it will set the following HCL object to the computed property output.
  * 
  * 	```text
  * 	{
  * 		"login_server" = "registry1.azurecr.io"
  * 		"quarantine_status" = "disabled"
  * 	}
  * 	```
  * 
  * To learn more about JMESPath, visit [JMESPath](https://jmespath.org/).
  * 
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#response_export_values UpdateResource#response_export_values}
  */
  readonly responseExportValues?: { [key: string]: any };
  /**
  * The retry object supports the following attributes:
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#retry UpdateResource#retry}
  */
  readonly retry?: UpdateResourceRetry;
  /**
  * A dynamic attribute that contains the write-only properties of the request body. This will be merge-patched to the body to construct the actual request body.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#sensitive_body UpdateResource#sensitive_body}
  */
  readonly sensitiveBody?: { [key: string]: any };
  /**
  * A map where the key is the path to the property in `sensitive_body` and the value is the version of the property. The key is a string in the format of `path.to.property[index].subproperty`, where `index` is the index of the item in an array. When the version is changed, the property will be included in the request body, otherwise it will be omitted from the request body. 
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#sensitive_body_version UpdateResource#sensitive_body_version}
  */
  readonly sensitiveBodyVersion?: { [key: string]: string };
  /**
  * In a format like `<resource-type>@<api-version>`. `<resource-type>` is the Azure resource type, for example, `Microsoft.Storage/storageAccounts`. `<api-version>` is version of the API used to manage this azure resource.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#type UpdateResource#type}
  */
  readonly type: string;
  /**
  * A mapping of headers to be sent with the update request.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#update_headers UpdateResource#update_headers}
  */
  readonly updateHeaders?: { [key: string]: string };
  /**
  * A mapping of query parameters to be sent with the update request.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#update_query_parameters UpdateResource#update_query_parameters}
  */
  readonly updateQueryParameters?: { [key: string]: string[] } | cdktf.IResolvable;
  /**
  * timeouts block
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#timeouts UpdateResource#timeouts}
  */
  readonly timeouts?: UpdateResourceTimeouts;
}
export interface UpdateResourceRetry {
  /**
  * A list of regular expressions to match against error messages. If any of the regular expressions match, the request will be retried.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#error_message_regex UpdateResource#error_message_regex}
  */
  readonly errorMessageRegex: string[];
  /**
  * The base number of seconds to wait between retries. Default is `10`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#interval_seconds UpdateResource#interval_seconds}
  */
  readonly intervalSeconds?: number;
  /**
  * The maximum number of seconds to wait between retries. Default is `180`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#max_interval_seconds UpdateResource#max_interval_seconds}
  */
  readonly maxIntervalSeconds?: number;
  /**
  * The multiplier to apply to the interval between retries. Default is `1.5`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#multiplier UpdateResource#multiplier}
  */
  readonly multiplier?: number;
  /**
  * The randomization factor to apply to the interval between retries. The formula for the randomized interval is: `RetryInterval * (random value in range [1 - RandomizationFactor, 1 + RandomizationFactor])`. Therefore set to zero `0.0` for no randomization. Default is `0.5`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#randomization_factor UpdateResource#randomization_factor}
  */
  readonly randomizationFactor?: number;
}

export function updateResourceRetryToTerraform(struct?: UpdateResourceRetry | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    error_message_regex: cdktf.listMapper(cdktf.stringToTerraform, false)(struct!.errorMessageRegex),
    interval_seconds: cdktf.numberToTerraform(struct!.intervalSeconds),
    max_interval_seconds: cdktf.numberToTerraform(struct!.maxIntervalSeconds),
    multiplier: cdktf.numberToTerraform(struct!.multiplier),
    randomization_factor: cdktf.numberToTerraform(struct!.randomizationFactor),
  }
}


export function updateResourceRetryToHclTerraform(struct?: UpdateResourceRetry | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    error_message_regex: {
      value: cdktf.listMapperHcl(cdktf.stringToHclTerraform, false)(struct!.errorMessageRegex),
      isBlock: false,
      type: "list",
      storageClassType: "stringList",
    },
    interval_seconds: {
      value: cdktf.numberToHclTerraform(struct!.intervalSeconds),
      isBlock: false,
      type: "simple",
      storageClassType: "number",
    },
    max_interval_seconds: {
      value: cdktf.numberToHclTerraform(struct!.maxIntervalSeconds),
      isBlock: false,
      type: "simple",
      storageClassType: "number",
    },
    multiplier: {
      value: cdktf.numberToHclTerraform(struct!.multiplier),
      isBlock: false,
      type: "simple",
      storageClassType: "number",
    },
    randomization_factor: {
      value: cdktf.numberToHclTerraform(struct!.randomizationFactor),
      isBlock: false,
      type: "simple",
      storageClassType: "number",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class UpdateResourceRetryOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false);
  }

  public get internalValue(): UpdateResourceRetry | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._errorMessageRegex !== undefined) {
      hasAnyValues = true;
      internalValueResult.errorMessageRegex = this._errorMessageRegex;
    }
    if (this._intervalSeconds !== undefined) {
      hasAnyValues = true;
      internalValueResult.intervalSeconds = this._intervalSeconds;
    }
    if (this._maxIntervalSeconds !== undefined) {
      hasAnyValues = true;
      internalValueResult.maxIntervalSeconds = this._maxIntervalSeconds;
    }
    if (this._multiplier !== undefined) {
      hasAnyValues = true;
      internalValueResult.multiplier = this._multiplier;
    }
    if (this._randomizationFactor !== undefined) {
      hasAnyValues = true;
      internalValueResult.randomizationFactor = this._randomizationFactor;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: UpdateResourceRetry | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._errorMessageRegex = undefined;
      this._intervalSeconds = undefined;
      this._maxIntervalSeconds = undefined;
      this._multiplier = undefined;
      this._randomizationFactor = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._errorMessageRegex = value.errorMessageRegex;
      this._intervalSeconds = value.intervalSeconds;
      this._maxIntervalSeconds = value.maxIntervalSeconds;
      this._multiplier = value.multiplier;
      this._randomizationFactor = value.randomizationFactor;
    }
  }

  // error_message_regex - computed: false, optional: false, required: true
  private _errorMessageRegex?: string[]; 
  public get errorMessageRegex() {
    return this.getListAttribute('error_message_regex');
  }
  public set errorMessageRegex(value: string[]) {
    this._errorMessageRegex = value;
  }
  // Temporarily expose input value. Use with caution.
  public get errorMessageRegexInput() {
    return this._errorMessageRegex;
  }

  // interval_seconds - computed: true, optional: true, required: false
  private _intervalSeconds?: number; 
  public get intervalSeconds() {
    return this.getNumberAttribute('interval_seconds');
  }
  public set intervalSeconds(value: number) {
    this._intervalSeconds = value;
  }
  public resetIntervalSeconds() {
    this._intervalSeconds = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get intervalSecondsInput() {
    return this._intervalSeconds;
  }

  // max_interval_seconds - computed: true, optional: true, required: false
  private _maxIntervalSeconds?: number; 
  public get maxIntervalSeconds() {
    return this.getNumberAttribute('max_interval_seconds');
  }
  public set maxIntervalSeconds(value: number) {
    this._maxIntervalSeconds = value;
  }
  public resetMaxIntervalSeconds() {
    this._maxIntervalSeconds = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get maxIntervalSecondsInput() {
    return this._maxIntervalSeconds;
  }

  // multiplier - computed: true, optional: true, required: false
  private _multiplier?: number; 
  public get multiplier() {
    return this.getNumberAttribute('multiplier');
  }
  public set multiplier(value: number) {
    this._multiplier = value;
  }
  public resetMultiplier() {
    this._multiplier = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get multiplierInput() {
    return this._multiplier;
  }

  // randomization_factor - computed: true, optional: true, required: false
  private _randomizationFactor?: number; 
  public get randomizationFactor() {
    return this.getNumberAttribute('randomization_factor');
  }
  public set randomizationFactor(value: number) {
    this._randomizationFactor = value;
  }
  public resetRandomizationFactor() {
    this._randomizationFactor = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get randomizationFactorInput() {
    return this._randomizationFactor;
  }
}
export interface UpdateResourceTimeouts {
  /**
  * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours).
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#create UpdateResource#create}
  */
  readonly create?: string;
  /**
  * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Setting a timeout for a Delete operation is only applicable if changes are saved into state before the destroy operation occurs.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#delete UpdateResource#delete}
  */
  readonly delete?: string;
  /**
  * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Read operations occur during any refresh or planning operation when refresh is enabled.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#read UpdateResource#read}
  */
  readonly read?: string;
  /**
  * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours).
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#update UpdateResource#update}
  */
  readonly update?: string;
}

export function updateResourceTimeoutsToTerraform(struct?: UpdateResourceTimeouts | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    create: cdktf.stringToTerraform(struct!.create),
    delete: cdktf.stringToTerraform(struct!.delete),
    read: cdktf.stringToTerraform(struct!.read),
    update: cdktf.stringToTerraform(struct!.update),
  }
}


export function updateResourceTimeoutsToHclTerraform(struct?: UpdateResourceTimeouts | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    create: {
      value: cdktf.stringToHclTerraform(struct!.create),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    delete: {
      value: cdktf.stringToHclTerraform(struct!.delete),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    read: {
      value: cdktf.stringToHclTerraform(struct!.read),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    update: {
      value: cdktf.stringToHclTerraform(struct!.update),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class UpdateResourceTimeoutsOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false);
  }

  public get internalValue(): UpdateResourceTimeouts | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._create !== undefined) {
      hasAnyValues = true;
      internalValueResult.create = this._create;
    }
    if (this._delete !== undefined) {
      hasAnyValues = true;
      internalValueResult.delete = this._delete;
    }
    if (this._read !== undefined) {
      hasAnyValues = true;
      internalValueResult.read = this._read;
    }
    if (this._update !== undefined) {
      hasAnyValues = true;
      internalValueResult.update = this._update;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: UpdateResourceTimeouts | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._create = undefined;
      this._delete = undefined;
      this._read = undefined;
      this._update = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._create = value.create;
      this._delete = value.delete;
      this._read = value.read;
      this._update = value.update;
    }
  }

  // create - computed: false, optional: true, required: false
  private _create?: string; 
  public get create() {
    return this.getStringAttribute('create');
  }
  public set create(value: string) {
    this._create = value;
  }
  public resetCreate() {
    this._create = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get createInput() {
    return this._create;
  }

  // delete - computed: false, optional: true, required: false
  private _delete?: string; 
  public get delete() {
    return this.getStringAttribute('delete');
  }
  public set delete(value: string) {
    this._delete = value;
  }
  public resetDelete() {
    this._delete = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get deleteInput() {
    return this._delete;
  }

  // read - computed: false, optional: true, required: false
  private _read?: string; 
  public get read() {
    return this.getStringAttribute('read');
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

  // update - computed: false, optional: true, required: false
  private _update?: string; 
  public get update() {
    return this.getStringAttribute('update');
  }
  public set update(value: string) {
    this._update = value;
  }
  public resetUpdate() {
    this._update = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get updateInput() {
    return this._update;
  }
}

/**
* Represents a {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource azapi_update_resource}
*/
export class UpdateResource extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "azapi_update_resource";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a UpdateResource resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the UpdateResource to import
  * @param importFromId The id of the existing UpdateResource that should be imported. Refer to the {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the UpdateResource to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "azapi_update_resource", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/update_resource azapi_update_resource} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options UpdateResourceConfig
  */
  public constructor(scope: Construct, id: string, config: UpdateResourceConfig) {
    super(scope, id, {
      terraformResourceType: 'azapi_update_resource',
      terraformGeneratorMetadata: {
        providerName: 'azapi',
        providerVersion: '2.7.0',
        providerVersionConstraint: '~> 2.7.0'
      },
      provider: config.provider,
      dependsOn: config.dependsOn,
      count: config.count,
      lifecycle: config.lifecycle,
      provisioners: config.provisioners,
      connection: config.connection,
      forEach: config.forEach
    });
    this._body = config.body;
    this._ignoreCasing = config.ignoreCasing;
    this._ignoreMissingProperty = config.ignoreMissingProperty;
    this._locks = config.locks;
    this._name = config.name;
    this._parentId = config.parentId;
    this._readHeaders = config.readHeaders;
    this._readQueryParameters = config.readQueryParameters;
    this._resourceId = config.resourceId;
    this._responseExportValues = config.responseExportValues;
    this._retry.internalValue = config.retry;
    this._sensitiveBody = config.sensitiveBody;
    this._sensitiveBodyVersion = config.sensitiveBodyVersion;
    this._type = config.type;
    this._updateHeaders = config.updateHeaders;
    this._updateQueryParameters = config.updateQueryParameters;
    this._timeouts.internalValue = config.timeouts;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // body - computed: false, optional: true, required: false
  private _body?: { [key: string]: any }; 
  public get body() {
    return this.getAnyMapAttribute('body');
  }
  public set body(value: { [key: string]: any }) {
    this._body = value;
  }
  public resetBody() {
    this._body = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get bodyInput() {
    return this._body;
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute('id');
  }

  // ignore_casing - computed: true, optional: true, required: false
  private _ignoreCasing?: boolean | cdktf.IResolvable; 
  public get ignoreCasing() {
    return this.getBooleanAttribute('ignore_casing');
  }
  public set ignoreCasing(value: boolean | cdktf.IResolvable) {
    this._ignoreCasing = value;
  }
  public resetIgnoreCasing() {
    this._ignoreCasing = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get ignoreCasingInput() {
    return this._ignoreCasing;
  }

  // ignore_missing_property - computed: true, optional: true, required: false
  private _ignoreMissingProperty?: boolean | cdktf.IResolvable; 
  public get ignoreMissingProperty() {
    return this.getBooleanAttribute('ignore_missing_property');
  }
  public set ignoreMissingProperty(value: boolean | cdktf.IResolvable) {
    this._ignoreMissingProperty = value;
  }
  public resetIgnoreMissingProperty() {
    this._ignoreMissingProperty = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get ignoreMissingPropertyInput() {
    return this._ignoreMissingProperty;
  }

  // locks - computed: false, optional: true, required: false
  private _locks?: string[]; 
  public get locks() {
    return this.getListAttribute('locks');
  }
  public set locks(value: string[]) {
    this._locks = value;
  }
  public resetLocks() {
    this._locks = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get locksInput() {
    return this._locks;
  }

  // name - computed: true, optional: true, required: false
  private _name?: string; 
  public get name() {
    return this.getStringAttribute('name');
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

  // output - computed: true, optional: false, required: false
  private _output = new cdktf.AnyMap(this, "output");
  public get output() {
    return this._output;
  }

  // parent_id - computed: true, optional: true, required: false
  private _parentId?: string; 
  public get parentId() {
    return this.getStringAttribute('parent_id');
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

  // read_headers - computed: false, optional: true, required: false
  private _readHeaders?: { [key: string]: string }; 
  public get readHeaders() {
    return this.getStringMapAttribute('read_headers');
  }
  public set readHeaders(value: { [key: string]: string }) {
    this._readHeaders = value;
  }
  public resetReadHeaders() {
    this._readHeaders = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get readHeadersInput() {
    return this._readHeaders;
  }

  // read_query_parameters - computed: false, optional: true, required: false
  private _readQueryParameters?: { [key: string]: string[] } | cdktf.IResolvable; 
  public get readQueryParameters() {
    return this.interpolationForAttribute('read_query_parameters');
  }
  public set readQueryParameters(value: { [key: string]: string[] } | cdktf.IResolvable) {
    this._readQueryParameters = value;
  }
  public resetReadQueryParameters() {
    this._readQueryParameters = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get readQueryParametersInput() {
    return this._readQueryParameters;
  }

  // resource_id - computed: true, optional: true, required: false
  private _resourceId?: string; 
  public get resourceId() {
    return this.getStringAttribute('resource_id');
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

  // response_export_values - computed: false, optional: true, required: false
  private _responseExportValues?: { [key: string]: any }; 
  public get responseExportValues() {
    return this.getAnyMapAttribute('response_export_values');
  }
  public set responseExportValues(value: { [key: string]: any }) {
    this._responseExportValues = value;
  }
  public resetResponseExportValues() {
    this._responseExportValues = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get responseExportValuesInput() {
    return this._responseExportValues;
  }

  // retry - computed: false, optional: true, required: false
  private _retry = new UpdateResourceRetryOutputReference(this, "retry");
  public get retry() {
    return this._retry;
  }
  public putRetry(value: UpdateResourceRetry) {
    this._retry.internalValue = value;
  }
  public resetRetry() {
    this._retry.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get retryInput() {
    return this._retry.internalValue;
  }

  // sensitive_body - computed: false, optional: true, required: false
  private _sensitiveBody?: { [key: string]: any }; 
  public get sensitiveBody() {
    return this.getAnyMapAttribute('sensitive_body');
  }
  public set sensitiveBody(value: { [key: string]: any }) {
    this._sensitiveBody = value;
  }
  public resetSensitiveBody() {
    this._sensitiveBody = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get sensitiveBodyInput() {
    return this._sensitiveBody;
  }

  // sensitive_body_version - computed: false, optional: true, required: false
  private _sensitiveBodyVersion?: { [key: string]: string }; 
  public get sensitiveBodyVersion() {
    return this.getStringMapAttribute('sensitive_body_version');
  }
  public set sensitiveBodyVersion(value: { [key: string]: string }) {
    this._sensitiveBodyVersion = value;
  }
  public resetSensitiveBodyVersion() {
    this._sensitiveBodyVersion = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get sensitiveBodyVersionInput() {
    return this._sensitiveBodyVersion;
  }

  // type - computed: false, optional: false, required: true
  private _type?: string; 
  public get type() {
    return this.getStringAttribute('type');
  }
  public set type(value: string) {
    this._type = value;
  }
  // Temporarily expose input value. Use with caution.
  public get typeInput() {
    return this._type;
  }

  // update_headers - computed: false, optional: true, required: false
  private _updateHeaders?: { [key: string]: string }; 
  public get updateHeaders() {
    return this.getStringMapAttribute('update_headers');
  }
  public set updateHeaders(value: { [key: string]: string }) {
    this._updateHeaders = value;
  }
  public resetUpdateHeaders() {
    this._updateHeaders = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get updateHeadersInput() {
    return this._updateHeaders;
  }

  // update_query_parameters - computed: false, optional: true, required: false
  private _updateQueryParameters?: { [key: string]: string[] } | cdktf.IResolvable; 
  public get updateQueryParameters() {
    return this.interpolationForAttribute('update_query_parameters');
  }
  public set updateQueryParameters(value: { [key: string]: string[] } | cdktf.IResolvable) {
    this._updateQueryParameters = value;
  }
  public resetUpdateQueryParameters() {
    this._updateQueryParameters = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get updateQueryParametersInput() {
    return this._updateQueryParameters;
  }

  // timeouts - computed: false, optional: true, required: false
  private _timeouts = new UpdateResourceTimeoutsOutputReference(this, "timeouts");
  public get timeouts() {
    return this._timeouts;
  }
  public putTimeouts(value: UpdateResourceTimeouts) {
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
      body: cdktf.hashMapper(cdktf.anyToTerraform)(this._body),
      ignore_casing: cdktf.booleanToTerraform(this._ignoreCasing),
      ignore_missing_property: cdktf.booleanToTerraform(this._ignoreMissingProperty),
      locks: cdktf.listMapper(cdktf.stringToTerraform, false)(this._locks),
      name: cdktf.stringToTerraform(this._name),
      parent_id: cdktf.stringToTerraform(this._parentId),
      read_headers: cdktf.hashMapper(cdktf.stringToTerraform)(this._readHeaders),
      read_query_parameters: cdktf.hashMapper(cdktf.listMapper(cdktf.stringToTerraform, false))(this._readQueryParameters),
      resource_id: cdktf.stringToTerraform(this._resourceId),
      response_export_values: cdktf.hashMapper(cdktf.anyToTerraform)(this._responseExportValues),
      retry: updateResourceRetryToTerraform(this._retry.internalValue),
      sensitive_body: cdktf.hashMapper(cdktf.anyToTerraform)(this._sensitiveBody),
      sensitive_body_version: cdktf.hashMapper(cdktf.stringToTerraform)(this._sensitiveBodyVersion),
      type: cdktf.stringToTerraform(this._type),
      update_headers: cdktf.hashMapper(cdktf.stringToTerraform)(this._updateHeaders),
      update_query_parameters: cdktf.hashMapper(cdktf.listMapper(cdktf.stringToTerraform, false))(this._updateQueryParameters),
      timeouts: updateResourceTimeoutsToTerraform(this._timeouts.internalValue),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      body: {
        value: cdktf.hashMapperHcl(cdktf.anyToHclTerraform)(this._body),
        isBlock: false,
        type: "map",
        storageClassType: "anyMap",
      },
      ignore_casing: {
        value: cdktf.booleanToHclTerraform(this._ignoreCasing),
        isBlock: false,
        type: "simple",
        storageClassType: "boolean",
      },
      ignore_missing_property: {
        value: cdktf.booleanToHclTerraform(this._ignoreMissingProperty),
        isBlock: false,
        type: "simple",
        storageClassType: "boolean",
      },
      locks: {
        value: cdktf.listMapperHcl(cdktf.stringToHclTerraform, false)(this._locks),
        isBlock: false,
        type: "list",
        storageClassType: "stringList",
      },
      name: {
        value: cdktf.stringToHclTerraform(this._name),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      parent_id: {
        value: cdktf.stringToHclTerraform(this._parentId),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      read_headers: {
        value: cdktf.hashMapperHcl(cdktf.stringToHclTerraform)(this._readHeaders),
        isBlock: false,
        type: "map",
        storageClassType: "stringMap",
      },
      read_query_parameters: {
        value: cdktf.hashMapperHcl(cdktf.listMapperHcl(cdktf.stringToHclTerraform, false))(this._readQueryParameters),
        isBlock: false,
        type: "map",
        storageClassType: "stringListMap",
      },
      resource_id: {
        value: cdktf.stringToHclTerraform(this._resourceId),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      response_export_values: {
        value: cdktf.hashMapperHcl(cdktf.anyToHclTerraform)(this._responseExportValues),
        isBlock: false,
        type: "map",
        storageClassType: "anyMap",
      },
      retry: {
        value: updateResourceRetryToHclTerraform(this._retry.internalValue),
        isBlock: true,
        type: "struct",
        storageClassType: "UpdateResourceRetry",
      },
      sensitive_body: {
        value: cdktf.hashMapperHcl(cdktf.anyToHclTerraform)(this._sensitiveBody),
        isBlock: false,
        type: "map",
        storageClassType: "anyMap",
      },
      sensitive_body_version: {
        value: cdktf.hashMapperHcl(cdktf.stringToHclTerraform)(this._sensitiveBodyVersion),
        isBlock: false,
        type: "map",
        storageClassType: "stringMap",
      },
      type: {
        value: cdktf.stringToHclTerraform(this._type),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      update_headers: {
        value: cdktf.hashMapperHcl(cdktf.stringToHclTerraform)(this._updateHeaders),
        isBlock: false,
        type: "map",
        storageClassType: "stringMap",
      },
      update_query_parameters: {
        value: cdktf.hashMapperHcl(cdktf.listMapperHcl(cdktf.stringToHclTerraform, false))(this._updateQueryParameters),
        isBlock: false,
        type: "map",
        storageClassType: "stringListMap",
      },
      timeouts: {
        value: updateResourceTimeoutsToHclTerraform(this._timeouts.internalValue),
        isBlock: true,
        type: "struct",
        storageClassType: "UpdateResourceTimeouts",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}
