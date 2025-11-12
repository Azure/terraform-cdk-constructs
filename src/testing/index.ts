import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as cdktf from "cdktf";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { ResourceMetadata, verifyResourcesDeleted } from "./lib/cleanup";
import { TestRunMetadata, TestRunOptions } from "./lib/metadata";
import { generateResourceName } from "./lib/naming";

// Re-export types used in public APIs for jsii compliance
export { TestRunOptions, TestRunMetadata, CIContext } from "./lib/metadata";

/**
 * Options for BaseTestStack constructor
 */
export interface BaseTestStackOptions {
  /**
   * Test run configuration options
   */
  readonly testRunOptions?: TestRunOptions;
}

/**
 * Base stack for integration tests with optional metadata support
 *
 * When metadata is enabled, automatically generates unique test run IDs,
 * injects system tags, and provides utilities for resource naming.
 */
export class BaseTestStack extends TerraformStack {
  public readonly name: string;

  /**
   * Optional test run metadata (only present when using BaseTestStackOptions)
   */
  public readonly metadata?: TestRunMetadata;

  /**
   * Registry of resources created in this stack for tracking and cleanup verification
   */
  private readonly resourceRegistry: Map<string, ResourceMetadata> = new Map();

  constructor(scope: Construct, id: string, options?: BaseTestStackOptions) {
    super(scope, id);

    // Generate metadata if options are provided
    if (options?.testRunOptions) {
      this.metadata = new TestRunMetadata(id, options.testRunOptions);

      // Log test run information
      console.log(`[Test Run] ID: ${this.metadata.runId}`);
      console.log(`[Test Run] Name: ${this.metadata.testName}`);
      console.log(
        `[Test Run] Created: ${this.metadata.createdAt.toISOString()}`,
      );
      console.log(
        `[Test Run] Cleanup After: ${this.metadata.cleanupAfter.toISOString()}`,
      );
      if (this.metadata.ciContext) {
        console.log(
          `[Test Run] CI Platform: ${this.metadata.ciContext.platform}`,
        );
      }
    }

    const name = new cdktf.TerraformVariable(this, "name", {
      type: "string",
      default: this.metadata?.testName || "test",
      description: "System name used to randomize the resources",
    });

    this.name = name.value;
  }

  /**
   * Registers a resource for tracking and cleanup verification
   *
   * @param resourceId - Azure resource ID
   * @param resourceType - Azure resource type
   * @param name - Resource name
   * @param location - Optional resource location
   * @param tags - Optional resource tags
   */
  public registerResource(
    resourceId: string,
    resourceType: string,
    name: string,
    location?: string,
    tags?: Record<string, string>,
  ): void {
    if (!this.metadata) {
      console.warn(
        "[BaseTestStack] Resource registration requires metadata. " +
          "Initialize with testRunOptions to enable resource tracking.",
      );
      return;
    }

    const metadata: ResourceMetadata = {
      resourceId,
      resourceType,
      name,
      location,
      tags: tags || {},
      testRunId: this.metadata.runId,
      createdAt: this.metadata.createdAt,
    };

    this.resourceRegistry.set(resourceId, metadata);
    console.log(
      `[BaseTestStack] Registered resource: ${name} (${resourceType})`,
    );
  }

  /**
   * Retrieves all registered resources
   *
   * @returns Array of registered resource metadata
   */
  public registeredResources(): ResourceMetadata[] {
    return Array.from(this.resourceRegistry.values());
  }

  /**
   * Generates system tags for resources (only available when metadata is present)
   *
   * @returns Integration test system tags
   * @throws Error if metadata is not initialized
   */
  public systemTags(): Record<string, string> {
    if (!this.metadata) {
      throw new Error(
        "System tags are only available when BaseTestStack is initialized with testRunOptions. " +
          "Pass { testRunOptions: {} } to the constructor to enable metadata.",
      );
    }
    return this.metadata.generateSystemTags();
  }

