// https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource
// generated from terraform resource schema

import * as cdktf from "cdktf";
import { Construct } from "constructs";

// Configuration

export interface ResourceConfig extends cdktf.TerraformMetaArguments {
  /**
   * A dynamic attribute that contains the request body.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#body Resource#body}
   */
  readonly body?: { [key: string]: any };
  /**
   * A mapping of headers to be sent with the create request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#create_headers Resource#create_headers}
   */
  readonly createHeaders?: { [key: string]: string };
  /**
   * A mapping of query parameters to be sent with the create request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#create_query_parameters Resource#create_query_parameters}
   */
  readonly createQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  /**
   * A mapping of headers to be sent with the delete request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#delete_headers Resource#delete_headers}
   */
  readonly deleteHeaders?: { [key: string]: string };
  /**
   * A mapping of query parameters to be sent with the delete request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#delete_query_parameters Resource#delete_query_parameters}
   */
  readonly deleteQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  /**
   * Whether ignore the casing of the property names in the response body. Defaults to `false`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#ignore_casing Resource#ignore_casing}
   */
  readonly ignoreCasing?: boolean | cdktf.IResolvable;
  /**
   * Whether ignore not returned properties like credentials in `body` to suppress plan-diff. Defaults to `true`. It's recommend to enable this option when some sensitive properties are not returned in response body, instead of setting them in `lifecycle.ignore_changes` because it will make the sensitive fields unable to update.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#ignore_missing_property Resource#ignore_missing_property}
   */
  readonly ignoreMissingProperty?: boolean | cdktf.IResolvable;
  /**
  * When set to `true`, the provider will ignore properties whose values are `null` in the `body`.
These properties will not be included in the request body sent to the API, and the difference will not be shown in the plan output. Defaults to `false`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#ignore_null_property Resource#ignore_null_property}
  */
  readonly ignoreNullProperty?: boolean | cdktf.IResolvable;
  /**
   * The location of the Azure resource.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#location Resource#location}
   */
  readonly location?: string;
  /**
   * A list of ARM resource IDs which are used to avoid create/modify/delete azapi resources at the same time.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#locks Resource#locks}
   */
  readonly locks?: string[];
  /**
   * Specifies the name of the azure resource. Changing this forces a new resource to be created.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#name Resource#name}
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
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#parent_id Resource#parent_id}
  */
  readonly parentId?: string;
  /**
   * A mapping of headers to be sent with the read request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#read_headers Resource#read_headers}
   */
  readonly readHeaders?: { [key: string]: string };
  /**
   * A mapping of query parameters to be sent with the read request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#read_query_parameters Resource#read_query_parameters}
   */
  readonly readQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  /**
  * Will trigger a replace of the resource when the value changes and is not `null`. This can be used by practitioners to force a replace of the resource when certain values change, e.g. changing the SKU of a virtual machine based on the value of variables or locals. The value is a `dynamic`, so practitioners can compose the input however they wish. For a "break glass" set the value to `null` to prevent the plan modifier taking effect.
If you have `null` values that you do want to be tracked as affecting the resource replacement, include these inside an object.
Advanced use cases are possible and resource replacement can be triggered by values external to the resource, for example when a dependent resource changes.

e.g. to replace a resource when either the SKU or os_type attributes change:

```hcl
resource "azapi_resource" "example" {
  name      = var.name
  type      = "Microsoft.Network/publicIPAddresses@2023-11-01"
  parent_id = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example"
  body = {
    properties = {
      sku   = var.sku
      zones = var.zones
    }
  }

  replace_triggers_external_values = [
    var.sku,
    var.zones,
  ]
}
```

  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#replace_triggers_external_values Resource#replace_triggers_external_values}
  */
  readonly replaceTriggersExternalValues?: { [key: string]: any };
  /**
   * A list of paths in the current Terraform configuration. When the values at these paths change, the resource will be replaced.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#replace_triggers_refs Resource#replace_triggers_refs}
   */
  readonly replaceTriggersRefs?: string[];
  /**
  * The attribute can accept either a list or a map.

- **List**: A list of paths that need to be exported from the response body. Setting it to `["*"]` will export the full response body. Here's an example. If it sets to `["properties.loginServer", "properties.policies.quarantinePolicy.status"]`, it will set the following HCL object to the computed property output.

	```text
	{
		properties = {
			loginServer = "registry1.azurecr.io"
			policies = {
				quarantinePolicy = {
					status = "disabled"
				}
			}
		}
	}
	```

- **Map**: A map where the key is the name for the result and the value is a JMESPath query string to filter the response. Here's an example. If it sets to `{"login_server": "properties.loginServer", "quarantine_status": "properties.policies.quarantinePolicy.status"}`, it will set the following HCL object to the computed property output.

	```text
	{
		"login_server" = "registry1.azurecr.io"
		"quarantine_status" = "disabled"
	}
	```

To learn more about JMESPath, visit [JMESPath](https://jmespath.org/).

  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#response_export_values Resource#response_export_values}
  */
  readonly responseExportValues?: { [key: string]: any };
  /**
   * The retry object supports the following attributes:
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#retry Resource#retry}
   */
  readonly retry?: ResourceRetry;
  /**
   * Whether enabled the validation on `type` and `body` with embedded schema. Defaults to `true`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#schema_validation_enabled Resource#schema_validation_enabled}
   */
  readonly schemaValidationEnabled?: boolean | cdktf.IResolvable;
  /**
   * A dynamic attribute that contains the write-only properties of the request body. This will be merge-patched to the body to construct the actual request body.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#sensitive_body Resource#sensitive_body}
   */
  readonly sensitiveBody?: { [key: string]: any };
  /**
   * A map where the key is the path to the property in `sensitive_body` and the value is the version of the property. The key is a string in the format of `path.to.property[index].subproperty`, where `index` is the index of the item in an array. When the version is changed, the property will be included in the request body, otherwise it will be omitted from the request body.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#sensitive_body_version Resource#sensitive_body_version}
   */
  readonly sensitiveBodyVersion?: { [key: string]: string };
  /**
   * A mapping of tags which should be assigned to the Azure resource.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#tags Resource#tags}
   */
  readonly tags?: { [key: string]: string };
  /**
   * In a format like `<resource-type>@<api-version>`. `<resource-type>` is the Azure resource type, for example, `Microsoft.Storage/storageAccounts`. `<api-version>` is version of the API used to manage this azure resource.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#type Resource#type}
   */
  readonly type: string;
  /**
   * A mapping of headers to be sent with the update request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#update_headers Resource#update_headers}
   */
  readonly updateHeaders?: { [key: string]: string };
  /**
   * A mapping of query parameters to be sent with the update request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#update_query_parameters Resource#update_query_parameters}
   */
  readonly updateQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  /**
   * identity block
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#identity Resource#identity}
   */
  readonly identity?: ResourceIdentity[] | cdktf.IResolvable;
  /**
   * timeouts block
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#timeouts Resource#timeouts}
   */
  readonly timeouts?: ResourceTimeouts;
}
export interface ResourceRetry {
  /**
   * A list of regular expressions to match against error messages. If any of the regular expressions match, the request will be retried.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#error_message_regex Resource#error_message_regex}
   */
  readonly errorMessageRegex: string[];
  /**
   * The base number of seconds to wait between retries. Default is `10`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#interval_seconds Resource#interval_seconds}
   */
  readonly intervalSeconds?: number;
  /**
   * The maximum number of seconds to wait between retries. Default is `180`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#max_interval_seconds Resource#max_interval_seconds}
   */
  readonly maxIntervalSeconds?: number;
  /**
   * The multiplier to apply to the interval between retries. Default is `1.5`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#multiplier Resource#multiplier}
   */
  readonly multiplier?: number;
  /**
   * The randomization factor to apply to the interval between retries. The formula for the randomized interval is: `RetryInterval * (random value in range [1 - RandomizationFactor, 1 + RandomizationFactor])`. Therefore set to zero `0.0` for no randomization. Default is `0.5`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#randomization_factor Resource#randomization_factor}
   */
  readonly randomizationFactor?: number;
}

