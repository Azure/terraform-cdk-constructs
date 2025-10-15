# AZAPI Provider Implementation

## Overview

The AZAPI resource implementation uses generated provider classes from the Terraform AZAPI provider to ensure type safety, IDE support, and automatic updates when the provider schema changes.

## Architecture

### Generated Provider Classes

The implementation leverages generated TypeScript classes created by `terraform get` from the AZAPI provider. These classes are copied from `.gen/providers/azapi` to `src/core-azure/lib/providers-azapi` to work within TypeScript compilation constraints.

### Core Implementation

#### AzapiResource Base Class

The [`AzapiResource`](../src/core-azure/lib/azapi-resource.ts) base class provides a type-safe foundation for all AZAPI-based resources:

```typescript
import { Resource, ResourceConfig } from "./providers-azapi/resource";

protected createAzapiResource(
  properties: Record<string, any>,
  parentId: string,
  name: string,
  location?: string,
): cdktf.TerraformResource {
  const config: ResourceConfig = {
    type: this.resourceType,
    name: name,
    parentId: parentId,
    body: JSON.stringify(properties),
    ...(location && !properties.location && { location: location }),
  };

  return new Resource(this, "resource", config);
}
```

#### Benefits

- **Type Safety**: Full TypeScript type checking at compile time
- **IDE Support**: Complete intellisense and auto-completion
- **Schema Validation**: Automatic validation from the Terraform provider
- **Update Friendly**: Automatic updates when running `terraform get`
- **Error Prevention**: Compile-time error detection vs runtime failures

### Resource Classes

#### AzapiRoleAssignment

Type-safe role assignment creation:

```typescript
const config: ResourceConfig = {
  type: "Microsoft.Authorization/roleAssignments",
  name: "[guid()]",
  parentId: props.scope,
  body: JSON.stringify(properties),
};

new Resource(this, "role-assignment", config);
```

#### AzapiDiagnosticSettings

Type-safe diagnostic settings configuration:

```typescript
const config: ResourceConfig = {
  type: "Microsoft.Insights/diagnosticSettings",
  name: props.name || "diagnostics",
  parentId: props.targetResourceId || "",
  body: JSON.stringify(properties),
};

new Resource(this, "diagnostic-settings", config);
```

## Provider Management

### Updating Providers

When the AZAPI provider is updated, regenerate and copy the provider classes(automatically done in the pipeline):

```bash
# Update providers
cdktf get

# Copy to source directory
cp -r .gen/providers/azapi src/core-azure/lib/providers-azapi
```

### Provider Configuration

The AZAPI provider version is specified in [`cdktf.json`](../cdktf.json):

```json
{
  "terraformProviders": ["Azure/azapi@~> 0.6.0"]
}
```

## Development Guidelines

### Creating New AZAPI Resources

1. **Extend AzapiResource**: Inherit from the base class
2. **Define Resource Type**: Set the Azure resource type (e.g., `"Microsoft.Resources/resourceGroups"`)
3. **Set API Version**: Specify the Azure API version (e.g., `"2024-03-01"`)
4. **Use Generated Classes**: Leverage the type-safe `ResourceConfig` interface

Example:

```typescript
export class MyAzapiResource extends AzapiResource {
  protected readonly resourceType = "Microsoft.MyService/myResource";
  protected readonly apiVersion = "2024-01-01";

  constructor(scope: Construct, id: string, props: MyResourceProps) {
    super(scope, id, props);

    const resourceBody = {
      location: props.location,
      properties: {
        // Azure-specific properties
      },
    };

    this.terraformResource = this.createAzapiResource(
      resourceBody,
      props.parentId,
      props.name,
      props.location,
    );
  }
}
```

### Testing

All AZAPI resources should include comprehensive tests:

```typescript
import { Testing, TerraformStack } from "cdktf";
import { MyAzapiResource } from "../my-resource";

describe("MyAzapiResource Tests", () => {
  it("should generate valid terraform configuration", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    new MyAzapiResource(stack, "test-resource", {
      // test props
    });

    const synth = Testing.synth(stack);
    const config = JSON.parse(synth);
    
    expect(config.resource.azapi_resource).toBeDefined();
  });
});
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure providers are copied to `src/core-azure/lib/providers-azapi`
2. **Type Errors**: Verify `ResourceConfig` properties match the expected schema
3. **Runtime Errors**: Check that the Azure resource type and API version are correct

### Debugging

Use the generated Terraform configuration to debug issues:

```typescript
const synth = Testing.synth(stack);
console.log(JSON.stringify(JSON.parse(synth), null, 2));
```

This shows the exact Terraform configuration that will be generated.

## Future Enhancements

### Additional Provider Types

The pattern can be extended to other AZAPI resource types:
- `azapi_resource_action` for resource actions
- `azapi_update_resource` for resource updates  
- `data.azapi_resource` for data sources

### Automation

Consider adding build automation to automatically copy providers:

```json
{
  "scripts": {
    "update-providers": "cdktf get && cp -r .gen/providers/azapi src/core-azure/lib/providers-azapi"
  }
}