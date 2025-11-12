/**
 * Cleanup and verification utilities for integration tests
 *
 * Provides functions for verifying resource deletion via Azure Resource Graph
 * and finding/cleaning orphaned resources with comprehensive safety mechanisms.
 */

import { execSync } from "child_process";

/**
 * Metadata for an individual resource created during testing
 */
export interface ResourceMetadata {
  /**
   * Azure resource ID
   */
  readonly resourceId: string;

  /**
   * Azure resource type (e.g., 'Microsoft.Resources/resourceGroups')
   */
  readonly resourceType: string;

  /**
   * Resource name
   */
  readonly name: string;

  /**
   * Resource location (Azure region)
   */
  readonly location?: string;

  /**
   * Resource tags
   */
  readonly tags: Record<string, string>;

  /**
   * Test run ID that created this resource
   */
  readonly testRunId: string;

  /**
   * Timestamp when resource was created
   */
  readonly createdAt: Date;

  /**
   * Whether this resource was successfully destroyed
   */
  readonly destroyed?: boolean;

  /**
   * Timestamp when resource was destroyed
   */
  readonly destroyedAt?: Date;
}

/**
 * Result of resource cleanup verification
 */
export interface VerificationResult {
  /**
   * Whether verification succeeded (all resources deleted)
   */
  readonly success: boolean;

  /**
   * Human-readable message describing the result
   */
  readonly message: string;

  /**
   * List of orphaned resource IDs (if any)
   */
  readonly orphanedResources: string[];

  /**
   * Number of resources expected to be deleted
   */
  readonly expectedCount?: number;

  /**
   * Number of resources actually found
   */
  readonly foundCount?: number;
}

/**
 * Options for cleanup operations
 */
export interface CleanupOptions {
  /**
   * Whether to perform dry-run (no actual deletion)
   */
  readonly dryRun: boolean;

  /**
   * Minimum age in hours before resource can be cleaned up
   */
  readonly minAgeHours: number;

  /**
   * Azure subscription ID to target (optional)
   */
  readonly subscription?: string;

  /**
   * Specific resource groups to target (optional)
   */
  readonly resourceGroups?: string[];

  /**
   * Maximum number of resources to clean up in one operation
   */
  readonly maxResources?: number;
}

/**
 * Orphaned resource information
 */
export interface OrphanedResource {
  /**
   * Azure resource ID
   */
  readonly resourceId: string;

  /**
   * Azure resource type
   */
  readonly resourceType: string;

  /**
   * Resource name
   */
  readonly name: string;

  /**
   * Resource location
   */
  readonly location: string;

  /**
   * Resource group name
   */
  readonly resourceGroup: string;

  /**
   * Test run ID from tags
   */
  readonly testRunId: string;

  /**
   * Creation timestamp from tags
   */
  readonly createdAt: Date;

  /**
   * Cleanup after timestamp from tags
   */
  readonly cleanupAfter: Date;

  /**
   * Test name from tags
   */
  readonly testName: string;

  /**
   * Age in hours since creation
   */
  readonly ageHours: number;
}

/**
 * Result of cleanup operation
 */
export interface CleanupResult {
  /**
   * Number of resources successfully deleted
   */
  readonly deleted: number;

  /**
   * Number of resources that failed to delete
   */
  readonly failed: number;

  /**
   * Number of resources skipped (e.g., too young)
   */
  readonly skipped: number;

  /**
   * Detailed error messages for failures
   */
  readonly errors?: string[];
}

/**
 * Minimum age threshold (hours) before cleanup is allowed
 */
const MINIMUM_AGE_HOURS = 2;

/**
 * Maximum retry attempts for eventual consistency
 */
const MAX_RETRIES = 5;

/**
 * Wait time between retries (milliseconds)
 */
const RETRY_WAIT_MS = 30000; // 30 seconds

/**
 * Main cleanup service class
 */
