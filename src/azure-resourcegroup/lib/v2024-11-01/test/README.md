# Azure Resource Group Tests

This directory contains comprehensive unit and integration tests for the Azure Resource Group construct using the AZAPI provider.

## Test Structure

### Unit Tests (`resource-group.spec.ts`)

The unit tests provide comprehensive coverage of the `Group` class functionality without requiring actual Azure deployments. They test:

#### Constructor and Basic Functionality
- Resource group creation with required and optional properties
- Default name generation
- Tag handling (empty tags, complex tag combinations)
- Terraform output creation

#### Properties and Methods
- ID format validation
- Resource ID property access
- Subscription ID extraction (including error handling)
- Tag management operations (`addTag`, `removeTag`)

#### Configuration Options
- Ignore changes filtering
- Various Azure regions validation
- Different tag combinations

#### AZAPI-Specific Features
- Correct resource type and API version usage
- Client config data source creation
- ManagedBy property handling in resource body

#### CDK Terraform Integration
- Terraform synthesis validation
- Logical ID overrides for outputs
- Resource configuration verification

### Integration Tests (`resource-group.integ.ts`)

The integration test performs actual Azure deployment to verify:

- Real-world deployment using AZAPI provider
- Resource creation and idempotency checking
- Proper cleanup after testing

## Running Tests

### Unit Tests Only
```bash
npm test -- --testMatch="**/resource-group.spec.ts"
```

### Integration Tests Only
```bash
npm run integration -- --testMatch="**/resource-group.integ.ts"
```

### All Resource Group Tests
```bash
npm test -- --testMatch="**/azure-resourcegroup/**/*.{spec,integ}.ts"
```

## Test Coverage

The current test suite achieves 97.43% statement coverage for the resource group implementation, covering:

- ✅ All constructor scenarios
- ✅ Property access and validation
- ✅ Tag management operations
- ✅ Error handling
- ✅ AZAPI-specific functionality
- ✅ Terraform synthesis and configuration
- ✅ Real-world deployment (integration test)

## AZAPI Migration Testing

These tests specifically validate the migration from AzureRM to AZAPI provider by ensuring:

1. **API Version Compliance**: Uses the correct API version (2024-11-01)
2. **Resource Type Accuracy**: Correctly specifies `Microsoft.Resources/resourceGroups`
3. **Provider Integration**: Properly integrates with AZAPI provider
4. **Data Source Dependencies**: Correctly uses `azapi_client_config` for subscription ID
5. **Resource Body Structure**: Matches Azure REST API schema requirements

## Environment Requirements

### Unit Tests
- Node.js runtime
- Jest testing framework
- No Azure credentials required

### Integration Tests
- Azure credentials configured (via CLI, service principal, or managed identity)
- Active Azure subscription
- Terraform installed
- AZAPI provider available

## Maintenance

When updating the resource group implementation:

1. Run unit tests first to catch any breaking changes
2. Update test cases if new functionality is added
3. Run integration tests to verify Azure deployment compatibility
4. Update this documentation if test structure changes

## Debugging

For test failures:

1. **Unit Test Failures**: Check for TypeScript compilation errors or logic issues
2. **Integration Test Failures**: Verify Azure credentials and permissions
3. **Synthesis Failures**: Check Terraform configuration generation
4. **Coverage Issues**: Add tests for any uncovered code paths