  /**
   * Generates a unique resource name with proper Azure compliance
   *
   * @param resourceType - Azure resource type (e.g., 'Microsoft.Resources/resourceGroups')
   * @param customIdentifier - Optional custom identifier (defaults to test name)
   * @returns Unique, Azure-compliant resource name
   * @throws Error if metadata is not initialized
   *
   * @example
   * const stack = new BaseTestStack(app, 'test-storage', { testRunOptions: {} });
   * const rgName = stack.generateResourceName('Microsoft.Resources/resourceGroups');
   * // Returns: 'rg-test-storage-a1b2c3'
   */
  public generateResourceName(
    resourceType: string,
    customIdentifier?: string,
  ): string {
    if (!this.metadata) {
      throw new Error(
        "Resource name generation is only available when BaseTestStack is initialized with testRunOptions. " +
          "Pass { testRunOptions: {} } to the constructor to enable metadata.",
      );
    }

    return generateResourceName({
      resourceType,
      testName: this.metadata.testName,
      runId: this.metadata.runId,
      customIdentifier,
    });
  }
}

export function execTerraformCommand(
  command: string,
  opts: ExecSyncOptionsWithStringEncoding,
  streamOutput: boolean,
): { stdout: string; stderr: string; exitCode: number } {
  try {
    if (streamOutput) {
      execSync(command, { ...opts, stdio: "inherit" });
      return { stdout: "", stderr: "", exitCode: 0 };
    } else {
      const stdout = execSync(command, { ...opts, stdio: "pipe" }).toString();
      return { stdout, stderr: "", exitCode: 0 };
    }
  } catch (error: any) {
    const stdout = error.stdout ? error.stdout.toString() : "";
    const stderr = error.stderr ? error.stderr.toString() : "";
    return { stdout, stderr, exitCode: error.status || 1 };
  }
}