export function resourceRetryToTerraform(
  struct?: ResourceRetry | cdktf.IResolvable,
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
    error_message_regex: cdktf.listMapper(
      cdktf.stringToTerraform,
      false,
    )(struct!.errorMessageRegex),
    interval_seconds: cdktf.numberToTerraform(struct!.intervalSeconds),
    max_interval_seconds: cdktf.numberToTerraform(struct!.maxIntervalSeconds),
    multiplier: cdktf.numberToTerraform(struct!.multiplier),
    randomization_factor: cdktf.numberToTerraform(struct!.randomizationFactor),
  };
}

export class ResourceRetryOutputReference extends cdktf.ComplexObject {
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

  public get internalValue(): ResourceRetry | cdktf.IResolvable | undefined {
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

  public set internalValue(
    value: ResourceRetry | cdktf.IResolvable | undefined,
  ) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._errorMessageRegex = undefined;
      this._intervalSeconds = undefined;
      this._maxIntervalSeconds = undefined;
      this._multiplier = undefined;
      this._randomizationFactor = undefined;
    } else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    } else {
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
    return this.getListAttribute("error_message_regex");
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
    return this.getNumberAttribute("interval_seconds");
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
    return this.getNumberAttribute("max_interval_seconds");
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
    return this.getNumberAttribute("multiplier");
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
    return this.getNumberAttribute("randomization_factor");
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
export interface ResourceIdentity {
  /**
   * A list of User Managed Identity ID's which should be assigned to the azure resource.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#identity_ids Resource#identity_ids}
   */
  readonly identityIds?: string[];
  /**
   * The Type of Identity which should be used for this azure resource. Possible values are `SystemAssigned`, `UserAssigned` and `SystemAssigned,UserAssigned`
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#type Resource#type}
   */
  readonly type: string;
}

export function resourceIdentityToTerraform(
  struct?: ResourceIdentity | cdktf.IResolvable,
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
    identity_ids: cdktf.listMapper(
      cdktf.stringToTerraform,
      false,
    )(struct!.identityIds),
    type: cdktf.stringToTerraform(struct!.type),
  };
}

