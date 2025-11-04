// https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface DataAzapiResourceActionConfig extends cdktf.TerraformMetaArguments {
  /**
  * The name of the resource action. It's also possible to make HTTP requests towards the resource ID if leave this field empty.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#action DataAzapiResourceAction#action}
  */
  readonly action?: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#body DataAzapiResourceAction#body}
  */
  readonly body?: { [key: string]: any };
  /**
  * A map of headers to include in the request
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#headers DataAzapiResourceAction#headers}
  */
  readonly headers?: { [key: string]: string };
  /**
  * The HTTP method to use when performing the action. Must be one of `POST`, `GET`. Defaults to `POST`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#method DataAzapiResourceAction#method}
  */
  readonly method?: string;
  /**
  * A map of query parameters to include in the request
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#query_parameters DataAzapiResourceAction#query_parameters}
  */
  readonly queryParameters?: { [key: string]: string[] } | cdktf.IResolvable;
  /**
  * The ID of the Azure resource to perform the action on.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#resource_id DataAzapiResourceAction#resource_id}
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
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#response_export_values DataAzapiResourceAction#response_export_values}
  */
  readonly responseExportValues?: { [key: string]: any };
  /**
  * The retry object supports the following attributes:
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#retry DataAzapiResourceAction#retry}
  */
  readonly retry?: DataAzapiResourceActionRetry;
  /**
  * The attribute can accept either a list or a map.
  * 
  * - **List**: A list of paths that need to be exported from the response body. Setting it to `["*"]` will export the full response body. Here's an example. If it sets to `["properties.loginServer", "properties.policies.quarantinePolicy.status"]`, it will set the following HCL object to the computed property sensitive_output.
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
  * - **Map**: A map where the key is the name for the result and the value is a JMESPath query string to filter the response. Here's an example. If it sets to `{"login_server": "properties.loginServer", "quarantine_status": "properties.policies.quarantinePolicy.status"}`, it will set the following HCL object to the computed property sensitive_output.
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
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#sensitive_response_export_values DataAzapiResourceAction#sensitive_response_export_values}
  */
  readonly sensitiveResponseExportValues?: { [key: string]: any };
  /**
  * In a format like `<resource-type>@<api-version>`. `<resource-type>` is the Azure resource type, for example, `Microsoft.Storage/storageAccounts`. `<api-version>` is version of the API used to manage this azure resource.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#type DataAzapiResourceAction#type}
  */
  readonly type: string;
  /**
  * timeouts block
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#timeouts DataAzapiResourceAction#timeouts}
  */
  readonly timeouts?: DataAzapiResourceActionTimeouts;
}
export interface DataAzapiResourceActionRetry {
  /**
  * A list of regular expressions to match against error messages. If any of the regular expressions match, the request will be retried.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#error_message_regex DataAzapiResourceAction#error_message_regex}
  */
  readonly errorMessageRegex: string[];
  /**
  * The base number of seconds to wait between retries. Default is `10`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#interval_seconds DataAzapiResourceAction#interval_seconds}
  */
  readonly intervalSeconds?: number;
  /**
  * The maximum number of seconds to wait between retries. Default is `180`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#max_interval_seconds DataAzapiResourceAction#max_interval_seconds}
  */
  readonly maxIntervalSeconds?: number;
  /**
  * The multiplier to apply to the interval between retries. Default is `1.5`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#multiplier DataAzapiResourceAction#multiplier}
  */
  readonly multiplier?: number;
  /**
  * The randomization factor to apply to the interval between retries. The formula for the randomized interval is: `RetryInterval * (random value in range [1 - RandomizationFactor, 1 + RandomizationFactor])`. Therefore set to zero `0.0` for no randomization. Default is `0.5`.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#randomization_factor DataAzapiResourceAction#randomization_factor}
  */
  readonly randomizationFactor?: number;
}

