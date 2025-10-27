// https://registry.terraform.io/providers/azure/azapi/2.7.0/docs
// generated from terraform resource schema

import * as cdktf from "cdktf";
import { Construct } from "constructs";

// Configuration

export interface AzapiProviderConfig {
  /**
   * List of auxiliary Tenant IDs required for multi-tenancy and cross-tenant scenarios. This can also be sourced from the `ARM_AUXILIARY_TENANT_IDS` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#auxiliary_tenant_ids AzapiProvider#auxiliary_tenant_ids}
   */
  readonly auxiliaryTenantIds?: string[];
  /**
   * A base64-encoded PKCS#12 bundle to be used as the client certificate for authentication. This can also be sourced from the `ARM_CLIENT_CERTIFICATE` environment variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#client_certificate AzapiProvider#client_certificate}
   */
  readonly clientCertificate?: string;
  /**
   * The password associated with the Client Certificate. This can also be sourced from the `ARM_CLIENT_CERTIFICATE_PASSWORD` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#client_certificate_password AzapiProvider#client_certificate_password}
   */
  readonly clientCertificatePassword?: string;
  /**
   * The path to the Client Certificate associated with the Service Principal which should be used. This can also be sourced from the `ARM_CLIENT_CERTIFICATE_PATH` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#client_certificate_path AzapiProvider#client_certificate_path}
   */
  readonly clientCertificatePath?: string;
  /**
   * The Client ID which should be used. This can also be sourced from the `ARM_CLIENT_ID`, `AZURE_CLIENT_ID` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#client_id AzapiProvider#client_id}
   */
  readonly clientId?: string;
  /**
   * The path to a file containing the Client ID which should be used. This can also be sourced from the `ARM_CLIENT_ID_FILE_PATH` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#client_id_file_path AzapiProvider#client_id_file_path}
   */
  readonly clientIdFilePath?: string;
  /**
   * The Client Secret which should be used. This can also be sourced from the `ARM_CLIENT_SECRET` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#client_secret AzapiProvider#client_secret}
   */
  readonly clientSecret?: string;
  /**
   * The path to a file containing the Client Secret which should be used. For use When authenticating as a Service Principal using a Client Secret. This can also be sourced from the `ARM_CLIENT_SECRET_FILE_PATH` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#client_secret_file_path AzapiProvider#client_secret_file_path}
   */
  readonly clientSecretFilePath?: string;
  /**
   * The value of the `x-ms-correlation-request-id` header, otherwise an auto-generated UUID will be used. This can also be sourced from the `ARM_CORRELATION_REQUEST_ID` environment variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#custom_correlation_request_id AzapiProvider#custom_correlation_request_id}
   */
  readonly customCorrelationRequestId?: string;
  /**
   *  The default Azure Region where the azure resource should exist. The `location` in each resource block can override the `default_location`. Changing this forces new resources to be created.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#default_location AzapiProvider#default_location}
   */
  readonly defaultLocation?: string;
  /**
   * The default name to create the azure resource. The `name` in each resource block can override the `default_name`. Changing this forces new resources to be created.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#default_name AzapiProvider#default_name}
   */
  readonly defaultName?: string;
  /**
   * A mapping of tags which should be assigned to the azure resource as default tags. The`tags` in each resource block can override the `default_tags`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#default_tags AzapiProvider#default_tags}
   */
  readonly defaultTags?: { [key: string]: string };
  /**
   * This will disable the x-ms-correlation-request-id header.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#disable_correlation_request_id AzapiProvider#disable_correlation_request_id}
   */
  readonly disableCorrelationRequestId?: boolean | cdktf.IResolvable;
  /**
   * Disable default output. The default is false. When set to false, the provider will output the read-only properties if `response_export_values` is not specified in the resource block. When set to true, the provider will disable this output. This can also be sourced from the `ARM_DISABLE_DEFAULT_OUTPUT` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#disable_default_output AzapiProvider#disable_default_output}
   */
  readonly disableDefaultOutput?: boolean | cdktf.IResolvable;
  /**
   * Disables Instance Discovery, which validates that the Authority is valid and known by the Microsoft Entra instance metadata service at `https://login.microsoft.com` before authenticating. This should only be enabled when the configured authority is known to be valid and trustworthy - such as when running against Azure Stack or when `environment` is set to `custom`. This can also be specified via the `ARM_DISABLE_INSTANCE_DISCOVERY` environment variable. Defaults to `false`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#disable_instance_discovery AzapiProvider#disable_instance_discovery}
   */
  readonly disableInstanceDiscovery?: boolean | cdktf.IResolvable;
  /**
   * Disable sending the Terraform Partner ID if a custom `partner_id` isn't specified, which allows Microsoft to better understand the usage of Terraform. The Partner ID does not give HashiCorp any direct access to usage information. This can also be sourced from the `ARM_DISABLE_TERRAFORM_PARTNER_ID` environment variable. Defaults to `false`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#disable_terraform_partner_id AzapiProvider#disable_terraform_partner_id}
   */
  readonly disableTerraformPartnerId?: boolean | cdktf.IResolvable;
  /**
   * Enable Preflight Validation. The default is false. When set to true, the provider will use Preflight to do static validation before really deploying a new resource. When set to false, the provider will disable this validation. This can also be sourced from the `ARM_ENABLE_PREFLIGHT` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#enable_preflight AzapiProvider#enable_preflight}
   */
  readonly enablePreflight?: boolean | cdktf.IResolvable;
  /**
   * The Azure API Endpoint Configuration.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#endpoint AzapiProvider#endpoint}
   */
  readonly endpoint?: AzapiProviderEndpoint[] | cdktf.IResolvable;
  /**
   * The Cloud Environment which should be used. Possible values are `public`, `usgovernment`, `china` and `custom`. Defaults to `public`. This can also be sourced from the `ARM_ENVIRONMENT` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#environment AzapiProvider#environment}
   */
  readonly environment?: string;
  /**
   * Ignore no-op changes for `azapi_resource`. The default is true. When set to true, the provider will suppress changes in the `azapi_resource` if the `body` in the new API version still matches the remote state. When set to false, the provider will not suppress these changes. This can also be sourced from the `ARM_IGNORE_NO_OP_CHANGES` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#ignore_no_op_changes AzapiProvider#ignore_no_op_changes}
   */
  readonly ignoreNoOpChanges?: boolean | cdktf.IResolvable;
  /**
   * DEPRECATED - The maximum number of retries to attempt if the Azure API returns an HTTP 408, 429, 500, 502, 503, or 504 response. The default is `32767`, this allows the provider to rely on the resource timeout values rather than a maximum retry count. The resource-specific retry configuration may additionally be used to retry on other errors and conditions. This property will be removed in a future version.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#maximum_busy_retry_attempts AzapiProvider#maximum_busy_retry_attempts}
   */
  readonly maximumBusyRetryAttempts?: number;
  /**
   * The Azure Pipelines Service Connection ID to use for authentication. This can also be sourced from the `ARM_ADO_PIPELINE_SERVICE_CONNECTION_ID`, `ARM_OIDC_AZURE_SERVICE_CONNECTION_ID`, or `AZURESUBSCRIPTION_SERVICE_CONNECTION_ID` Environment Variables.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#oidc_azure_service_connection_id AzapiProvider#oidc_azure_service_connection_id}
   */
  readonly oidcAzureServiceConnectionId?: string;
  /**
   * The bearer token for the request to the OIDC provider. This can also be sourced from the `ARM_OIDC_REQUEST_TOKEN`, `ACTIONS_ID_TOKEN_REQUEST_TOKEN`, or `SYSTEM_ACCESSTOKEN` Environment Variables.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#oidc_request_token AzapiProvider#oidc_request_token}
   */
  readonly oidcRequestToken?: string;
  /**
   * The URL for the OIDC provider from which to request an ID token. This can also be sourced from the `ARM_OIDC_REQUEST_URL`, `ACTIONS_ID_TOKEN_REQUEST_URL`, or `SYSTEM_OIDCREQUESTURI` Environment Variables.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#oidc_request_url AzapiProvider#oidc_request_url}
   */
  readonly oidcRequestUrl?: string;
  /**
   * The ID token when authenticating using OpenID Connect (OIDC). This can also be sourced from the `ARM_OIDC_TOKEN` environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#oidc_token AzapiProvider#oidc_token}
   */
  readonly oidcToken?: string;
  /**
   * The path to a file containing an ID token when authenticating using OpenID Connect (OIDC). This can also be sourced from the `ARM_OIDC_TOKEN_FILE_PATH`, `AZURE_FEDERATED_TOKEN_FILE` environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#oidc_token_file_path AzapiProvider#oidc_token_file_path}
   */
  readonly oidcTokenFilePath?: string;
  /**
   * A GUID/UUID that is [registered](https://docs.microsoft.com/azure/marketplace/azure-partner-customer-usage-attribution#register-guids-and-offers) with Microsoft to facilitate partner resource usage attribution. This can also be sourced from the `ARM_PARTNER_ID` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#partner_id AzapiProvider#partner_id}
   */
  readonly partnerId?: string;
  /**
   * Should the Provider skip registering the Resource Providers it supports? This can also be sourced from the `ARM_SKIP_PROVIDER_REGISTRATION` Environment Variable. Defaults to `false`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#skip_provider_registration AzapiProvider#skip_provider_registration}
   */
  readonly skipProviderRegistration?: boolean | cdktf.IResolvable;
  /**
   * The Subscription ID which should be used. This can also be sourced from the `ARM_SUBSCRIPTION_ID` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#subscription_id AzapiProvider#subscription_id}
   */
  readonly subscriptionId?: string;
  /**
   * The Tenant ID should be used. This can also be sourced from the `ARM_TENANT_ID` Environment Variable.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#tenant_id AzapiProvider#tenant_id}
   */
  readonly tenantId?: string;
  /**
   * Should AKS Workload Identity be used for Authentication? This can also be sourced from the `ARM_USE_AKS_WORKLOAD_IDENTITY` Environment Variable. Defaults to `false`. When set, `client_id`, `tenant_id` and `oidc_token_file_path` will be detected from the environment and do not need to be specified.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#use_aks_workload_identity AzapiProvider#use_aks_workload_identity}
   */
  readonly useAksWorkloadIdentity?: boolean | cdktf.IResolvable;
  /**
   * Should Azure CLI be used for authentication? This can also be sourced from the `ARM_USE_CLI` environment variable. Defaults to `true`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#use_cli AzapiProvider#use_cli}
   */
  readonly useCli?: boolean | cdktf.IResolvable;
  /**
   * Should Managed Identity be used for Authentication? This can also be sourced from the `ARM_USE_MSI` Environment Variable. Defaults to `false`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#use_msi AzapiProvider#use_msi}
   */
  readonly useMsi?: boolean | cdktf.IResolvable;
  /**
   * Should OIDC be used for Authentication? This can also be sourced from the `ARM_USE_OIDC` Environment Variable. Defaults to `false`.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#use_oidc AzapiProvider#use_oidc}
   */
  readonly useOidc?: boolean | cdktf.IResolvable;
  /**
   * Alias name
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#alias AzapiProvider#alias}
   */
  readonly alias?: string;
}
export interface AzapiProviderEndpoint {
  /**
   * The Azure Active Directory login endpoint to use. This can also be sourced from the `ARM_ACTIVE_DIRECTORY_AUTHORITY_HOST` Environment Variable. Defaults to `https://login.microsoftonline.com/` for public cloud.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#active_directory_authority_host AzapiProvider#active_directory_authority_host}
   */
  readonly activeDirectoryAuthorityHost?: string;
  /**
   * The resource ID to obtain AD tokens for. This can also be sourced from the `ARM_RESOURCE_MANAGER_AUDIENCE` Environment Variable. Defaults to `https://management.core.windows.net/` for public cloud.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#resource_manager_audience AzapiProvider#resource_manager_audience}
   */
  readonly resourceManagerAudience?: string;
  /**
   * The Azure Resource Manager endpoint to use. This can also be sourced from the `ARM_RESOURCE_MANAGER_ENDPOINT` Environment Variable. Defaults to `https://management.azure.com/` for public cloud.
   *
   * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs#resource_manager_endpoint AzapiProvider#resource_manager_endpoint}
   */
  readonly resourceManagerEndpoint?: string;
}