export class ResourceIdentityOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
   * @param terraformResource The parent resource
   * @param terraformAttribute The attribute on the parent resource this class is referencing
   * @param complexObjectIndex the index of this item in the list
   * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
   */
  public constructor(
    terraformResource: cdktf.IInterpolatingParent,
    terraformAttribute: string,
    complexObjectIndex: number,
    complexObjectIsFromSet: boolean,
  ) {
    super(
      terraformResource,
      terraformAttribute,
      complexObjectIsFromSet,
      complexObjectIndex,
    );
  }

  public get internalValue(): ResourceIdentity | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._identityIds !== undefined) {
      hasAnyValues = true;
      internalValueResult.identityIds = this._identityIds;
    }
    if (this._type !== undefined) {
      hasAnyValues = true;
      internalValueResult.type = this._type;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(
    value: ResourceIdentity | cdktf.IResolvable | undefined,
  ) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._identityIds = undefined;
      this._type = undefined;
    } else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    } else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._identityIds = value.identityIds;
      this._type = value.type;
    }
  }

  // identity_ids - computed: false, optional: true, required: false
  private _identityIds?: string[];
  public get identityIds() {
    return this.getListAttribute("identity_ids");
  }
  public set identityIds(value: string[]) {
    this._identityIds = value;
  }
  public resetIdentityIds() {
    this._identityIds = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get identityIdsInput() {
    return this._identityIds;
  }

  // principal_id - computed: true, optional: false, required: false
  public get principalId() {
    return this.getStringAttribute("principal_id");
  }

  // tenant_id - computed: true, optional: false, required: false
  public get tenantId() {
    return this.getStringAttribute("tenant_id");
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
}

export class ResourceIdentityList extends cdktf.ComplexList {
  public internalValue?: ResourceIdentity[] | cdktf.IResolvable;

  /**
   * @param terraformResource The parent resource
   * @param terraformAttribute The attribute on the parent resource this class is referencing
   * @param wrapsSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
   */
  constructor(
    protected terraformResource: cdktf.IInterpolatingParent,
    protected terraformAttribute: string,
    protected wrapsSet: boolean,
  ) {
    super(terraformResource, terraformAttribute, wrapsSet);
  }

  /**
   * @param index the index of the item to return
   */
  public get(index: number): ResourceIdentityOutputReference {
    return new ResourceIdentityOutputReference(
      this.terraformResource,
      this.terraformAttribute,
      index,
      this.wrapsSet,
    );
  }
}
export interface ResourceTimeouts {
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours).
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#create Resource#create}
   */
  readonly create?: string;
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Setting a timeout for a Delete operation is only applicable if changes are saved into state before the destroy operation occurs.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#delete Resource#delete}
   */
  readonly delete?: string;
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Read operations occur during any refresh or planning operation when refresh is enabled.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#read Resource#read}
   */
  readonly read?: string;
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours).
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource#update Resource#update}
   */
  readonly update?: string;
}

export function resourceTimeoutsToTerraform(
  struct?: ResourceTimeouts | cdktf.IResolvable,
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
    create: cdktf.stringToTerraform(struct!.create),
    delete: cdktf.stringToTerraform(struct!.delete),
    read: cdktf.stringToTerraform(struct!.read),
    update: cdktf.stringToTerraform(struct!.update),
  };
}