export function dataAzapiResourceActionRetryToTerraform(struct?: DataAzapiResourceActionRetry | cdktf.IResolvable): any {
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


export function dataAzapiResourceActionRetryToHclTerraform(struct?: DataAzapiResourceActionRetry | cdktf.IResolvable): any {
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

export class DataAzapiResourceActionRetryOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false);
  }

  public get internalValue(): DataAzapiResourceActionRetry | cdktf.IResolvable | undefined {
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

  public set internalValue(value: DataAzapiResourceActionRetry | cdktf.IResolvable | undefined) {
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
export interface DataAzapiResourceActionTimeouts {
  /**
  * A string that can be [parsed as a duration](https://pkg.go.dev/time#ParseDuration) consisting of numbers and unit suffixes, such as "30s" or "2h45m". Valid time units are "s" (seconds), "m" (minutes), "h" (hours). Read operations occur during any refresh or planning operation when refresh is enabled.
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#read DataAzapiResourceAction#read}
  */
  readonly read?: string;
}

export function dataAzapiResourceActionTimeoutsToTerraform(struct?: DataAzapiResourceActionTimeouts | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    read: cdktf.stringToTerraform(struct!.read),
  }
}


export function dataAzapiResourceActionTimeoutsToHclTerraform(struct?: DataAzapiResourceActionTimeouts | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    read: {
      value: cdktf.stringToHclTerraform(struct!.read),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class DataAzapiResourceActionTimeoutsOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false);
  }

  public get internalValue(): DataAzapiResourceActionTimeouts | cdktf.IResolvable | undefined {
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

  public set internalValue(value: DataAzapiResourceActionTimeouts | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._read = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._read = value.read;
    }
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
}

/**
* Represents a {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action azapi_resource_action}
*/
export class DataAzapiResourceAction extends cdktf.TerraformDataSource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "azapi_resource_action";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a DataAzapiResourceAction resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the DataAzapiResourceAction to import
  * @param importFromId The id of the existing DataAzapiResourceAction that should be imported. Refer to the {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the DataAzapiResourceAction to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "azapi_resource_action", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs/data-sources/resource_action azapi_resource_action} Data Source
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options DataAzapiResourceActionConfig
  */
  public constructor(scope: Construct, id: string, config: DataAzapiResourceActionConfig) {
    super(scope, id, {
      terraformResourceType: 'azapi_resource_action',
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
    this._action = config.action;
    this._body = config.body;
    this._headers = config.headers;
    this._method = config.method;
    this._queryParameters = config.queryParameters;
    this._resourceId = config.resourceId;
    this._responseExportValues = config.responseExportValues;
    this._retry.internalValue = config.retry;
    this._sensitiveResponseExportValues = config.sensitiveResponseExportValues;
    this._type = config.type;
    this._timeouts.internalValue = config.timeouts;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // action - computed: false, optional: true, required: false
  private _action?: string; 
  public get action() {
    return this.getStringAttribute('action');
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

  // headers - computed: false, optional: true, required: false
  private _headers?: { [key: string]: string }; 
  public get headers() {
    return this.getStringMapAttribute('headers');
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
    return this.getStringAttribute('id');
  }

  // method - computed: true, optional: true, required: false
  private _method?: string; 
  public get method() {
    return this.getStringAttribute('method');
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
    return this.interpolationForAttribute('query_parameters');
  }
  public set queryParameters(value: { [key: string]: string[] } | cdktf.IResolvable) {
    this._queryParameters = value;
  }
  public resetQueryParameters() {
    this._queryParameters = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get queryParametersInput() {
    return this._queryParameters;
  }

  // resource_id - computed: false, optional: true, required: false
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
  private _retry = new DataAzapiResourceActionRetryOutputReference(this, "retry");
  public get retry() {
    return this._retry;
  }
  public putRetry(value: DataAzapiResourceActionRetry) {
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
    return this.getAnyMapAttribute('sensitive_response_export_values');
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
    return this.getStringAttribute('type');
  }
  public set type(value: string) {
    this._type = value;
  }
  // Temporarily expose input value. Use with caution.
  public get typeInput() {
    return this._type;
  }

  // timeouts - computed: false, optional: true, required: false
  private _timeouts = new DataAzapiResourceActionTimeoutsOutputReference(this, "timeouts");
  public get timeouts() {
    return this._timeouts;
  }
  public putTimeouts(value: DataAzapiResourceActionTimeouts) {
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
      method: cdktf.stringToTerraform(this._method),
      query_parameters: cdktf.hashMapper(cdktf.listMapper(cdktf.stringToTerraform, false))(this._queryParameters),
      resource_id: cdktf.stringToTerraform(this._resourceId),
      response_export_values: cdktf.hashMapper(cdktf.anyToTerraform)(this._responseExportValues),
      retry: dataAzapiResourceActionRetryToTerraform(this._retry.internalValue),
      sensitive_response_export_values: cdktf.hashMapper(cdktf.anyToTerraform)(this._sensitiveResponseExportValues),
      type: cdktf.stringToTerraform(this._type),
      timeouts: dataAzapiResourceActionTimeoutsToTerraform(this._timeouts.internalValue),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      action: {
        value: cdktf.stringToHclTerraform(this._action),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      body: {
        value: cdktf.hashMapperHcl(cdktf.anyToHclTerraform)(this._body),
        isBlock: false,
        type: "map",
        storageClassType: "anyMap",
      },
      headers: {
        value: cdktf.hashMapperHcl(cdktf.stringToHclTerraform)(this._headers),
        isBlock: false,
        type: "map",
        storageClassType: "stringMap",
      },
      method: {
        value: cdktf.stringToHclTerraform(this._method),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      query_parameters: {
        value: cdktf.hashMapperHcl(cdktf.listMapperHcl(cdktf.stringToHclTerraform, false))(this._queryParameters),
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
        value: dataAzapiResourceActionRetryToHclTerraform(this._retry.internalValue),
        isBlock: true,
        type: "struct",
        storageClassType: "DataAzapiResourceActionRetry",
      },
      sensitive_response_export_values: {
        value: cdktf.hashMapperHcl(cdktf.anyToHclTerraform)(this._sensitiveResponseExportValues),
        isBlock: false,
        type: "map",
        storageClassType: "anyMap",
      },
      type: {
        value: cdktf.stringToHclTerraform(this._type),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      timeouts: {
        value: dataAzapiResourceActionTimeoutsToHclTerraform(this._timeouts.internalValue),
        isBlock: true,
        type: "struct",
        storageClassType: "DataAzapiResourceActionTimeouts",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}
