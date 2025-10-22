# AZAPI Testing Architecture Guide

This document describes the comprehensive testing architecture for AZAPI-based Azure resources, including versioning strategies, integration test management, and patterns for adding new API versions.

## Overview

The AZAPI testing architecture provides:
- **Unit tests** for all API versions to ensure functionality
- **Integration tests** only for the latest API version to avoid conflicts and reduce test time
- **Cross-version compatibility tests** to ensure basic functionality consistency
- **Version management tests** for utility functions
- **Error handling and edge case tests** across all versions
- **Automatic test skipping** for older versions when new versions are added

## Architecture Principles

### 1. Version-Based Structure
Each Azure resource using AZAPI follows a consistent versioned structure that allows for:
- API evolution with version-specific props and behavior
- Independent testing of each API version
- Automatic integration test management
- Backward compatibility maintenance

### 2. Test Separation
- **Unit Tests**: Run for all versions to ensure functionality
- **Integration Tests**: Run only for the latest version to prevent conflicts
- **Utility Tests**: Test version management and cross-version compatibility

### 3. Automatic Version Management
Integration tests automatically enable/disable based on the latest version configuration, reducing manual maintenance when adding new API versions.

## Directory Structure Template

For any Azure resource (`{resource-name}`), follow this structure:

```
src/azure-{resource-name}/azapi/
├── v{version-1}/                       # e.g., v2024-01-01
│   ├── index.ts                        # Export main resource class
│   ├── props.ts                        # Props and body interfaces
│   ├── {resource-class}.ts             # Resource implementation
│   └── test/
│       ├── {ResourceClass}.spec.ts    # Unit tests
│       └── {ResourceClass}.integ.ts   # Integration tests (auto-skipped if not latest)
├── v{version-2}/                       # e.g., v2024-03-01
│   └── test/
│       ├── {ResourceClass}.spec.ts
│       └── {ResourceClass}.integ.ts
├── latest/
│   └── index.ts                        # Points to latest version
├── versions.ts                         # Version management utilities
└── test/
    ├── versions.spec.ts                # Version utility tests
    ├── cross-version.spec.ts           # Cross-version compatibility
    ├── error-handling.spec.ts          # Error scenarios and edge cases
    ├── azapi-utils.ts                  # Resource-specific test utilities
    └── README.md                       # Resource-specific testing notes
```

## Core Components

### 1. Version Management (`versions.ts`)

Every AZAPI resource must include version management utilities:

```typescript
/**
 * Supported API versions for Azure {Resource}
 */
export enum {Resource}Version {
  V2024_01_01 = "2024-01-01",
  V2024_03_01 = "2024-03-01",
  V2024_07_01 = "2024-07-01", 
  V2024_11_01 = "2024-11-01",
  LATEST = "latest",
}

/**
 * Get the latest supported API version
 */
export function getLatest{Resource}Version(): string {
  return {Resource}Version.V2024_11_01; // Update when adding new versions
}

/**
 * Get all supported API versions
 */
export function getSupported{Resource}Versions(): string[] {
  return [
    {Resource}Version.V2024_01_01,
    {Resource}Version.V2024_03_01,
    {Resource}Version.V2024_07_01,
    {Resource}Version.V2024_11_01,
  ];
}

/**
 * Resolve version string to actual API version
 */
export function resolve{Resource}Version(version: string): string {
  if (version === {Resource}Version.LATEST) {
    return getLatest{Resource}Version();
  }
  return version;
}

/**
 * Check if a version is supported
 */
export function is{Resource}VersionSupported(version: string): boolean {
  if (version === {Resource}Version.LATEST) {
    return true;
  }
  return getSupported{Resource}Versions().includes(version);
}
```

### 2. Integration Test Version Gating

Each integration test file must include version gating to ensure only the latest version runs:

```typescript
import { getLatest{Resource}Version } from "../../versions";

// Only run integration tests for the latest version
const CURRENT_VERSION = "2024-11-01"; // This version's API version
const IS_LATEST_VERSION = getLatest{Resource}Version() === CURRENT_VERSION;
const describeIfLatest = IS_LATEST_VERSION ? describe : describe.skip;

describeIfLatest("AZAPI {Resource} v2024-11-01 Integration Tests", () => {
  // Integration tests only run if this is the latest version
  let stack: TerraformStack;
  let fullSynthResult: any;
  const streamOutput = process.env.STREAM_OUTPUT !== "false";

  beforeEach(() => {
    // Test setup
  });

  afterEach(() => {
    try {
      TerraformDestroy(fullSynthResult, streamOutput);
    } catch (error) {
      console.error("Error during Terraform destroy:", error);
    }
  });

  it("should deploy {Resource} successfully", () => {
    TerraformApplyAndCheckIdempotency(fullSynthResult, streamOutput);
  });
});
```