export class ResourceTimeoutsOutputReference extends cdktf.ComplexObject {
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

  public get internalValue(): ResourceTimeouts | cdktf.IResolvable | undefined {
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

  public set internalValue(
    value: ResourceTimeouts | cdktf.IResolvable | undefined,
  ) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._create = undefined;
      this._delete = undefined;
      this._read = undefined;
      this._update = undefined;
    } else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    } else {
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
    return this.getStringAttribute("create");
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
    return this.getStringAttribute("delete");
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

  // update - computed: false, optional: true, required: false
  private _update?: string;
  public get update() {
    return this.getStringAttribute("update");
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
 * Represents a {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource azapi_resource}
 */
export class Resource extends cdktf.TerraformResource {
  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "azapi_resource";

  // ===========
  // INITIALIZER
  // ===========

  /**
   * Create a new {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource azapi_resource} Resource
   *
   * @param scope The scope in which to define this construct
   * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
   * @param options ResourceConfig
   */
  public constructor(scope: Construct, id: string, config: ResourceConfig) {
    super(scope, id, {
      terraformResourceType: "azapi_resource",
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
    this._body = config.body;
    this._createHeaders = config.createHeaders;
    this._createQueryParameters = config.createQueryParameters;
    this._deleteHeaders = config.deleteHeaders;
    this._deleteQueryParameters = config.deleteQueryParameters;
    this._ignoreCasing = config.ignoreCasing;
    this._ignoreMissingProperty = config.ignoreMissingProperty;
    this._ignoreNullProperty = config.ignoreNullProperty;
    this._location = config.location;
    this._locks = config.locks;
    this._name = config.name;
    this._parentId = config.parentId;
    this._readHeaders = config.readHeaders;
    this._readQueryParameters = config.readQueryParameters;
    this._replaceTriggersExternalValues = config.replaceTriggersExternalValues;
    this._replaceTriggersRefs = config.replaceTriggersRefs;
    this._responseExportValues = config.responseExportValues;
    this._retry.internalValue = config.retry;
    this._schemaValidationEnabled = config.schemaValidationEnabled;
    this._sensitiveBody = config.sensitiveBody;
    this._sensitiveBodyVersion = config.sensitiveBodyVersion;
    this._tags = config.tags;
    this._type = config.type;
    this._updateHeaders = config.updateHeaders;
    this._updateQueryParameters = config.updateQueryParameters;
    this._identity.internalValue = config.identity;
    this._timeouts.internalValue = config.timeouts;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // body - computed: true, optional: true, required: false
  private _body?: { [key: string]: any };
  public get body() {
    return this.getAnyMapAttribute("body");
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

  // create_headers - computed: false, optional: true, required: false
  private _createHeaders?: { [key: string]: string };
  public get createHeaders() {
    return this.getStringMapAttribute("create_headers");
  }
  public set createHeaders(value: { [key: string]: string }) {
    this._createHeaders = value;
  }
  public resetCreateHeaders() {
    this._createHeaders = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get createHeadersInput() {
    return this._createHeaders;
  }

  // create_query_parameters - computed: false, optional: true, required: false
  private _createQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  public get createQueryParameters() {
    return this.interpolationForAttribute("create_query_parameters");
  }
  public set createQueryParameters(
    value: { [key: string]: string[] } | cdktf.IResolvable,
  ) {
    this._createQueryParameters = value;
  }
  public resetCreateQueryParameters() {
    this._createQueryParameters = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get createQueryParametersInput() {
    return this._createQueryParameters;
  }

  // delete_headers - computed: false, optional: true, required: false
  private _deleteHeaders?: { [key: string]: string };
  public get deleteHeaders() {
    return this.getStringMapAttribute("delete_headers");
  }
  public set deleteHeaders(value: { [key: string]: string }) {
    this._deleteHeaders = value;
  }
  public resetDeleteHeaders() {
    this._deleteHeaders = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get deleteHeadersInput() {
    return this._deleteHeaders;
  }

  // delete_query_parameters - computed: false, optional: true, required: false
  private _deleteQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  public get deleteQueryParameters() {
    return this.interpolationForAttribute("delete_query_parameters");
  }
  public set deleteQueryParameters(
    value: { [key: string]: string[] } | cdktf.IResolvable,
  ) {
    this._deleteQueryParameters = value;
  }
  public resetDeleteQueryParameters() {
    this._deleteQueryParameters = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get deleteQueryParametersInput() {
    return this._deleteQueryParameters;
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute("id");
  }

  // ignore_casing - computed: true, optional: true, required: false
  private _ignoreCasing?: boolean | cdktf.IResolvable;
  public get ignoreCasing() {
    return this.getBooleanAttribute("ignore_casing");
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
    return this.getBooleanAttribute("ignore_missing_property");
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

  // ignore_null_property - computed: true, optional: true, required: false
  private _ignoreNullProperty?: boolean | cdktf.IResolvable;
  public get ignoreNullProperty() {
    return this.getBooleanAttribute("ignore_null_property");
  }
  public set ignoreNullProperty(value: boolean | cdktf.IResolvable) {
    this._ignoreNullProperty = value;
  }
  public resetIgnoreNullProperty() {
    this._ignoreNullProperty = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get ignoreNullPropertyInput() {
    return this._ignoreNullProperty;
  }

  // location - computed: true, optional: true, required: false
  private _location?: string;
  public get location() {
    return this.getStringAttribute("location");
  }
  public set location(value: string) {
    this._location = value;
  }
  public resetLocation() {
    this._location = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get locationInput() {
    return this._location;
  }

  // locks - computed: false, optional: true, required: false
  private _locks?: string[];
  public get locks() {
    return this.getListAttribute("locks");
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

  // output - computed: true, optional: false, required: false
  private _output = new cdktf.AnyMap(this, "output");
  public get output() {
    return this._output;
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

  // read_headers - computed: false, optional: true, required: false
  private _readHeaders?: { [key: string]: string };
  public get readHeaders() {
    return this.getStringMapAttribute("read_headers");
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
  private _readQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  public get readQueryParameters() {
    return this.interpolationForAttribute("read_query_parameters");
  }
  public set readQueryParameters(
    value: { [key: string]: string[] } | cdktf.IResolvable,
  ) {
    this._readQueryParameters = value;
  }
  public resetReadQueryParameters() {
    this._readQueryParameters = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get readQueryParametersInput() {
    return this._readQueryParameters;
  }

  // replace_triggers_external_values - computed: false, optional: true, required: false
  private _replaceTriggersExternalValues?: { [key: string]: any };
  public get replaceTriggersExternalValues() {
    return this.getAnyMapAttribute("replace_triggers_external_values");
  }
  public set replaceTriggersExternalValues(value: { [key: string]: any }) {
    this._replaceTriggersExternalValues = value;
  }
  public resetReplaceTriggersExternalValues() {
    this._replaceTriggersExternalValues = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get replaceTriggersExternalValuesInput() {
    return this._replaceTriggersExternalValues;
  }

  // replace_triggers_refs - computed: false, optional: true, required: false
  private _replaceTriggersRefs?: string[];
  public get replaceTriggersRefs() {
    return this.getListAttribute("replace_triggers_refs");
  }
  public set replaceTriggersRefs(value: string[]) {
    this._replaceTriggersRefs = value;
  }
  public resetReplaceTriggersRefs() {
    this._replaceTriggersRefs = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get replaceTriggersRefsInput() {
    return this._replaceTriggersRefs;
  }

  // response_export_values - computed: false, optional: true, required: false
  private _responseExportValues?: { [key: string]: any };
  public get responseExportValues() {
    return this.getAnyMapAttribute("response_export_values");
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
  private _retry = new ResourceRetryOutputReference(this, "retry");
  public get retry() {
    return this._retry;
  }
  public putRetry(value: ResourceRetry) {
    this._retry.internalValue = value;
  }
  public resetRetry() {
    this._retry.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get retryInput() {
    return this._retry.internalValue;
  }

  // schema_validation_enabled - computed: true, optional: true, required: false
  private _schemaValidationEnabled?: boolean | cdktf.IResolvable;
  public get schemaValidationEnabled() {
    return this.getBooleanAttribute("schema_validation_enabled");
  }
  public set schemaValidationEnabled(value: boolean | cdktf.IResolvable) {
    this._schemaValidationEnabled = value;
  }
  public resetSchemaValidationEnabled() {
    this._schemaValidationEnabled = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get schemaValidationEnabledInput() {
    return this._schemaValidationEnabled;
  }

  // sensitive_body - computed: false, optional: true, required: false
  private _sensitiveBody?: { [key: string]: any };
  public get sensitiveBody() {
    return this.getAnyMapAttribute("sensitive_body");
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
    return this.getStringMapAttribute("sensitive_body_version");
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

  // tags - computed: true, optional: true, required: false
  private _tags?: { [key: string]: string };
  public get tags() {
    return this.getStringMapAttribute("tags");
  }
  public set tags(value: { [key: string]: string }) {
    this._tags = value;
  }
  public resetTags() {
    this._tags = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get tagsInput() {
    return this._tags;
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

  // update_headers - computed: false, optional: true, required: false
  private _updateHeaders?: { [key: string]: string };
  public get updateHeaders() {
    return this.getStringMapAttribute("update_headers");
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
  private _updateQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  public get updateQueryParameters() {
    return this.interpolationForAttribute("update_query_parameters");
  }
  public set updateQueryParameters(
    value: { [key: string]: string[] } | cdktf.IResolvable,
  ) {
    this._updateQueryParameters = value;
  }
  public resetUpdateQueryParameters() {
    this._updateQueryParameters = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get updateQueryParametersInput() {
    return this._updateQueryParameters;
  }

  // identity - computed: false, optional: true, required: false
  private _identity = new ResourceIdentityList(this, "identity", false);
  public get identity() {
    return this._identity;
  }
  public putIdentity(value: ResourceIdentity[] | cdktf.IResolvable) {
    this._identity.internalValue = value;
  }
  public resetIdentity() {
    this._identity.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get identityInput() {
    return this._identity.internalValue;
  }

  // timeouts - computed: false, optional: true, required: false
  private _timeouts = new ResourceTimeoutsOutputReference(this, "timeouts");
  public get timeouts() {
    return this._timeouts;
  }
  public putTimeouts(value: ResourceTimeouts) {
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
      create_headers: cdktf.hashMapper(cdktf.stringToTerraform)(
        this._createHeaders,
      ),
      create_query_parameters: cdktf.hashMapper(
        cdktf.listMapper(cdktf.stringToTerraform, false),
      )(this._createQueryParameters),
      delete_headers: cdktf.hashMapper(cdktf.stringToTerraform)(
        this._deleteHeaders,
      ),
      delete_query_parameters: cdktf.hashMapper(
        cdktf.listMapper(cdktf.stringToTerraform, false),
      )(this._deleteQueryParameters),
      ignore_casing: cdktf.booleanToTerraform(this._ignoreCasing),
      ignore_missing_property: cdktf.booleanToTerraform(
        this._ignoreMissingProperty,
      ),
      ignore_null_property: cdktf.booleanToTerraform(this._ignoreNullProperty),
      location: cdktf.stringToTerraform(this._location),
      locks: cdktf.listMapper(cdktf.stringToTerraform, false)(this._locks),
      name: cdktf.stringToTerraform(this._name),
      parent_id: cdktf.stringToTerraform(this._parentId),
      read_headers: cdktf.hashMapper(cdktf.stringToTerraform)(
        this._readHeaders,
      ),
      read_query_parameters: cdktf.hashMapper(
        cdktf.listMapper(cdktf.stringToTerraform, false),
      )(this._readQueryParameters),
      replace_triggers_external_values: cdktf.hashMapper(cdktf.anyToTerraform)(
        this._replaceTriggersExternalValues,
      ),
      replace_triggers_refs: cdktf.listMapper(
        cdktf.stringToTerraform,
        false,
      )(this._replaceTriggersRefs),
      response_export_values: cdktf.hashMapper(cdktf.anyToTerraform)(
        this._responseExportValues,
      ),
      retry: resourceRetryToTerraform(this._retry.internalValue),
      schema_validation_enabled: cdktf.booleanToTerraform(
        this._schemaValidationEnabled,
      ),
      sensitive_body: cdktf.hashMapper(cdktf.anyToTerraform)(
        this._sensitiveBody,
      ),
      sensitive_body_version: cdktf.hashMapper(cdktf.stringToTerraform)(
        this._sensitiveBodyVersion,
      ),
      tags: cdktf.hashMapper(cdktf.stringToTerraform)(this._tags),
      type: cdktf.stringToTerraform(this._type),
      update_headers: cdktf.hashMapper(cdktf.stringToTerraform)(
        this._updateHeaders,
      ),
      update_query_parameters: cdktf.hashMapper(
        cdktf.listMapper(cdktf.stringToTerraform, false),
      )(this._updateQueryParameters),
      identity: cdktf.listMapper(
        resourceIdentityToTerraform,
        true,
      )(this._identity.internalValue),
      timeouts: resourceTimeoutsToTerraform(this._timeouts.internalValue),
    };
  }
}