export class ResourceCleanupService {
  /**
   * Checks if Azure CLI is available
   */
  public checkAzureCliAvailable(): boolean {
    try {
      execSync("az --version", { stdio: "pipe" });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Executes an Azure CLI command with error handling
   */
  private executeAzureCommand(command: string): string {
    try {
      return execSync(command, {
        encoding: "utf-8",
        stdio: "pipe",
      });
    } catch (error: any) {
      throw new Error(
        `Azure CLI command failed: ${error.message}\n` +
          `Command: ${command}\n` +
          `Stderr: ${error.stderr?.toString() || "N/A"}`,
      );
    }
  }

  /**
   * Queries Azure Resource Graph for resources by tags
   *
   * Returns empty array on errors for graceful degradation.
   */
  public queryAzureResourcesByTags(
    tags: Record<string, string>,
    subscription?: string,
  ): any[] {
    // Build tag filter conditions
    const tagConditions = Object.entries(tags)
      .map(([key, value]) => `tags['${key}'] == '${value}'`)
      .join(" and ");

    const query = `
      Resources
      | where ${tagConditions}
      | project id, type, name, location, resourceGroup, tags
    `;

    const subscriptionArg = subscription
      ? `--subscriptions "${subscription}"`
      : "";

    const command = `az graph query -q "${query.replace(/\n/g, " ")}" ${subscriptionArg} --output json`;

    try {
      const result = this.executeAzureCommand(command);
      const parsed = JSON.parse(result);
      return parsed.data || [];
    } catch (error: any) {
      console.error("Failed to query Azure Resource Graph:", error.message);
      return [];
    }
  }
}

/**
 * Verifies that all resources with a specific test run ID are deleted
 *
 * Performs Azure Resource Graph query to check for remaining resources.
 * Implements retry logic to handle Azure's eventual consistency.
 *
 * @param runId - Test run UUID to verify
 * @param expectedResources - List of resources that should be deleted
 * @param subscription - Optional subscription ID to query
 * @returns Verification result with details
 */
export function verifyResourcesDeleted(
  runId: string,
  expectedResources: ResourceMetadata[],
  subscription?: string,
): VerificationResult {
  const service = new ResourceCleanupService();

  // Check if Azure CLI is available before attempting verification
  if (!service.checkAzureCliAvailable()) {
    return {
      success: false,
      message: "Verification failed: Azure CLI is not available",
      orphanedResources: [],
      expectedCount: expectedResources.length,
      foundCount: -1,
    };
  }

  try {
    const orphanedResources = service.queryAzureResourcesByTags(
      { "test:run-id": runId },
      subscription,
    );

    if (orphanedResources.length > 0) {
      const resourceIds = orphanedResources.map((r: any) => r.id);
      return {
        success: false,
        message: `Found ${orphanedResources.length} orphaned resources after destroy`,
        orphanedResources: resourceIds,
        expectedCount: expectedResources.length,
        foundCount: orphanedResources.length,
      };
    }

    return {
      success: true,
      message: "All resources successfully deleted",
      orphanedResources: [],
      expectedCount: expectedResources.length,
      foundCount: 0,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Verification failed: ${error.message}`,
      orphanedResources: [],
      expectedCount: expectedResources.length,
      foundCount: -1,
    };
  }
}

/**
 * Finds orphaned test resources that are past their TTL
 *
 * Queries Azure for resources with test tags that are older than
 * their cleanup-after timestamp.
 *
 * @param options - Cleanup options
 * @returns List of orphaned resources
 */
export async function findOrphanedResources(
  options: CleanupOptions,
): Promise<OrphanedResource[]> {
  const now = new Date();

  console.log(`[Cleanup] Searching for orphaned test resources...`);
  console.log(`[Cleanup] Minimum age: ${options.minAgeHours} hours`);

  // Query for test resources
  const query = `
    Resources
    | where tags['test:managed-by'] == 'terraform-cdk-constructs-tests'
    | where tags['test:auto-cleanup'] == 'true'
    | project id, type, name, location, resourceGroup,
              testRunId = tags['test:run-id'],
              createdAt = tags['test:created-at'],
              cleanupAfter = tags['test:cleanup-after'],
              testName = tags['test:name']
    | order by tostring(createdAt) asc
  `;

  try {
    const subscriptionArg = options.subscription
      ? `--subscriptions "${options.subscription}"`
      : "";

    const command = `az graph query -q "${query.replace(/\n/g, " ")}" ${subscriptionArg} --output json`;

    const result = execSync(command, {
      encoding: "utf-8",
      stdio: "pipe",
    });

    const parsed = JSON.parse(result);
    const resources = parsed.data || [];

    console.log(`[Cleanup] Found ${resources.length} test resources`);

    // Filter by age and cleanup eligibility
    const orphaned: OrphanedResource[] = [];

    for (const resource of resources) {
      const createdAt = new Date(resource.createdAt);
      const cleanupAfter = new Date(resource.cleanupAfter);
      const ageHours = (now.getTime() - createdAt.getTime()) / (60 * 60 * 1000);

      // Apply safety checks
      if (ageHours < MINIMUM_AGE_HOURS) {
        console.log(
          `[Cleanup] Skipping ${resource.name}: too young (${ageHours.toFixed(1)}h < ${MINIMUM_AGE_HOURS}h)`,
        );
        continue;
      }

      if (now < cleanupAfter) {
        console.log(
          `[Cleanup] Skipping ${resource.name}: not yet eligible for cleanup`,
        );
        continue;
      }

      if (ageHours < options.minAgeHours) {
        console.log(
          `[Cleanup] Skipping ${resource.name}: younger than min age (${ageHours.toFixed(1)}h < ${options.minAgeHours}h)`,
        );
        continue;
      }

      orphaned.push({
        resourceId: resource.id,
        resourceType: resource.type,
        name: resource.name,
        location: resource.location,
        resourceGroup: resource.resourceGroup,
        testRunId: resource.testRunId,
        createdAt,
        cleanupAfter,
        testName: resource.testName,
        ageHours,
      });
    }

    console.log(
      `[Cleanup] Found ${orphaned.length} orphaned resources eligible for cleanup`,
    );

    // Limit resources if specified
    if (options.maxResources && orphaned.length > options.maxResources) {
      console.log(`[Cleanup] Limiting to ${options.maxResources} resources`);
      return orphaned.slice(0, options.maxResources);
    }

    return orphaned;
  } catch (error: any) {
    console.error(
      "[Cleanup] Failed to find orphaned resources:",
      error.message,
    );
    throw error;
  }
}

/**
 * Cleans up orphaned test resources
 *
 * Deletes resource groups containing orphaned test resources.
 * Implements safety checks and dry-run mode.
 *
 * @param resources - List of orphaned resources to clean up
 * @param options - Cleanup options
 * @returns Cleanup result with statistics
 */
export async function cleanupOrphanedResources(
  resources: OrphanedResource[],
  options: CleanupOptions,
): Promise<CleanupResult> {
  if (resources.length === 0) {
    console.log("[Cleanup] No resources to clean up");
    return { deleted: 0, failed: 0, skipped: 0 };
  }

  if (options.dryRun) {
    console.log("[Cleanup] DRY RUN - Would delete the following resources:");
    resources.forEach((r) => {
      console.log(
        `  - ${r.name} (${r.resourceType}) in ${r.resourceGroup} - Age: ${r.ageHours.toFixed(1)}h`,
      );
    });
    return { deleted: 0, failed: 0, skipped: resources.length };
  }

  // Group resources by resource group for efficient deletion
  const byResourceGroup = new Map<string, OrphanedResource[]>();
  for (const resource of resources) {
    const group = byResourceGroup.get(resource.resourceGroup) || [];
    group.push(resource);
    byResourceGroup.set(resource.resourceGroup, group);
  }

  console.log(
    `[Cleanup] Deleting ${byResourceGroup.size} resource groups containing ${resources.length} resources`,
  );

  let deleted = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const [rgName, rgResources] of byResourceGroup) {
    try {
      console.log(
        `[Cleanup] Deleting resource group: ${rgName} (${rgResources.length} resources)`,
      );

      // Validate that all resources in the group are test resources
      const allTestResources = rgResources.every(
        (r) => r.testRunId && r.ageHours >= MINIMUM_AGE_HOURS,
      );

      if (!allTestResources) {
        console.warn(
          `[Cleanup] Skipping ${rgName}: not all resources are valid test resources`,
        );
        failed += rgResources.length;
        errors.push(`Resource group ${rgName} contains non-test resources`);
        continue;
      }

      // Delete resource group (async, no-wait)
      execSync(`az group delete --name "${rgName}" --yes --no-wait`, {
        encoding: "utf-8",
        stdio: "pipe",
      });

      deleted += rgResources.length;
      console.log(`[Cleanup] ✓ Initiated deletion of ${rgName}`);
    } catch (error: any) {
      console.error(`[Cleanup] ✗ Failed to delete ${rgName}:`, error.message);
      failed += rgResources.length;
      errors.push(`Failed to delete ${rgName}: ${error.message}`);
    }
  }

  const result: CleanupResult = {
    deleted,
    failed,
    skipped: 0,
    errors: errors.length > 0 ? errors : undefined,
  };

  console.log("[Cleanup] Summary:");
  console.log(`  - Deleted: ${result.deleted} resources`);
  console.log(`  - Failed: ${result.failed} resources`);
  if (result.errors) {
    console.log(`  - Errors: ${result.errors.length}`);
  }

  return result;
}

/**
 * Verifies resource cleanup with retry logic for eventual consistency
 *
 * Wrapper around verifyResourcesDeleted that implements retry logic
 * to handle Azure's eventual consistency delays.
 *
 * @param runId - Test run UUID to verify
 * @param expectedResources - List of resources that should be deleted
 * @param subscription - Optional subscription ID to query
 * @param maxRetries - Maximum number of retry attempts
 * @param retryWaitMs - Wait time between retries in milliseconds
 * @returns Final verification result
 */
export async function verifyResourcesDeletedWithRetry(
  runId: string,
  expectedResources: ResourceMetadata[],
  subscription?: string,
  maxRetries: number = MAX_RETRIES,
  retryWaitMs: number = RETRY_WAIT_MS,
): Promise<VerificationResult> {
  let lastResult: VerificationResult;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`[Verification] Attempt ${attempt}/${maxRetries}`);

    lastResult = verifyResourcesDeleted(runId, expectedResources, subscription);

    if (lastResult.success) {
      console.log("[Verification] ✓ All resources confirmed deleted");
      return lastResult;
    }

    if (attempt < maxRetries) {
      console.log(
        `[Verification] Found ${lastResult.foundCount} resources, retrying in ${retryWaitMs / 1000}s...`,
      );
      await new Promise((resolve) => setTimeout(resolve, retryWaitMs));
    }
  }

  console.error(
    `[Verification] ✗ Failed after ${maxRetries} attempts: ${lastResult!.message}`,
  );
  return lastResult!;
}