export function TerraformApply(
  stack: any,
  streamOutput: boolean = false,
): { stdout: string; stderr: string; error: any } {
  try {
    const manifestPath = path.resolve(stack, "manifest.json");

    // Safety check: verify manifest exists before reading
    if (!fs.existsSync(manifestPath)) {
      throw new Error(
        `Manifest file not found at ${manifestPath}. ` +
          `Ensure Testing.fullSynth() completed successfully and the output directory still exists.`,
      );
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const stacks = Object.entries(manifest.stacks);

    for (const [, stackDetails] of stacks) {
      const opts: ExecSyncOptionsWithStringEncoding = {
        cwd: path.resolve(stack, (stackDetails as any).workingDirectory),
        env: process.env,
        encoding: "utf-8",
      };

      const initResult = execTerraformCommand(
        `terraform init`,
        opts,
        streamOutput,
      );
      if (initResult.exitCode !== 0)
        throw new Error(
          `Terraform init failed: ${initResult.stdout} ${initResult.stderr}`,
        );

      const applyResult = execTerraformCommand(
        `terraform apply -auto-approve`,
        opts,
        streamOutput,
      );
      if (applyResult.exitCode !== 0) {
        return {
          stdout: applyResult.stdout,
          stderr: applyResult.stderr,
          error: new Error(
            `Terraform apply failed: ${applyResult.stdout} ${applyResult.stderr}`,
          ),
        };
      }
    }

    return { stdout: "Terraform apply succeeded", stderr: "", error: null };
  } catch (error: any) {
    console.error("Error during Terraform init or apply:", error);
    return { stdout: "", stderr: "", error };
  }
}

export function TerraformPlanExitCode(
  stack: any,
  streamOutput: boolean = false,
): { stdout: string; stderr: string; exitCode: number; error: any } {
  try {
    const manifestPath = path.resolve(stack, "manifest.json");

    // Safety check: verify manifest exists before reading
    if (!fs.existsSync(manifestPath)) {
      throw new Error(
        `Manifest file not found at ${manifestPath}. ` +
          `Ensure Testing.fullSynth() completed successfully and the output directory still exists.`,
      );
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const stacks = Object.entries(manifest.stacks);

    for (const [, stackDetails] of stacks) {
      const opts: ExecSyncOptionsWithStringEncoding = {
        cwd: path.resolve(stack, (stackDetails as any).workingDirectory),
        env: process.env,
        encoding: "utf-8",
      };

      const initResult = execTerraformCommand(
        `terraform init`,
        opts,
        streamOutput,
      );
      if (initResult.exitCode !== 0)
        throw new Error(
          `Terraform init failed: ${initResult.stdout} ${initResult.stderr}`,
        );

      const planResult = execTerraformCommand(
        `terraform plan -input=false -lock=false -detailed-exitcode`,
        opts,
        streamOutput,
      );
      return {
        stdout: planResult.stdout,
        stderr: planResult.stderr,
        exitCode: planResult.exitCode,
        error: null,
      };
    }

    return {
      stdout: "Terraform plan succeeded",
      stderr: "",
      exitCode: 0,
      error: null,
    };
  } catch (error: any) {
    console.error("Error during Terraform init or plan:", error);
    return { stdout: "", stderr: "", exitCode: 1, error };
  }
}
export function TerraformIdempotentCheck(stack: any): AssertionReturn {
  try {
    const manifestPath = path.resolve(stack, "manifest.json");

    // Safety check: verify manifest exists before reading
    if (!fs.existsSync(manifestPath)) {
      throw new Error(
        `Manifest file not found at ${manifestPath}. ` +
          `Ensure Testing.fullSynth() completed successfully and the output directory still exists.`,
      );
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const stacks = Object.entries(manifest.stacks);

    for (const [, stackDetails] of stacks) {
      const opts = {
        cwd: path.resolve(stack, (stackDetails as any).workingDirectory),
        env: process.env,
        stdio: "pipe",
      } as any;

      execSync(`terraform init`, opts);

      let planOutput: string;
      try {
        planOutput = execSync(
          `terraform plan -input=false -detailed-exitcode`,
          opts,
        ).toString();
      } catch (error: any) {
        planOutput = error.stdout ? error.stdout.toString() : "";
      }

      if (
        planOutput.includes(
          "No changes. Your infrastructure matches the configuration.",
        )
      ) {
        return new AssertionReturn(
          `Expected subject to be idempotent with no changes`,
          true,
        );
      } else {
        throw new Error(`Plan resulted in changes:\n${planOutput}`);
      }
    }

    return new AssertionReturn(
      `Expected subject to be idempotent with no changes`,
      true,
    );
  } catch (error) {
    console.error("Error during Terraform init or plan:", error);
    throw error;
  }
}

export function TerraformDestroy(
  stack: any,
  streamOutput: boolean = false,
): AssertionReturn {
  try {
    const manifestPath = path.resolve(stack, "manifest.json");

    // Safety check: verify manifest exists before reading
    if (!fs.existsSync(manifestPath)) {
      throw new Error(
        `Manifest file not found at ${manifestPath}. ` +
          `Ensure Testing.fullSynth() completed successfully and the output directory still exists.`,
      );
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const stacks = Object.entries(manifest.stacks);

    for (const [, stackDetails] of stacks) {
      const opts: ExecSyncOptionsWithStringEncoding = {
        cwd: path.resolve(stack, (stackDetails as any).workingDirectory),
        env: process.env,
        encoding: "utf-8",
      };

      const initResult = execTerraformCommand(
        `terraform init`,
        opts,
        streamOutput,
      );
      if (initResult.exitCode !== 0)
        throw new Error(
          `Terraform init failed: ${initResult.stdout} ${initResult.stderr}`,
        );

      const destroyResult = execTerraformCommand(
        `terraform destroy -auto-approve`,
        opts,
        streamOutput,
      );
      if (destroyResult.exitCode !== 0)
        throw new Error(
          `Terraform destroy failed: ${destroyResult.stdout} ${destroyResult.stderr}`,
        );
    }

    return new AssertionReturn(
      `Expected subject to destroy successfully`,
      true,
    );
  } catch (error: any) {
    console.error("Error during Terraform init or destroy:", error);
    return new AssertionReturn(
      `Expected subject to destroy successfully`,
      false,
    );
  }
}

export function TerraformApplyAndCheckIdempotency(
  stack: any,
  streamOutput: boolean = false,
): AssertionReturn {
  const applyResult = TerraformApply(stack, streamOutput);
  if (applyResult.error) {
    return new AssertionReturn(applyResult.error.message, false);
  }

  const planResult = TerraformPlanExitCode(stack, streamOutput);
  if (planResult.error) {
    return new AssertionReturn(planResult.error.message, false);
  }

  if (planResult.exitCode !== 0) {
    return new AssertionReturn(
      `Terraform configuration not idempotent:\n${planResult.stdout}`,
      false,
    );
  }

  return new AssertionReturn(
    `Terraform apply and idempotency check completed successfully`,
    true,
  );
}

export function TerraformApplyCheckAndDestroy(
  stack: any,
  options?: { verifyCleanup?: boolean },
): void {
  const streamOutput = process.env.STREAM_OUTPUT === "true";
  const verifyCleanup = options?.verifyCleanup ?? false;

  // Extract metadata and resources if available
  const metadata: TestRunMetadata | undefined = (stack as any).metadata;
  const hasVerification = verifyCleanup && metadata;

  try {
    const applyAndCheckResult = TerraformApplyAndCheckIdempotency(
      stack,
      streamOutput,
    );
    if (!applyAndCheckResult.success) {
      throw new Error(applyAndCheckResult.message);
    }
  } catch (error) {
    console.error("Error during Terraform apply and idempotency check:", error);
    throw error; // Re-throw the error to ensure the test fails
  } finally {
    try {
      if (hasVerification) {
        // Use enhanced destroy with verification
        const resources: ResourceMetadata[] =
          typeof (stack as any).registeredResources === "function"
            ? (stack as any).registeredResources()
            : [];

        const destroyResult = TerraformDestroyWithVerification(
          stack,
          metadata!,
          resources,
          streamOutput,
        );

        if (!destroyResult.success) {
          throw new Error(
            `Destroy verification failed: ${destroyResult.message}`,
          );
        }
      } else {
        // Use standard destroy (backward compatible)
        const destroyResult = TerraformDestroy(stack, streamOutput);
        if (!destroyResult.success) {
          console.error(
            "Error during Terraform destroy:",
            destroyResult.message,
          );
        }
      }
    } catch (destroyError) {
      console.error("Error during Terraform destroy:", destroyError);
      throw destroyError; // Re-throw to fail the test
    } finally {
      // Clean up this specific test's output directory
      try {
        if (fs.existsSync(stack)) {
          execSync(`rm -rf "${stack}"`);
        }
      } catch (cleanupError) {
        // Ignore cleanup errors - directory may already be gone
      }
    }
  }
}

/**
 * Enhanced terraform destroy with cleanup verification
 *
 * Performs terraform destroy and verifies resource cleanup via
 * Azure Resource Graph queries. Implements retry logic for
 * eventual consistency.
 *
 * @param stack - Terraform stack directory path
 * @param metadata - Test run metadata
 * @param resources - List of resources to verify deletion
 * @param streamOutput - Whether to stream command output
 * @returns Assertion result
 */
export function TerraformDestroyWithVerification(
  stack: any,
  metadata: TestRunMetadata,
  resources: ResourceMetadata[],
  streamOutput: boolean = false,
): AssertionReturn {
  try {
    console.log("[Destroy] Starting terraform destroy...");

    // Step 1: Run terraform destroy
    const destroyResult = TerraformDestroy(stack, streamOutput);

    if (!destroyResult.success) {
      throw new Error(`Terraform destroy failed: ${destroyResult.message}`);
    }

    console.log("[Destroy] Terraform destroy completed successfully");

    // Step 2: If no resources to verify, skip verification
    if (resources.length === 0) {
      console.log("[Destroy] No resources to verify (none registered)");
      return new AssertionReturn(
        "Terraform destroy completed (no verification needed)",
        true,
      );
    }

    console.log(
      `[Destroy] Verifying cleanup of ${resources.length} resources...`,
    );
    console.log("[Destroy] Waiting 30s for Azure eventual consistency...");

    // Step 3: Wait for eventual consistency
    const sleep = (ms: number) => {
      execSync(`sleep ${ms / 1000}`, { stdio: "ignore" });
    };
    sleep(30000);

    // Step 4: Verify resources are deleted with retry logic
    console.log("[Destroy] Starting verification...");
    const verificationResult = verifyResourcesDeleted(
      metadata.runId,
      resources,
    );

    if (!verificationResult.success) {
      // Step 5: Retry verification after additional wait
      console.warn("[Destroy] Initial verification failed, retrying...");
      sleep(30000);

      const retryResult = verifyResourcesDeleted(metadata.runId, resources);

      if (!retryResult.success) {
        const errorMessage =
          `Resource cleanup verification failed:\n` +
          `  Expected: ${retryResult.expectedCount} resources\n` +
          `  Found: ${retryResult.foundCount} orphaned resources\n` +
          `  Orphaned IDs:\n` +
          retryResult.orphanedResources.map((id) => `    - ${id}`).join("\n");

        console.error("[Destroy] ✗ Verification failed:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("[Destroy] ✓ Verification succeeded on retry");
    } else {
      console.log("[Destroy] ✓ All resources verified deleted");
    }

    return new AssertionReturn(
      "Terraform destroy and verification completed successfully",
      true,
    );
  } catch (error: any) {
    console.error(
      "[Destroy] Error during Terraform destroy and verification:",
      error,
    );
    return new AssertionReturn(
      `Terraform destroy and verification failed: ${error.message}`,
      false,
    );
  }
}

export function TerraformPlan(stack: any): AssertionReturn {
  try {
    const manifestPath = path.resolve(stack, "manifest.json");

    // Safety check: verify manifest exists before reading
    if (!fs.existsSync(manifestPath)) {
      throw new Error(
        `Manifest file not found at ${manifestPath}. ` +
          `Ensure Testing.fullSynth() completed successfully and the output directory still exists.`,
      );
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const stacks = Object.entries(manifest.stacks);
    stacks.forEach(([, stackDetails]) => {
      const opts = {
        cwd: path.resolve(stack, (stackDetails as any).workingDirectory),
        env: process.env,
        stdio: "pipe",
      } as any;
      execSync(`terraform init`, opts);
      execSync(`terraform plan -input=false -lock=false`, opts);
    });

    return new AssertionReturn(
      `Expected subject not to plan successfully`,
      true,
    );
  } catch (error) {
    console.error("Error during Terraform init or plan:", error);
    throw error;
    return new AssertionReturn(
      "Expected subject to plan successfully, false",
      false,
    );
  }
}

export class AssertionReturn {
  /**
   * Create an AssertionReturn
   * @param message - String message containing information about the result of the assertion
   * @param success - Boolean success denoting the success of the assertion
   */
  constructor(
    public readonly message: string,
    public readonly success: boolean,
  ) {
    if (!success) {
      throw new Error(message);
    }
  }
}

/**
 * Cleanup function for removing all CDKTF output directories in /tmp.
 *
 * WARNING: This function should NOT be used in afterAll() hooks when running
 * tests in parallel, as it will delete directories that other running tests
 * may still be using. Instead, TerraformApplyCheckAndDestroy now cleans up
 * its own directory automatically.
 *
 * This function is kept for manual cleanup or single-threaded test scenarios.
 */
export function cleanupCdkTfOutDirs() {
  try {
    execSync('find /tmp -name "cdktf.outdir.*" -type d -exec rm -rf {} +');
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

// Export cleanup utilities
export {
  ResourceMetadata,
  VerificationResult,
  CleanupOptions,
  OrphanedResource,
  CleanupResult,
  ResourceCleanupService,
  verifyResourcesDeleted,
  verifyResourcesDeletedWithRetry,
  findOrphanedResources,
  cleanupOrphanedResources,
} from "./lib/cleanup";
