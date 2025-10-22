// https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list
// generated from terraform resource schema

import * as cdktf from "cdktf";
import { Construct } from "constructs";

// Configuration

export interface DataAzapiResourceListConfig
  extends cdktf.TerraformMetaArguments {
  /**
   * A map of headers to include in the request
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#headers DataAzapiResourceList#headers}
   */
  readonly headers?: { [key: string]: string };
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
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#parent_id DataAzapiResourceList#parent_id}
  */
  readonly parentId: string;
  /**
   * A map of query parameters to include in the request
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#query_parameters DataAzapiResourceList#query_parameters}
   */
  readonly queryParameters?: { [key: string]: string[] } | cdktf.IResolvable;
  /**
  * The attribute can accept either a list or a map.

- **List**: A list of paths that need to be exported from the response body. Setting it to `["*"]` will export the full response body. Here's an example. If it sets to `["value"]`, it will set the following HCL object to the computed property output.

	```text
	{
	  "value" = [
		{
		  "id" = "/subscriptions/000000/resourceGroups/demo-rg/providers/Microsoft.Automation/automationAccounts/example"
		  "location" = "eastus2"
		  "name" = "example"
		  "properties" = {
			"creationTime" = "2024-10-11T08:18:38.737+00:00"
			"disableLocalAuth" = false
			"lastModifiedTime" = "2024-10-11T08:18:38.737+00:00"
			"publicNetworkAccess" = true
		  }
		  "tags" = {}
		  "type" = "Microsoft.Automation/AutomationAccounts"
		}
	  ]
	}
	```

- **Map**: A map where the key is the name for the result and the value is a JMESPath query string to filter the response. Here's an example. If it sets to `{"values": "value[].{name: name, publicNetworkAccess: properties.publicNetworkAccess}", "names": "value[].name"}`, it will set the following HCL object to the computed property output.

	```text
	{
		"names" = [
			"example",
			"fredaccount01",
		]
		"values" = [
			{
			  "name" = "example"
			  "publicNetworkAccess" = true
			},
			{
			  "name" = "fredaccount01"
			  "publicNetworkAccess" = null
			},
		]
	}
	```

To learn more about JMESPath, visit [JMESPath](https://jmespath.org/).

  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#response_export_values DataAzapiResourceList#response_export_values}
  */
  readonly responseExportValues?: { [key: string]: any };
  /**
   * The retry object supports the following attributes:
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#retry DataAzapiResourceList#retry}
   */
  readonly retry?: DataAzapiResourceListRetry;
  /**
   * In a format like `<resource-type>@<api-version>`. `<resource-type>` is the Azure resource type, for example, `Microsoft.Storage/storageAccounts`. `<api-version>` is version of the API used to manage this azure resource.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#type DataAzapiResourceList#type}
   */
  readonly type: string;
  /**
   * timeouts block
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#timeouts DataAzapiResourceList#timeouts}
   */
  readonly timeouts?: DataAzapiResourceListTimeouts;
}
export interface DataAzapiResourceListRetry {
  /**
   * A list of regular expressions to match against error messages. If any of the regular expressions match, the request will be retried.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#error_message_regex DataAzapiResourceList#error_message_regex}
   */
  readonly errorMessageRegex: string[];
  /**
   * The base number of seconds to wait between retries. Default is `10`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#interval_seconds DataAzapiResourceList#interval_seconds}
   */
  readonly intervalSeconds?: number;
  /**
   * The maximum number of seconds to wait between retries. Default is `180`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#max_interval_seconds DataAzapiResourceList#max_interval_seconds}
   */
  readonly maxIntervalSeconds?: number;
  /**
   * The multiplier to apply to the interval between retries. Default is `1.5`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#multiplier DataAzapiResourceList#multiplier}
   */
  readonly multiplier?: number;
  /**
   * The randomization factor to apply to the interval between retries. The formula for the randomized interval is: `RetryInterval * (random value in range [1 - RandomizationFactor, 1 + RandomizationFactor])`. Therefore set to zero `0.0` for no randomization. Default is `0.5`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#randomization_factor DataAzapiResourceList#randomization_factor}
   */
  readonly randomizationFactor?: number;
}

