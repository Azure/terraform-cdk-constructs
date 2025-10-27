// https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource
// generated from terraform resource schema

import * as cdktf from "cdktf";
import { Construct } from "constructs";

// Configuration

export interface DataPlaneResourceConfig extends cdktf.TerraformMetaArguments {
  /**
   * A dynamic attribute that contains the request body.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#body DataPlaneResource#body}
   */
  readonly body?: { [key: string]: any };
  /**
   * A mapping of headers to be sent with the create request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#create_headers DataPlaneResource#create_headers}
   */
  readonly createHeaders?: { [key: string]: string };
  /**
   * A mapping of query parameters to be sent with the create request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#create_query_parameters DataPlaneResource#create_query_parameters}
   */
  readonly createQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  /**
   * A mapping of headers to be sent with the delete request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#delete_headers DataPlaneResource#delete_headers}
   */
  readonly deleteHeaders?: { [key: string]: string };
  /**
   * A mapping of query parameters to be sent with the delete request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#delete_query_parameters DataPlaneResource#delete_query_parameters}
   */
  readonly deleteQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  /**
   * A dynamic attribute that contains the request body.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#ignore_casing DataPlaneResource#ignore_casing}
   */
  readonly ignoreCasing?: boolean | cdktf.IResolvable;
  /**
   * Whether ignore not returned properties like credentials in `body` to suppress plan-diff. Defaults to `true`. It's recommend to enable this option when some sensitive properties are not returned in response body, instead of setting them in `lifecycle.ignore_changes` because it will make the sensitive fields unable to update.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#ignore_missing_property DataPlaneResource#ignore_missing_property}
   */
  readonly ignoreMissingProperty?: boolean | cdktf.IResolvable;
  /**
   * A list of ARM resource IDs which are used to avoid create/modify/delete azapi resources at the same time.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#locks DataPlaneResource#locks}
   */
  readonly locks?: string[];
  /**
   * Specifies the name of the Azure resource. Changing this forces a new resource to be created.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#name DataPlaneResource#name}
   */
  readonly name: string;
  /**
   * The ID of the azure resource in which this resource is created. Changing this forces a new resource to be created.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#parent_id DataPlaneResource#parent_id}
   */
  readonly parentId: string;
  /**
   * A mapping of headers to be sent with the read request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#read_headers DataPlaneResource#read_headers}
   */
  readonly readHeaders?: { [key: string]: string };
  /**
   * A mapping of query parameters to be sent with the read request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#read_query_parameters DataPlaneResource#read_query_parameters}
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
resource "azapi_data_plane_resource" "example" {
  name = var.name
  type = "Microsoft.AppConfiguration/configurationStores/keyValues@1.0"
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
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#replace_triggers_external_values DataPlaneResource#replace_triggers_external_values}
  */
  readonly replaceTriggersExternalValues?: { [key: string]: any };
  /**
   * A list of paths in the current Terraform configuration. When the values at these paths change, the resource will be replaced.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#replace_triggers_refs DataPlaneResource#replace_triggers_refs}
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
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#response_export_values DataPlaneResource#response_export_values}
  */
  readonly responseExportValues?: { [key: string]: any };
  /**
   * The retry object supports the following attributes:
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#retry DataPlaneResource#retry}
   */
  readonly retry?: DataPlaneResourceRetry;
  /**
   * In a format like `<resource-type>@<api-version>`. `<resource-type>` is the Azure resource type, for example, `Microsoft.Storage/storageAccounts`. `<api-version>` is version of the API used to manage this azure resource.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#type DataPlaneResource#type}
   */
  readonly type: string;
  /**
   * A mapping of headers to be sent with the update request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#update_headers DataPlaneResource#update_headers}
   */
  readonly updateHeaders?: { [key: string]: string };
  /**
   * A mapping of query parameters to be sent with the update request.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#update_query_parameters DataPlaneResource#update_query_parameters}
   */
  readonly updateQueryParameters?:
    | { [key: string]: string[] }
    | cdktf.IResolvable;
  /**
   * timeouts block
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#timeouts DataPlaneResource#timeouts}
   */
  readonly timeouts?: DataPlaneResourceTimeouts;
}
export interface DataPlaneResourceRetry {
  /**
   * A list of regular expressions to match against error messages. If any of the regular expressions match, the request will be retried.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#error_message_regex DataPlaneResource#error_message_regex}
   */
  readonly errorMessageRegex: string[];
  /**
   * The base number of seconds to wait between retries. Default is `10`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#interval_seconds DataPlaneResource#interval_seconds}
   */
  readonly intervalSeconds?: number;
  /**
   * The maximum number of seconds to wait between retries. Default is `180`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#max_interval_seconds DataPlaneResource#max_interval_seconds}
   */
  readonly maxIntervalSeconds?: number;
  /**
   * The multiplier to apply to the interval between retries. Default is `1.5`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#multiplier DataPlaneResource#multiplier}
   */
  readonly multiplier?: number;
  /**
   * The randomization factor to apply to the interval between retries. The formula for the randomized interval is: `RetryInterval * (random value in range [1 - RandomizationFactor, 1 + RandomizationFactor])`. Therefore set to zero `0.0` for no randomization. Default is `0.5`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#randomization_factor DataPlaneResource#randomization_factor}
   */
  readonly randomizationFactor?: number;
}