export function azapiProviderEndpointToTerraform(
  struct?: AzapiProviderEndpoint | cdktf.IResolvable,
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
    active_directory_authority_host: cdktf.stringToTerraform(
      struct!.activeDirectoryAuthorityHost,
    ),
    resource_manager_audience: cdktf.stringToTerraform(
      struct!.resourceManagerAudience,
    ),
    resource_manager_endpoint: cdktf.stringToTerraform(
      struct!.resourceManagerEndpoint,
    ),
  };
}

/**
 * Represents a {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs azapi}
 */
export class AzapiProvider extends cdktf.TerraformProvider {
  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "azapi";

  // ===========
  // INITIALIZER
  // ===========

  /**
   * Create a new {@link https://registry.terraform.io/providers/azure/azapi/2.7.0/docs azapi} Resource
   *
   * @param scope The scope in which to define this construct
   * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
   * @param options AzapiProviderConfig = {}
   */
  public constructor(
    scope: Construct,
    id: string,
    config: AzapiProviderConfig = {},
  ) {
    super(scope, id, {
      terraformResourceType: "azapi",
      terraformGeneratorMetadata: {
        providerName: "azapi",
        providerVersion: "2.7.0",
        providerVersionConstraint: "~> 2.7.0",
      },
      terraformProviderSource: "Azure/azapi",
    });
    this._auxiliaryTenantIds = config.auxiliaryTenantIds;
    this._clientCertificate = config.clientCertificate;
    this._clientCertificatePassword = config.clientCertificatePassword;
    this._clientCertificatePath = config.clientCertificatePath;
    this._clientId = config.clientId;
    this._clientIdFilePath = config.clientIdFilePath;
    this._clientSecret = config.clientSecret;
    this._clientSecretFilePath = config.clientSecretFilePath;
    this._customCorrelationRequestId = config.customCorrelationRequestId;
    this._defaultLocation = config.defaultLocation;
    this._defaultName = config.defaultName;
    this._defaultTags = config.defaultTags;
    this._disableCorrelationRequestId = config.disableCorrelationRequestId;
    this._disableDefaultOutput = config.disableDefaultOutput;
    this._disableInstanceDiscovery = config.disableInstanceDiscovery;
    this._disableTerraformPartnerId = config.disableTerraformPartnerId;
    this._enablePreflight = config.enablePreflight;
    this._endpoint = config.endpoint;
    this._environment = config.environment;
    this._ignoreNoOpChanges = config.ignoreNoOpChanges;
    this._maximumBusyRetryAttempts = config.maximumBusyRetryAttempts;
    this._oidcAzureServiceConnectionId = config.oidcAzureServiceConnectionId;
    this._oidcRequestToken = config.oidcRequestToken;
    this._oidcRequestUrl = config.oidcRequestUrl;
    this._oidcToken = config.oidcToken;
    this._oidcTokenFilePath = config.oidcTokenFilePath;
    this._partnerId = config.partnerId;
    this._skipProviderRegistration = config.skipProviderRegistration;
    this._subscriptionId = config.subscriptionId;
    this._tenantId = config.tenantId;
    this._useAksWorkloadIdentity = config.useAksWorkloadIdentity;
    this._useCli = config.useCli;
    this._useMsi = config.useMsi;
    this._useOidc = config.useOidc;
    this._alias = config.alias;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // auxiliary_tenant_ids - computed: false, optional: true, required: false
  private _auxiliaryTenantIds?: string[];
  public get auxiliaryTenantIds() {
    return this._auxiliaryTenantIds;
  }
  public set auxiliaryTenantIds(value: string[] | undefined) {
    this._auxiliaryTenantIds = value;
  }
  public resetAuxiliaryTenantIds() {
    this._auxiliaryTenantIds = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get auxiliaryTenantIdsInput() {
    return this._auxiliaryTenantIds;
  }

  // client_certificate - computed: false, optional: true, required: false
  private _clientCertificate?: string;
  public get clientCertificate() {
    return this._clientCertificate;
  }
  public set clientCertificate(value: string | undefined) {
    this._clientCertificate = value;
  }
  public resetClientCertificate() {
    this._clientCertificate = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get clientCertificateInput() {
    return this._clientCertificate;
  }

  // client_certificate_password - computed: false, optional: true, required: false
  private _clientCertificatePassword?: string;
  public get clientCertificatePassword() {
    return this._clientCertificatePassword;
  }
  public set clientCertificatePassword(value: string | undefined) {
    this._clientCertificatePassword = value;
  }
  public resetClientCertificatePassword() {
    this._clientCertificatePassword = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get clientCertificatePasswordInput() {
    return this._clientCertificatePassword;
  }

  // client_certificate_path - computed: false, optional: true, required: false
  private _clientCertificatePath?: string;
  public get clientCertificatePath() {
    return this._clientCertificatePath;
  }
  public set clientCertificatePath(value: string | undefined) {
    this._clientCertificatePath = value;
  }
  public resetClientCertificatePath() {
    this._clientCertificatePath = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get clientCertificatePathInput() {
    return this._clientCertificatePath;
  }

  // client_id - computed: false, optional: true, required: false
  private _clientId?: string;
  public get clientId() {
    return this._clientId;
  }
  public set clientId(value: string | undefined) {
    this._clientId = value;
  }
  public resetClientId() {
    this._clientId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get clientIdInput() {
    return this._clientId;
  }

  // client_id_file_path - computed: false, optional: true, required: false
  private _clientIdFilePath?: string;
  public get clientIdFilePath() {
    return this._clientIdFilePath;
  }
  public set clientIdFilePath(value: string | undefined) {
    this._clientIdFilePath = value;
  }
  public resetClientIdFilePath() {
    this._clientIdFilePath = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get clientIdFilePathInput() {
    return this._clientIdFilePath;
  }

  // client_secret - computed: false, optional: true, required: false
  private _clientSecret?: string;
  public get clientSecret() {
    return this._clientSecret;
  }
  public set clientSecret(value: string | undefined) {
    this._clientSecret = value;
  }
  public resetClientSecret() {
    this._clientSecret = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get clientSecretInput() {
    return this._clientSecret;
  }

  // client_secret_file_path - computed: false, optional: true, required: false
  private _clientSecretFilePath?: string;
  public get clientSecretFilePath() {
    return this._clientSecretFilePath;
  }
  public set clientSecretFilePath(value: string | undefined) {
    this._clientSecretFilePath = value;
  }
  public resetClientSecretFilePath() {
    this._clientSecretFilePath = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get clientSecretFilePathInput() {
    return this._clientSecretFilePath;
  }

  // custom_correlation_request_id - computed: false, optional: true, required: false
  private _customCorrelationRequestId?: string;
  public get customCorrelationRequestId() {
    return this._customCorrelationRequestId;
  }
  public set customCorrelationRequestId(value: string | undefined) {
    this._customCorrelationRequestId = value;
  }
  public resetCustomCorrelationRequestId() {
    this._customCorrelationRequestId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get customCorrelationRequestIdInput() {
    return this._customCorrelationRequestId;
  }

  // default_location - computed: false, optional: true, required: false
  private _defaultLocation?: string;
  public get defaultLocation() {
    return this._defaultLocation;
  }
  public set defaultLocation(value: string | undefined) {
    this._defaultLocation = value;
  }
  public resetDefaultLocation() {
    this._defaultLocation = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get defaultLocationInput() {
    return this._defaultLocation;
  }

  // default_name - computed: false, optional: true, required: false
  private _defaultName?: string;
  public get defaultName() {
    return this._defaultName;
  }
  public set defaultName(value: string | undefined) {
    this._defaultName = value;
  }
  public resetDefaultName() {
    this._defaultName = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get defaultNameInput() {
    return this._defaultName;
  }

  // default_tags - computed: false, optional: true, required: false
  private _defaultTags?: { [key: string]: string };
  public get defaultTags() {
    return this._defaultTags;
  }
  public set defaultTags(value: { [key: string]: string } | undefined) {
    this._defaultTags = value;
  }
  public resetDefaultTags() {
    this._defaultTags = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get defaultTagsInput() {
    return this._defaultTags;
  }

  // disable_correlation_request_id - computed: false, optional: true, required: false
  private _disableCorrelationRequestId?: boolean | cdktf.IResolvable;
  public get disableCorrelationRequestId() {
    return this._disableCorrelationRequestId;
  }
  public set disableCorrelationRequestId(
    value: boolean | cdktf.IResolvable | undefined,
  ) {
    this._disableCorrelationRequestId = value;
  }
  public resetDisableCorrelationRequestId() {
    this._disableCorrelationRequestId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get disableCorrelationRequestIdInput() {
    return this._disableCorrelationRequestId;
  }

  // disable_default_output - computed: false, optional: true, required: false
  private _disableDefaultOutput?: boolean | cdktf.IResolvable;
  public get disableDefaultOutput() {
    return this._disableDefaultOutput;
  }
  public set disableDefaultOutput(
    value: boolean | cdktf.IResolvable | undefined,
  ) {
    this._disableDefaultOutput = value;
  }
  public resetDisableDefaultOutput() {
    this._disableDefaultOutput = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get disableDefaultOutputInput() {
    return this._disableDefaultOutput;
  }

  // disable_instance_discovery - computed: false, optional: true, required: false
  private _disableInstanceDiscovery?: boolean | cdktf.IResolvable;
  public get disableInstanceDiscovery() {
    return this._disableInstanceDiscovery;
  }
  public set disableInstanceDiscovery(
    value: boolean | cdktf.IResolvable | undefined,
  ) {
    this._disableInstanceDiscovery = value;
  }
  public resetDisableInstanceDiscovery() {
    this._disableInstanceDiscovery = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get disableInstanceDiscoveryInput() {
    return this._disableInstanceDiscovery;
  }

  // disable_terraform_partner_id - computed: false, optional: true, required: false
  private _disableTerraformPartnerId?: boolean | cdktf.IResolvable;
  public get disableTerraformPartnerId() {
    return this._disableTerraformPartnerId;
  }
  public set disableTerraformPartnerId(
    value: boolean | cdktf.IResolvable | undefined,
  ) {
    this._disableTerraformPartnerId = value;
  }
  public resetDisableTerraformPartnerId() {
    this._disableTerraformPartnerId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get disableTerraformPartnerIdInput() {
    return this._disableTerraformPartnerId;
  }

  // enable_preflight - computed: false, optional: true, required: false
  private _enablePreflight?: boolean | cdktf.IResolvable;
  public get enablePreflight() {
    return this._enablePreflight;
  }
  public set enablePreflight(value: boolean | cdktf.IResolvable | undefined) {
    this._enablePreflight = value;
  }
  public resetEnablePreflight() {
    this._enablePreflight = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get enablePreflightInput() {
    return this._enablePreflight;
  }

  // endpoint - computed: false, optional: true, required: false
  private _endpoint?: AzapiProviderEndpoint[] | cdktf.IResolvable;
  public get endpoint() {
    return this._endpoint;
  }
  public set endpoint(
    value: AzapiProviderEndpoint[] | cdktf.IResolvable | undefined,
  ) {
    this._endpoint = value;
  }
  public resetEndpoint() {
    this._endpoint = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get endpointInput() {
    return this._endpoint;
  }

  // environment - computed: false, optional: true, required: false
  private _environment?: string;
  public get environment() {
    return this._environment;
  }
  public set environment(value: string | undefined) {
    this._environment = value;
  }
  public resetEnvironment() {
    this._environment = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get environmentInput() {
    return this._environment;
  }

  // ignore_no_op_changes - computed: false, optional: true, required: false
  private _ignoreNoOpChanges?: boolean | cdktf.IResolvable;
  public get ignoreNoOpChanges() {
    return this._ignoreNoOpChanges;
  }
  public set ignoreNoOpChanges(value: boolean | cdktf.IResolvable | undefined) {
    this._ignoreNoOpChanges = value;
  }
  public resetIgnoreNoOpChanges() {
    this._ignoreNoOpChanges = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get ignoreNoOpChangesInput() {
    return this._ignoreNoOpChanges;
  }

  // maximum_busy_retry_attempts - computed: false, optional: true, required: false
  private _maximumBusyRetryAttempts?: number;
  public get maximumBusyRetryAttempts() {
    return this._maximumBusyRetryAttempts;
  }
  public set maximumBusyRetryAttempts(value: number | undefined) {
    this._maximumBusyRetryAttempts = value;
  }
  public resetMaximumBusyRetryAttempts() {
    this._maximumBusyRetryAttempts = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get maximumBusyRetryAttemptsInput() {
    return this._maximumBusyRetryAttempts;
  }

  // oidc_azure_service_connection_id - computed: false, optional: true, required: false
  private _oidcAzureServiceConnectionId?: string;
  public get oidcAzureServiceConnectionId() {
    return this._oidcAzureServiceConnectionId;
  }
  public set oidcAzureServiceConnectionId(value: string | undefined) {
    this._oidcAzureServiceConnectionId = value;
  }
  public resetOidcAzureServiceConnectionId() {
    this._oidcAzureServiceConnectionId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get oidcAzureServiceConnectionIdInput() {
    return this._oidcAzureServiceConnectionId;
  }

  // oidc_request_token - computed: false, optional: true, required: false
  private _oidcRequestToken?: string;
  public get oidcRequestToken() {
    return this._oidcRequestToken;
  }
  public set oidcRequestToken(value: string | undefined) {
    this._oidcRequestToken = value;
  }
  public resetOidcRequestToken() {
    this._oidcRequestToken = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get oidcRequestTokenInput() {
    return this._oidcRequestToken;
  }

  // oidc_request_url - computed: false, optional: true, required: false
  private _oidcRequestUrl?: string;
  public get oidcRequestUrl() {
    return this._oidcRequestUrl;
  }
  public set oidcRequestUrl(value: string | undefined) {
    this._oidcRequestUrl = value;
  }
  public resetOidcRequestUrl() {
    this._oidcRequestUrl = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get oidcRequestUrlInput() {
    return this._oidcRequestUrl;
  }

  // oidc_token - computed: false, optional: true, required: false
  private _oidcToken?: string;
  public get oidcToken() {
    return this._oidcToken;
  }
  public set oidcToken(value: string | undefined) {
    this._oidcToken = value;
  }
  public resetOidcToken() {
    this._oidcToken = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get oidcTokenInput() {
    return this._oidcToken;
  }

  // oidc_token_file_path - computed: false, optional: true, required: false
  private _oidcTokenFilePath?: string;
  public get oidcTokenFilePath() {
    return this._oidcTokenFilePath;
  }
  public set oidcTokenFilePath(value: string | undefined) {
    this._oidcTokenFilePath = value;
  }
  public resetOidcTokenFilePath() {
    this._oidcTokenFilePath = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get oidcTokenFilePathInput() {
    return this._oidcTokenFilePath;
  }

  // partner_id - computed: false, optional: true, required: false
  private _partnerId?: string;
  public get partnerId() {
    return this._partnerId;
  }
  public set partnerId(value: string | undefined) {
    this._partnerId = value;
  }
  public resetPartnerId() {
    this._partnerId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get partnerIdInput() {
    return this._partnerId;
  }

  // skip_provider_registration - computed: false, optional: true, required: false
  private _skipProviderRegistration?: boolean | cdktf.IResolvable;
  public get skipProviderRegistration() {
    return this._skipProviderRegistration;
  }
  public set skipProviderRegistration(
    value: boolean | cdktf.IResolvable | undefined,
  ) {
    this._skipProviderRegistration = value;
  }
  public resetSkipProviderRegistration() {
    this._skipProviderRegistration = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get skipProviderRegistrationInput() {
    return this._skipProviderRegistration;
  }

  // subscription_id - computed: false, optional: true, required: false
  private _subscriptionId?: string;
  public get subscriptionId() {
    return this._subscriptionId;
  }
  public set subscriptionId(value: string | undefined) {
    this._subscriptionId = value;
  }
  public resetSubscriptionId() {
    this._subscriptionId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get subscriptionIdInput() {
    return this._subscriptionId;
  }

  // tenant_id - computed: false, optional: true, required: false
  private _tenantId?: string;
  public get tenantId() {
    return this._tenantId;
  }
  public set tenantId(value: string | undefined) {
    this._tenantId = value;
  }
  public resetTenantId() {
    this._tenantId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get tenantIdInput() {
    return this._tenantId;
  }

  // use_aks_workload_identity - computed: false, optional: true, required: false
  private _useAksWorkloadIdentity?: boolean | cdktf.IResolvable;
  public get useAksWorkloadIdentity() {
    return this._useAksWorkloadIdentity;
  }
  public set useAksWorkloadIdentity(
    value: boolean | cdktf.IResolvable | undefined,
  ) {
    this._useAksWorkloadIdentity = value;
  }
  public resetUseAksWorkloadIdentity() {
    this._useAksWorkloadIdentity = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get useAksWorkloadIdentityInput() {
    return this._useAksWorkloadIdentity;
  }

  // use_cli - computed: false, optional: true, required: false
  private _useCli?: boolean | cdktf.IResolvable;
  public get useCli() {
    return this._useCli;
  }
  public set useCli(value: boolean | cdktf.IResolvable | undefined) {
    this._useCli = value;
  }
  public resetUseCli() {
    this._useCli = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get useCliInput() {
    return this._useCli;
  }

  // use_msi - computed: false, optional: true, required: false
  private _useMsi?: boolean | cdktf.IResolvable;
  public get useMsi() {
    return this._useMsi;
  }
  public set useMsi(value: boolean | cdktf.IResolvable | undefined) {
    this._useMsi = value;
  }
  public resetUseMsi() {
    this._useMsi = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get useMsiInput() {
    return this._useMsi;
  }

  // use_oidc - computed: false, optional: true, required: false
  private _useOidc?: boolean | cdktf.IResolvable;
  public get useOidc() {
    return this._useOidc;
  }
  public set useOidc(value: boolean | cdktf.IResolvable | undefined) {
    this._useOidc = value;
  }
  public resetUseOidc() {
    this._useOidc = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get useOidcInput() {
    return this._useOidc;
  }

  // alias - computed: false, optional: true, required: false
  private _alias?: string;
  public get alias() {
    return this._alias;
  }
  public set alias(value: string | undefined) {
    this._alias = value;
  }
  public resetAlias() {
    this._alias = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get aliasInput() {
    return this._alias;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      auxiliary_tenant_ids: cdktf.listMapper(
        cdktf.stringToTerraform,
        false,
      )(this._auxiliaryTenantIds),
      client_certificate: cdktf.stringToTerraform(this._clientCertificate),
      client_certificate_password: cdktf.stringToTerraform(
        this._clientCertificatePassword,
      ),
      client_certificate_path: cdktf.stringToTerraform(
        this._clientCertificatePath,
      ),
      client_id: cdktf.stringToTerraform(this._clientId),
      client_id_file_path: cdktf.stringToTerraform(this._clientIdFilePath),
      client_secret: cdktf.stringToTerraform(this._clientSecret),
      client_secret_file_path: cdktf.stringToTerraform(
        this._clientSecretFilePath,
      ),
      custom_correlation_request_id: cdktf.stringToTerraform(
        this._customCorrelationRequestId,
      ),
      default_location: cdktf.stringToTerraform(this._defaultLocation),
      default_name: cdktf.stringToTerraform(this._defaultName),
      default_tags: cdktf.hashMapper(cdktf.stringToTerraform)(
        this._defaultTags,
      ),
      disable_correlation_request_id: cdktf.booleanToTerraform(
        this._disableCorrelationRequestId,
      ),
      disable_default_output: cdktf.booleanToTerraform(
        this._disableDefaultOutput,
      ),
      disable_instance_discovery: cdktf.booleanToTerraform(
        this._disableInstanceDiscovery,
      ),
      disable_terraform_partner_id: cdktf.booleanToTerraform(
        this._disableTerraformPartnerId,
      ),
      enable_preflight: cdktf.booleanToTerraform(this._enablePreflight),
      endpoint: cdktf.listMapper(
        azapiProviderEndpointToTerraform,
        false,
      )(this._endpoint),
      environment: cdktf.stringToTerraform(this._environment),
      ignore_no_op_changes: cdktf.booleanToTerraform(this._ignoreNoOpChanges),
      maximum_busy_retry_attempts: cdktf.numberToTerraform(
        this._maximumBusyRetryAttempts,
      ),
      oidc_azure_service_connection_id: cdktf.stringToTerraform(
        this._oidcAzureServiceConnectionId,
      ),
      oidc_request_token: cdktf.stringToTerraform(this._oidcRequestToken),
      oidc_request_url: cdktf.stringToTerraform(this._oidcRequestUrl),
      oidc_token: cdktf.stringToTerraform(this._oidcToken),
      oidc_token_file_path: cdktf.stringToTerraform(this._oidcTokenFilePath),
      partner_id: cdktf.stringToTerraform(this._partnerId),
      skip_provider_registration: cdktf.booleanToTerraform(
        this._skipProviderRegistration,
      ),
      subscription_id: cdktf.stringToTerraform(this._subscriptionId),
      tenant_id: cdktf.stringToTerraform(this._tenantId),
      use_aks_workload_identity: cdktf.booleanToTerraform(
        this._useAksWorkloadIdentity,
      ),
      use_cli: cdktf.booleanToTerraform(this._useCli),
      use_msi: cdktf.booleanToTerraform(this._useMsi),
      use_oidc: cdktf.booleanToTerraform(this._useOidc),
      alias: cdktf.stringToTerraform(this._alias),
    };
  }
}