export function dataAzapiResourceListRetryToTerraform(
  struct?: DataAzapiResourceListRetry | cdktf.IResolvable,
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

export class DataAzapiResourceListRetryOutputReference extends cdktf.ComplexObject {
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
    | DataAzapiResourceListRetry
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
    value: DataAzapiResourceListRetry | cdktf.IResolvable | undefined,
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
export interface DataAzapiResourceListTimeouts {
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Read operations occur during any refresh or planning operation when refresh is enabled.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list#read DataAzapiResourceList#read}
   */
  readonly read?: string;
}

export function dataAzapiResourceListTimeoutsToTerraform(
  struct?: DataAzapiResourceListTimeouts | cdktf.IResolvable,
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

export class DataAzapiResourceListTimeoutsOutputReference extends cdktf.ComplexObject {
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
    | DataAzapiResourceListTimeouts
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
    value: DataAzapiResourceListTimeouts | cdktf.IResolvable | undefined,
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
 * Represents a {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list azapi_resource_list}
 */
export class DataAzapiResourceList extends cdktf.TerraformDataSource {
  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "azapi_resource_list";

  // ===========
  // INITIALIZER
  // ===========

  /**
   * Create a new {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_list azapi_resource_list} Data Source
   *
   * @param scope The scope in which to define this construct
   * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
   * @param options DataAzapiResourceListConfig
   */
  public constructor(
    scope: Construct,
    id: string,
    config: DataAzapiResourceListConfig,
  ) {
    super(scope, id, {
      terraformResourceType: "azapi_resource_list",
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
    this._headers = config.headers;
    this._parentId = config.parentId;
    this._queryParameters = config.queryParameters;
    this._responseExportValues = config.responseExportValues;
    this._retry.internalValue = config.retry;
    this._type = config.type;
    this._timeouts.internalValue = config.timeouts;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // headers - computed: false, optional: true, required: false
  private _headers?: { [key: string]: string };
  public get headers() {
    return this.getStringMapAttribute("headers");
  }
  public set headers(value: { [key: string]: string }) {
    this._headers = value;
  }
  public resetHeaders() {
    this._headers = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get headersInput() {
    return this._headers;
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute("id");
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

  // query_parameters - computed: false, optional: true, required: false
  private _queryParameters?: { [key: string]: string[] } | cdktf.IResolvable;
  public get queryParameters() {
    return this.interpolationForAttribute("query_parameters");
  }
  public set queryParameters(
    value: { [key: string]: string[] } | cdktf.IResolvable,
  ) {
    this._queryParameters = value;
  }
  public resetQueryParameters() {
    this._queryParameters = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get queryParametersInput() {
    return this._queryParameters;
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
  private _retry = new DataAzapiResourceListRetryOutputReference(this, "retry");
  public get retry() {
    return this._retry;
  }
  public putRetry(value: DataAzapiResourceListRetry) {
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

  // timeouts - computed: false, optional: true, required: false
  private _timeouts = new DataAzapiResourceListTimeoutsOutputReference(
    this,
    "timeouts",
  );
  public get timeouts() {
    return this._timeouts;
  }
  public putTimeouts(value: DataAzapiResourceListTimeouts) {
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
      headers: cdktf.hashMapper(cdktf.stringToTerraform)(this._headers),
      parent_id: cdktf.stringToTerraform(this._parentId),
      query_parameters: cdktf.hashMapper(
        cdktf.listMapper(cdktf.stringToTerraform, false),
      )(this._queryParameters),
      response_export_values: cdktf.hashMapper(cdktf.anyToTerraform)(
        this._responseExportValues,
      ),
      retry: dataAzapiResourceListRetryToTerraform(this._retry.internalValue),
      type: cdktf.stringToTerraform(this._type),
      timeouts: dataAzapiResourceListTimeoutsToTerraform(
        this._timeouts.internalValue,
      ),
    };
  }
}
