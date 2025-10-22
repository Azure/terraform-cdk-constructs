# API Versioning and Migrations: User Guide

This guide explains how Azure API versioning and automatic migrations work in the terraform-cdk-constructs library. No technical knowledge of the internal framework is required—just follow these patterns to benefit from automatic version management.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Understanding API Versions](#understanding-api-versions)
3. [How Automatic Version Resolution Works](#how-automatic-version-resolution-works)
4. [Version Pinning for Stability](#version-pinning-for-stability)
5. [Understanding Deprecation Warnings](#understanding-deprecation-warnings)
6. [Migration Guidance](#migration-guidance)
7. [Frequently Asked Questions](#frequently-asked-questions)

---

## Quick Start

### Simple Example (Recommended for Most Users)

```typescript
import { ResourceGroup } from '@microsoft/terraform-cdk-constructs';
import { App, TerraformStack } from 'cdktf';

class MyStack extends TerraformStack {
  constructor(scope: App, name: string) {
    super(scope, name);
    
    // Just create your resource - version is handled automatically!
    const resourceGroup = new ResourceGroup(this, 'MyResourceGroup', {
      name: 'my-resource-group',
      location: 'eastus',
      tags: { environment: 'production' }
    });
  }
}
```

**That's it!** The framework automatically:
- ✅ Uses the latest stable Azure API version
- ✅ Validates your properties
- ✅ Warns you about upcoming changes
- ✅ Provides migration guidance when needed

---

## Understanding API Versions

### What Are API Versions?

Azure resources use versioned APIs (e.g., `2024-01-01`, `2024-11-01`). Each version may have:
- New features and properties
- Bug fixes and improvements
- Deprecated properties (to be removed)
- Breaking changes (incompatible changes)

### Version Lifecycle Phases

Every API version goes through these phases:

| Phase | What It Means | Should You Use It? |
|-------|---------------|-------------------|
| **ACTIVE** ✅ | Fully supported, receives new features | ✅ **Yes - Recommended** |
| **MAINTENANCE** ⚙️ | Bug fixes only, no new features | ✅ Yes, but consider upgrading soon |
| **DEPRECATED** ⚠️ | Migration recommended, limited support | ⚠️ Start planning migration |
| **SUNSET** 🚨 | End of life, will be removed | 🚨 **Migrate immediately** |

---

## How Automatic Version Resolution Works

### Default Behavior: Always Use Latest

When you **don't specify** an API version, the framework automatically uses the **latest ACTIVE version**:

```typescript
// No apiVersion specified → uses latest automatically
const storage = new StorageAccount(this, 'storage', {
  name: 'mystorageaccount',
  location: 'eastus',
  sku: { name: 'Standard_LRS' }
  // Framework will use 2024-01-01 (or whatever is latest)
});
```

**Benefits:**
- ✅ Always get the latest features
- ✅ Always get bug fixes
- ✅ No manual version updates needed
- ✅ Your code stays current as Azure evolves

### When Versions Change

When Azure releases a new API version (e.g., monthly updates):

1. **Next time you run `cdktf synth`**, your resources automatically use the new version
2. **You see console output** confirming the version being used
3. **No code changes required** unless there are breaking changes (see [Migration Guidance](#migration-guidance))

**Example Console Output:**
```
Registered 3 API versions for Microsoft.Storage/storageAccounts
✓ Using API version 2024-01-01 for mystorageaccount
```

---

## Version Pinning for Stability

### When to Pin Versions

Pin to a specific API version when you need:
- **Stability**: Production systems that should not change unexpectedly
- **Compliance**: Audit requirements for consistent infrastructure
- **Testing**: Ensuring test environments match production exactly
- **Controlled Upgrades**: Planning migrations during maintenance windows

### How to Pin a Version

Simply add the `apiVersion` property:

```typescript
const storage = new StorageAccount(this, 'storage', {
  apiVersion: '2023-05-01',  // Pinned to specific version
  name: 'mystorageaccount',
  location: 'eastus',
  sku: { name: 'Standard_LRS' }
});
```

**What Happens:**
- ✅ Your resource will **always** use `2023-05-01`
- ✅ New library versions won't change your API version
- ⚠️ You'll get warnings if the version becomes deprecated
- ℹ️ You control when to upgrade by changing the `apiVersion` value

---

## Understanding Deprecation Warnings

### What You'll See

When using an older API version, you'll see warnings during `cdktf synth`:

#### Warning: Deprecated Version

```
⚠️  API version 2023-05-01 for Microsoft.Storage/storageAccounts is deprecated.
    Consider upgrading to the latest version: 2024-01-01
    Support ends: 2024-12-31
    Migration guide: /docs/migration-guides/storage-2024-01-01.md
```

**What This Means:**
- ✅ Your code still works perfectly
- ⚠️ The version will eventually be removed
- ℹ️ You have time to plan your migration
- 📚 Documentation is available to help

#### Error: Sunset Version

```
🚨 API version 2023-01-01 for Microsoft.Storage/storageAccounts has reached sunset.
   Immediate migration to 2024-01-01 is required.
   This version will be removed in the next library update.
   Migration guide: /docs/migration-guides/storage-2024-01-01.md
```

**What This Means:**
- 🚨 Your code still works, but not for long
- 🚨 Update your code as soon as possible
- 🚨 The next library update may remove this version
- 📚 Follow the migration guide immediately

### Automatic Migration Analysis

When you use a deprecated or sunset version, the framework automatically:

1. **Analyzes the migration** from your current version to the latest
2. **Counts breaking changes** that will affect your code
3. **Estimates effort** required to migrate
4. **Provides guidance** on what needs to change

**Example Output:**
```
Migration from 2023-05-01 to 2024-01-01 analysis:
  • Breaking changes: 2
  • Estimated effort: Medium (4-8 hours)
  • Automatic upgrade: Partially possible
  
Breaking changes:
  1. Property 'accountType' renamed to 'sku.name'
  2. Property 'enableHttpsTrafficOnly' now required (was optional)

See migration guide for details: /docs/migration-guides/storage-2024-01-01.md
```

**You don't need to run any commands** - this happens automatically whenever you create a resource with an outdated version!

---

## Migration Guidance

### Step-by-Step Migration Process

#### 1. Review the Warning

When you see a deprecation warning, note:
- Current version you're using
- Target version recommended
- Support end date
- Link to migration guide

#### 2. Check the Migration Guide

Follow the link provided in the warning to see:
- Detailed list of changes
- Code examples showing before/after
- Properties that were renamed
- New required properties
- Recommended migration approach

#### 3. Test in Development

Before updating production:

```typescript
// Create a test stack with the new version
const testStorage = new StorageAccount(this, 'test-storage', {
  apiVersion: '2024-01-01',  // New version
  name: 'teststorageaccount',
  location: 'eastus',
  sku: { name: 'Standard_LRS' }  // Updated property name
});
```

#### 4. Update Your Code

Make the necessary changes identified in the migration guide:

```typescript
// Before (2023-05-01)
const storage = new StorageAccount(this, 'storage', {
  apiVersion: '2023-05-01',
  name: 'mystorageaccount',
  location: 'eastus',
  accountType: 'Standard_LRS',  // Old property name
  enableHttpsTrafficOnly: true
});

// After (2024-01-01)
const storage = new StorageAccount(this, 'storage', {
  apiVersion: '2024-01-01',
  name: 'mystorageaccount',
  location: 'eastus',
  sku: { name: 'Standard_LRS' },  // New property structure
  enableHttpsTrafficOnly: true  // Still supported
});
```

#### 5. Deploy and Verify

1. Run `cdktf synth` - confirm no warnings
2. Run `cdktf diff` - review planned changes
3. Deploy to test environment first
4. Verify everything works as expected
5. Deploy to production

### Migration Effort Levels

The framework estimates how long migration will take:

| Effort Level | Estimated Time | What It Means |
|--------------|----------------|---------------|
| **Low** | < 1 hour | Mostly automatic, minimal changes |
| **Medium** | 1-8 hours | Some property renames, minor updates |
| **High** | 1-3 days | Significant changes, testing needed |
| **Breaking** | > 3 days | Major refactoring required |

---

## Frequently Asked Questions

### Q: Do I need to specify an API version?

**A: No, not usually.** For most use cases, automatic version resolution is recommended. Only pin versions when you specifically need stability.

### Q: Will my code break when new API versions are released?

**A: No.** The framework only uses new versions that are marked as ACTIVE (stable). Breaking changes are clearly documented, and you get warnings with migration guidance.

### Q: How do I find out what API version I'm using?

**A: Check the console output** during `cdktf synth`. You can also access it in code:

```typescript
const storage = new StorageAccount(this, 'storage', { /* ... */ });
console.log(`Using API version: ${storage.resolvedApiVersion}`);
```

### Q: Can I turn off migration warnings?

**A: Yes**, but it's not recommended. Add `enableMigrationAnalysis: false`:

```typescript
const storage = new StorageAccount(this, 'storage', {
  apiVersion: '2023-05-01',
  enableMigrationAnalysis: false,  // Turns off warnings
  // ... other properties
});
```

### Q: What happens if I use an unsupported API version?

**A: You'll get a clear error** listing all supported versions:

```
Error: Unsupported API version '2022-01-01' for Microsoft.Storage/storageAccounts
Supported versions: 2023-05-01, 2024-01-01, 2024-11-01
```

### Q: How often do API versions change?

**A: It varies by service:**
- Some services: Monthly updates
- Most services: Quarterly updates
- Stable services: Yearly updates

The framework handles this automatically, so you don't need to track it manually.

### Q: What if a property I'm using gets removed?

**A: You'll get warnings well in advance:**

1. Property is marked deprecated (still works)
2. Warnings appear in console output
3. Migration guide explains alternatives
4. You have months to update before removal

### Q: Can I see all supported versions for a resource?

**A: Yes**, use the `supportedVersions()` method:

```typescript
const storage = new StorageAccount(this, 'storage', { /* ... */ });
console.log(`Supported versions: ${storage.supportedVersions().join(', ')}`);
// Output: Supported versions: 2023-05-01, 2024-01-01, 2024-11-01
```

### Q: How do I know if migration is automatic or manual?

**A: Check the migration analysis output:**

```
Automatic upgrade: Yes  ← Properties will be transformed automatically
Automatic upgrade: Partial  ← Some changes automatic, some manual
Automatic upgrade: No  ← Manual code changes required
```

---

## Best Practices

### ✅ DO:
- Use automatic version resolution for development and test environments
- Pin versions for production environments
- Read deprecation warnings and plan migrations
- Test migrations in non-production environments first
- Follow migration guides when updating versions

### ❌ DON'T:
- Ignore sunset warnings in production code
- Disable migration analysis without good reason
- Skip testing when migrating API versions
- Use deprecated versions for new projects
- Pin to old versions indefinitely

---

## Getting Help

### Resources

- **Migration Guides**: `/docs/migration-guides/` directory
- **API Coverage**: `/docs/api-coverage.md`
- **GitHub Issues**: Report problems or ask questions
- **Examples**: `/examples/` directory with version-specific examples

### Support Channels

1. **Check the migration guide** linked in warning messages
2. **Search existing GitHub issues** for similar problems
3. **Create a new issue** with your specific question
4. **Include console output** showing warnings/errors

---

## Summary

The versioning system is designed to **just work** with minimal effort from you:

1. **By default**, you get the latest stable API version automatically
2. **Warnings appear** when you need to update, with clear guidance
3. **Migration is guided** with effort estimates and documentation
4. **You control the timing** by pinning versions when needed

Focus on building your infrastructure—let the framework handle API version complexity!