export function dataPlaneResourceRetryToTerraform(
  struct?: DataPlaneResourceRetry | cdktf.IResolvable,
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

export class DataPlaneResourceRetryOutputReference extends cdktf.ComplexObject {
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
    | DataPlaneResourceRetry
    | cdktf.IResolvable
    | undefined {
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
    value: DataPlaneResourceRetry | cdktf.IResolvable | undefined,
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
export interface DataPlaneResourceTimeouts {
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours).
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#create DataPlaneResource#create}
   */
  readonly create?: string;
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Setting a timeout for a Delete operation is only applicable if changes are saved into state before the destroy operation occurs.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#delete DataPlaneResource#delete}
   */
  readonly delete?: string;
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Read operations occur during any refresh or planning operation when refresh is enabled.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#read DataPlaneResource#read}
   */
  readonly read?: string;
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours).
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource#update DataPlaneResource#update}
   */
  readonly update?: string;
}

export function dataPlaneResourceTimeoutsToTerraform(
  struct?: DataPlaneResourceTimeouts | cdktf.IResolvable,
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

export class DataPlaneResourceTimeoutsOutputReference extends cdktf.ComplexObject {
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
    | DataPlaneResourceTimeouts
    | cdktf.IResolvable
    | undefined {
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
    value: DataPlaneResourceTimeouts | cdktf.IResolvable | undefined,
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
 * Represents a {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource azapi_data_plane_resource}
 */
export class DataPlaneResource extends cdktf.TerraformResource {
  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "azapi_data_plane_resource";

  // ===========
  // INITIALIZER
  // ===========

  /**
   * Create a new {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/data_plane_resource azapi_data_plane_resource} Resource
   *
   * @param scope The scope in which to define this construct
   * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
   * @param options DataPlaneResourceConfig
   */
  public constructor(
    scope: Construct,
    id: string,
    config: DataPlaneResourceConfig,
  ) {
    super(scope, id, {
      terraformResourceType: "azapi_data_plane_resource",
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
    this._locks = config.locks;
    this._name = config.name;
    this._parentId = config.parentId;
    this._readHeaders = config.readHeaders;
    this._readQueryParameters = config.readQueryParameters;
    this._replaceTriggersExternalValues = config.replaceTriggersExternalValues;
    this._replaceTriggersRefs = config.replaceTriggersRefs;
    this._responseExportValues = config.responseExportValues;
    this._retry.internalValue = config.retry;
    this._type = config.type;
    this._updateHeaders = config.updateHeaders;
    this._updateQueryParameters = config.updateQueryParameters;
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

  // name - computed: false, optional: false, required: true
  private _name?: string;
  public get name() {
    return this.getStringAttribute("name");
  }
  public set name(value: string) {
    this._name = value;
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

  // parent_id - computed: false, optional: false, required: true
  private _parentId?: string;
  public get parentId() {
    return this.getStringAttribute("parent_id");
  }
  public set parentId(value: string) {
    this._parentId = value;
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
  private _retry = new DataPlaneResourceRetryOutputReference(this, "retry");
  public get retry() {
    return this._retry;
  }
  public putRetry(value: DataPlaneResourceRetry) {
    this._retry.internalValue = value;
  }
  public resetRetry() {
    this._retry.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get retryInput() {
    return this._retry.internalValue;
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

  // timeouts - computed: false, optional: true, required: false
  private _timeouts = new DataPlaneResourceTimeoutsOutputReference(
    this,
    "timeouts",
  );
  public get timeouts() {
    return this._timeouts;
  }
  public putTimeouts(value: DataPlaneResourceTimeouts) {
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
      retry: dataPlaneResourceRetryToTerraform(this._retry.internalValue),
      type: cdktf.stringToTerraform(this._type),
      update_headers: cdktf.hashMapper(cdktf.stringToTerraform)(
        this._updateHeaders,
      ),
      update_query_parameters: cdktf.hashMapper(
        cdktf.listMapper(cdktf.stringToTerraform, false),
      )(this._updateQueryParameters),
      timeouts: dataPlaneResourceTimeoutsToTerraform(
        this._timeouts.internalValue,
      ),
    };
  }
}