### 3. Unit Test Structure

Unit tests should cover all versions and follow this template:

```typescript
import { Testing, TerraformStack } from "cdktf";
import { {ResourceClass} } from "../{resource-file}";
import { TerraformPlan } from "../../../../testing";
import "cdktf/lib/testing/adapters/jest";

describe("AZAPI {Resource} v{version} Unit Tests", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");
  });

  describe("Basic Resource Creation", () => {
    beforeEach(() => {
      new {ResourceClass}(stack, "test{Resource}", {
        // Minimal required props
        location: "eastus",
      });
      fullSynthResult = Testing.fullSynth(stack);
    });

    it("renders resource with minimal configuration and checks snapshot", () => {
      expect(Testing.synth(stack)).toMatchSnapshot();
    });

    it("produces valid terraform configuration", () => {
      expect(fullSynthResult).toBeValidTerraform();
    });

    it("can be planned", () => {
      TerraformPlan(fullSynthResult);
    });
  });

  describe("Resource Properties and Methods", () => {
    it("should have correct API version", () => {
      const resource = new {ResourceClass}(stack, "testResource", {
        location: "eastus",
      });
      expect((resource as any).apiVersion).toBe("{version}");
    });

    it("should have correct resource type", () => {
      const resource = new {ResourceClass}(stack, "testResource", {
        location: "eastus",
      });
      expect((resource as any).resourceType).toBe("Microsoft.{Provider}/{resourceType}");
    });

    // Add resource-specific method tests
  });

  describe("Edge Cases and Error Handling", () => {
    // Add version-specific edge case tests
  });
});
```

## Test Categories

### 1. Unit Tests (*.spec.ts)

**Purpose**: Test individual version functionality, props validation, and method behavior.

**Coverage**:
- Basic resource creation with minimal and full configuration
- Props validation and default handling
- Method testing (resource-specific methods)
- API version and resource type validation
- Terraform configuration validation
- Snapshot testing for configuration consistency
- Edge cases and error handling

### 2. Integration Tests (*.integ.ts)

**Purpose**: Test real Azure deployment and resource lifecycle.

**Behavior**: Only the latest version runs integration tests using version gating.

**Coverage**:
- Real Azure resource deployment
- Resource lifecycle management (create, update, delete)
- Idempotency verification
- Multiple deployment scenarios
- Advanced configuration testing

### 3. Cross-Version Compatibility Tests

**Purpose**: Ensure basic functionality consistency across versions.

**Coverage**:
- Basic property acceptance across versions
- Method consistency where applicable
- API version validation
- Resource type consistency
- Terraform configuration structure validation

### 4. Version Management Tests

**Purpose**: Test version utility functions and resolution logic.

**Coverage**:
- Version enumeration validation
- Latest version resolution
- Supported versions list
- Version format validation
- Edge case handling

### 5. Error Handling and Edge Cases

**Purpose**: Test error scenarios and resilience across versions.

**Coverage**:
- Invalid props handling
- Edge case scenarios
- Performance considerations
- Cross-version error consistency

## Adding a New API Version

### Step-by-Step Process

#### 1. Update Version Management

Add the new version to `versions.ts`:

```typescript
export enum {Resource}Version {
  // Existing versions...
  V2025_01_01 = "2025-01-01", // New version
  LATEST = "latest",
}

export function getLatest{Resource}Version(): string {
  return {Resource}Version.V2025_01_01; // Update to new latest
}

export function getSupported{Resource}Versions(): string[] {
  return [
    // Existing versions...
    {Resource}Version.V2025_01_01, // Add new version
  ];
}
```

#### 2. Create Version Implementation

Create new version directory:
```
v2025-01-01/
├── index.ts
├── props.ts
├── {resource-class}.ts
└── test/
    ├── {ResourceClass}.spec.ts
    └── {ResourceClass}.integ.ts
```

#### 3. Implement Resource Class

Follow the existing pattern but update for new API version features:

```typescript
export class {ResourceClass} extends AzapiResource {
  protected readonly resourceType = "Microsoft.{Provider}/{resourceType}";
  protected readonly apiVersion = "2025-01-01"; // New API version
  
  // Implementation specific to this API version
}
```

#### 4. Create Tests

Copy and modify tests from the previous latest version:

**Unit Test**:
```typescript
describe("AZAPI {Resource} v2025-01-01 Unit Tests", () => {
  it("should have correct API version", () => {
    expect((resource as any).apiVersion).toBe("2025-01-01");
  });
  
  // Add tests for new API version features
});
```

**Integration Test**:
```typescript
const CURRENT_VERSION = "2025-01-01"; // Update to new version
const IS_LATEST_VERSION = getLatest{Resource}Version() === CURRENT_VERSION;
```

#### 5. Update Latest Reference

Update `latest/index.ts`:
```typescript
export * from "../v2025-01-01"; // Point to new version
```

### Automatic Test Management

After adding v2025-01-01:
- ✅ **v2025-01-01 integration tests**: Run (latest version)
- ⏭️ **All older integration tests**: Automatically skipped
- ✅ **All unit tests**: Continue to run for all versions
- ✅ **Utility tests**: Continue to run and validate new version

## Best Practices

### 1. Version-Specific Development
- Each version can have unique props and behavior
- Document version-specific changes in props interfaces
- Test version-specific features thoroughly in unit tests
- Use integration tests only for comprehensive scenarios

### 2. Cross-Version Considerations
- Maintain basic functionality compatibility where possible
- Test core behavior consistency across versions
- Allow for API evolution and breaking changes
- Document breaking changes clearly

### 3. Integration Test Management
- Always use version gating for integration tests
- Include comprehensive cleanup in `afterEach` hooks
- Use random names to avoid resource conflicts
- Test realistic scenarios with proper error handling

### 4. Test Utilities
- Create resource-specific test utilities
- Reuse common patterns across versions
- Validate AZAPI-specific configuration
- Provide helpers for mock data generation

### 5. Maintenance Guidelines
- Update version management when adding new versions
- Verify older integration tests are properly skipped
- Maintain backwards compatibility where possible
- Keep test documentation current

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only  
```bash
npm test -- --testMatch="**/*.spec.ts"
```

### Integration Tests Only
```bash
npm run integration
```

### Specific Resource Tests
```bash
npm test -- --testMatch="**/azure-{resource-name}/**/*.spec.ts"
```

### Specific Version Tests
```bash
npm test -- --testMatch="**/v2024-11-01/**/*.spec.ts"
```

## Configuration Requirements

### TypeScript Configuration

Ensure `tsconfig.dev.json` includes AZAPI test directories:

```json
{
  "include": [
    "src/**/*.ts",
    "src/**/test/**/*.ts", 
    "src/azure-*/azapi/**/*.ts"
  ]
}
```

### Jest Configuration

The existing Jest configuration should automatically pick up AZAPI tests through the patterns:
- `**/*.spec.ts` for unit tests
- `**/*.integ.ts` for integration tests

## Troubleshooting

### Integration Tests Not Skipping
- Verify `getLatest{Resource}Version()` returns expected version
- Check `CURRENT_VERSION` constant matches directory version
- Ensure `describeIfLatest` is used instead of `describe`

### Version Management Issues
- Validate version enum values match directory names
- Check supported versions list includes all versions
- Verify latest version function returns correct value

### Test Conflicts
- Use random names in integration tests
- Implement proper cleanup in `afterEach` hooks
- Ensure only latest version runs integration tests

### ESLint/TypeScript Errors
- Update `tsconfig.dev.json` to include test paths
- Verify import paths are correct
- Check that version utility imports are accessible

## Resource-Specific Adaptations

When implementing this architecture for different Azure resources:

1. **Replace placeholders**: Update `{resource-name}`, `{ResourceClass}`, `{Provider}`, etc.
2. **Adapt resource types**: Use correct Azure resource type (e.g., "Microsoft.Storage/storageAccounts")
3. **Customize props**: Define resource-specific properties and validation
4. **Add resource methods**: Implement resource-specific functionality
5. **Create utilities**: Build resource-specific test utilities and helpers
6. **Document differences**: Note any resource-specific testing considerations

This architecture provides a consistent, maintainable, and scalable approach to testing AZAPI-based Azure resources across multiple API versions while minimizing conflicts and maintenance overhead.