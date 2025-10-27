// https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action
// generated from terraform resource schema

import * as cdktf from "cdktf";
import { Construct } from "constructs";

// Configuration

export interface ResourceActionConfig extends cdktf.TerraformMetaArguments {
  /**
   * The name of the resource action. It's also possible to make HTTP requests towards the resource ID if leave this field empty.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#action ResourceAction#action}
   */
  readonly action?: string;
  /**
   * A dynamic attribute that contains the request body.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#body ResourceAction#body}
   */
  readonly body?: { [key: string]: any };
  /**
   * A map of headers to include in the request
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#headers ResourceAction#headers}
   */
  readonly headers?: { [key: string]: string };
  /**
   * A list of ARM resource IDs which are used to avoid create/modify/delete azapi resources at the same time.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#locks ResourceAction#locks}
   */
  readonly locks?: string[];
  /**
   * Specifies the HTTP method of the azure resource action. Allowed values are `POST`, `PATCH`, `PUT` and `DELETE`. Defaults to `POST`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#method ResourceAction#method}
   */
  readonly method?: string;
  /**
   * A map of query parameters to include in the request
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#query_parameters ResourceAction#query_parameters}
   */
  readonly queryParameters?: { [key: string]: string[] } | cdktf.IResolvable;
  /**
   * The ID of an existing Azure source.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#resource_id ResourceAction#resource_id}
   */
  readonly resourceId: string;
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
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#response_export_values ResourceAction#response_export_values}
  */
  readonly responseExportValues?: { [key: string]: any };
  /**
   * The retry object supports the following attributes:
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#retry ResourceAction#retry}
   */
  readonly retry?: ResourceActionRetry;
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
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#sensitive_response_export_values ResourceAction#sensitive_response_export_values}
  */
  readonly sensitiveResponseExportValues?: { [key: string]: any };
  /**
   * In a format like `<resource-type>@<api-version>`. `<resource-type>` is the Azure resource type, for example, `Microsoft.Storage/storageAccounts`. `<api-version>` is version of the API used to manage this azure resource.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#type ResourceAction#type}
   */
  readonly type: string;
  /**
   * When to perform the action, value must be one of: `apply`, `destroy`. Default is `apply`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#when ResourceAction#when}
   */
  readonly when?: string;
  /**
   * timeouts block
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#timeouts ResourceAction#timeouts}
   */
  readonly timeouts?: ResourceActionTimeouts;
}
export interface ResourceActionRetry {
  /**
   * A list of regular expressions to match against error messages. If any of the regular expressions match, the request will be retried.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#error_message_regex ResourceAction#error_message_regex}
   */
  readonly errorMessageRegex: string[];
  /**
   * The base number of seconds to wait between retries. Default is `10`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#interval_seconds ResourceAction#interval_seconds}
   */
  readonly intervalSeconds?: number;
  /**
   * The maximum number of seconds to wait between retries. Default is `180`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#max_interval_seconds ResourceAction#max_interval_seconds}
   */
  readonly maxIntervalSeconds?: number;
  /**
   * The multiplier to apply to the interval between retries. Default is `1.5`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#multiplier ResourceAction#multiplier}
   */
  readonly multiplier?: number;
  /**
   * The randomization factor to apply to the interval between retries. The formula for the randomized interval is: `RetryInterval * (random value in range [1 - RandomizationFactor, 1 + RandomizationFactor])`. Therefore set to zero `0.0` for no randomization. Default is `0.5`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#randomization_factor ResourceAction#randomization_factor}
   */
  readonly randomizationFactor?: number;
}

export function resourceActionRetryToTerraform(
  struct?: ResourceActionRetry | cdktf.IResolvable,
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

export class ResourceActionRetryOutputReference extends cdktf.ComplexObject {
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
    | ResourceActionRetry
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
    value: ResourceActionRetry | cdktf.IResolvable | undefined,
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
export interface ResourceActionTimeouts {
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours).
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#create ResourceAction#create}
   */
  readonly create?: string;
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Setting a timeout for a Delete operation is only applicable if changes are saved into state before the destroy operation occurs.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#delete ResourceAction#delete}
   */
  readonly delete?: string;
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Read operations occur during any refresh or planning operation when refresh is enabled.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#read ResourceAction#read}
   */
  readonly read?: string;
  /**
   * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours).
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action#update ResourceAction#update}
   */
  readonly update?: string;
}

export function resourceActionTimeoutsToTerraform(
  struct?: ResourceActionTimeouts | cdktf.IResolvable,
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

export class ResourceActionTimeoutsOutputReference extends cdktf.ComplexObject {
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
    | ResourceActionTimeouts
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
    value: ResourceActionTimeouts | cdktf.IResolvable | undefined,
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
 * Represents a {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action azapi_resource_action}
 */
export class ResourceAction extends cdktf.TerraformResource {
  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "azapi_resource_action";

  // ===========
  // INITIALIZER
  // ===========

  /**
   * Create a new {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/resources/resource_action azapi_resource_action} Resource
   *
   * @param scope The scope in which to define this construct
   * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
   * @param options ResourceActionConfig
   */
  public constructor(
    scope: Construct,
    id: string,
    config: ResourceActionConfig,
  ) {
    super(scope, id, {
      terraformResourceType: "azapi_resource_action",
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
    this._action = config.action;
    this._body = config.body;
    this._headers = config.headers;
    this._locks = config.locks;
    this._method = config.method;
    this._queryParameters = config.queryParameters;
    this._resourceId = config.resourceId;
    this._responseExportValues = config.responseExportValues;
    this._retry.internalValue = config.retry;
    this._sensitiveResponseExportValues = config.sensitiveResponseExportValues;
    this._type = config.type;
    this._when = config.when;
    this._timeouts.internalValue = config.timeouts;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // action - computed: false, optional: true, required: false
  private _action?: string;
  public get action() {
    return this.getStringAttribute("action");
  }
  public set action(value: string) {
    this._action = value;
  }
  public resetAction() {
    this._action = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get actionInput() {
    return this._action;
  }

  // body - computed: false, optional: true, required: false
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

  // method - computed: true, optional: true, required: false
  private _method?: string;
  public get method() {
    return this.getStringAttribute("method");
  }
  public set method(value: string) {
    this._method = value;
  }
  public resetMethod() {
    this._method = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get methodInput() {
    return this._method;
  }

  // output - computed: true, optional: false, required: false
  private _output = new cdktf.AnyMap(this, "output");
  public get output() {
    return this._output;
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

  // resource_id - computed: false, optional: false, required: true
  private _resourceId?: string;
  public get resourceId() {
    return this.getStringAttribute("resource_id");
  }
  public set resourceId(value: string) {
    this._resourceId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get resourceIdInput() {
    return this._resourceId;
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
  private _retry = new ResourceActionRetryOutputReference(this, "retry");
  public get retry() {
    return this._retry;
  }
  public putRetry(value: ResourceActionRetry) {
    this._retry.internalValue = value;
  }
  public resetRetry() {
    this._retry.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get retryInput() {
    return this._retry.internalValue;
  }

  // sensitive_output - computed: true, optional: false, required: false
  private _sensitiveOutput = new cdktf.AnyMap(this, "sensitive_output");
  public get sensitiveOutput() {
    return this._sensitiveOutput;
  }

  // sensitive_response_export_values - computed: false, optional: true, required: false
  private _sensitiveResponseExportValues?: { [key: string]: any };
  public get sensitiveResponseExportValues() {
    return this.getAnyMapAttribute("sensitive_response_export_values");
  }
  public set sensitiveResponseExportValues(value: { [key: string]: any }) {
    this._sensitiveResponseExportValues = value;
  }
  public resetSensitiveResponseExportValues() {
    this._sensitiveResponseExportValues = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get sensitiveResponseExportValuesInput() {
    return this._sensitiveResponseExportValues;
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

  // when - computed: true, optional: true, required: false
  private _when?: string;
  public get when() {
    return this.getStringAttribute("when");
  }
  public set when(value: string) {
    this._when = value;
  }
  public resetWhen() {
    this._when = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get whenInput() {
    return this._when;
  }

  // timeouts - computed: false, optional: true, required: false
  private _timeouts = new ResourceActionTimeoutsOutputReference(
    this,
    "timeouts",
  );
  public get timeouts() {
    return this._timeouts;
  }
  public putTimeouts(value: ResourceActionTimeouts) {
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
      action: cdktf.stringToTerraform(this._action),
      body: cdktf.hashMapper(cdktf.anyToTerraform)(this._body),
      headers: cdktf.hashMapper(cdktf.stringToTerraform)(this._headers),
      locks: cdktf.listMapper(cdktf.stringToTerraform, false)(this._locks),
      method: cdktf.stringToTerraform(this._method),
      query_parameters: cdktf.hashMapper(
        cdktf.listMapper(cdktf.stringToTerraform, false),
      )(this._queryParameters),
      resource_id: cdktf.stringToTerraform(this._resourceId),
      response_export_values: cdktf.hashMapper(cdktf.anyToTerraform)(
        this._responseExportValues,
      ),
      retry: resourceActionRetryToTerraform(this._retry.internalValue),
      sensitive_response_export_values: cdktf.hashMapper(cdktf.anyToTerraform)(
        this._sensitiveResponseExportValues,
      ),
      type: cdktf.stringToTerraform(this._type),
      when: cdktf.stringToTerraform(this._when),
      timeouts: resourceActionTimeoutsToTerraform(this._timeouts.internalValue),
    };
  }
}
