/**
 * Test run metadata management
 *
 * Provides classes and utilities for generating and managing
 * integration test metadata including unique IDs, timestamps,
 * CI context, and system tags.
 */

import { v4 as uuidv4 } from "uuid";

/**
 * CI/CD pipeline context
 *
 * Extracted from environment variables during test execution.
 * Enables tracing resources back to specific pipeline runs.
 */
export interface CIContext {
  /**
   * CI platform ('github-actions', 'azure-devops', 'generic-ci', 'local')
   */
  readonly platform: string;

  /**
   * GitHub Actions workflow ID or equivalent
   */
  readonly pipelineId?: string;

  /**
   * GitHub Actions run ID or equivalent
   */
  readonly runId?: string;

  /**
   * GitHub Actions run number or equivalent
   */
  readonly runNumber?: string;

  /**
   * Git commit SHA (full)
   */
  readonly commitSha?: string;

  /**
   * Git commit SHA (short, 7 chars)
   */
  readonly commitShaShort?: string;

  /**
   * Git branch name
   */
  readonly branch?: string;

  /**
   * Git repository name
   */
  readonly repository?: string;
}

/**
 * Integration test system tags
 *
 * Returns a record of tag key-value pairs for Azure resources.
 * Uses Azure tag naming conventions with colons and hyphens.
 */
export type IntegrationTestTags = Record<string, string>;

/**
 * Test run configuration options
 */
export interface TestRunOptions {
  /**
   * Maximum age in hours before cleanup eligible (default: 4)
   */
  readonly maxAgeHours?: number;

  /**
   * Enable automated cleanup (default: true)
   */
  readonly autoCleanup?: boolean;

  /**
   * Cleanup policy (default: 'immediate')
   */
  readonly cleanupPolicy?: "immediate" | "delayed" | "manual";
}

/**
 * Metadata for an integration test run
 *
 * Generated once per test execution and shared across all resources
 * in that test. Provides unique identification, temporal tracking,
 * and CI/CD context.
 */
export class TestRunMetadata {
  /**
   * Unique identifier for this test run (UUID v4)
   */
  public readonly runId: string;

  /**
   * Sanitized test name from the describe block
   */
  public readonly testName: string;

  /**
   * Timestamp when the test run started
   */
  public readonly createdAt: Date;

  /**
   * Cleanup after timestamp (createdAt + maxAgeHours)
   */
  public readonly cleanupAfter: Date;

  /**
   * Maximum age in hours before cleanup eligible
   */
  public readonly maxAgeHours: number;

  /**
   * Enable automated cleanup
   */
  public readonly autoCleanup: boolean;

  /**
   * Cleanup policy
   */
  public readonly cleanupPolicy: "immediate" | "delayed" | "manual";

  /**
   * CI/CD context (populated from environment variables)
   */
  public readonly ciContext?: CIContext;

  /**
   * Creates new test run metadata
   *
   * @param testName - Test name (will be sanitized)
   * @param options - Optional configuration
   */
  constructor(testName: string, options?: TestRunOptions) {
    this.runId = uuidv4();
    this.testName = this.sanitizeTestName(testName);
    this.createdAt = new Date();
    this.maxAgeHours = options?.maxAgeHours ?? 4;
    this.autoCleanup = options?.autoCleanup ?? true;
    this.cleanupPolicy = options?.cleanupPolicy ?? "immediate";
    this.cleanupAfter = new Date(
      this.createdAt.getTime() + this.maxAgeHours * 60 * 60 * 1000,
    );
    this.ciContext = detectCIContext();
  }

  /**
   * Generates system tags for resources
   *
   * @returns Integration test system tags
   */
  public generateSystemTags(): Record<string, string> {
    // Build tags object with all properties
    const tags: Record<string, string> = {
      // Resource Identification
      "test:run-id": this.runId,
      "test:name": this.testName,
      "test:resource-type": "integration-test",

      // Temporal Tracking
      "test:created-at": this.createdAt.toISOString(),
      "test:cleanup-after": this.cleanupAfter.toISOString(),
      "test:max-age-hours": this.maxAgeHours.toString(),

      // Lifecycle Management
      "test:managed-by": "terraform-cdk-constructs-tests",
      "test:auto-cleanup": this.autoCleanup.toString(),
      "test:cleanup-policy": this.cleanupPolicy,

      // Backward Compatibility
      environment: "integration-test",
      purpose: "integration-test",
    };

    // Add CI/CD context if available
    if (this.ciContext) {
      if (this.ciContext.pipelineId) {
        tags["test:ci-pipeline"] = this.ciContext.pipelineId;
      }
      if (this.ciContext.runId) {
        tags["test:ci-run-id"] = this.ciContext.runId;
      }
      if (this.ciContext.runNumber) {
        tags["test:ci-run-number"] = this.ciContext.runNumber;
      }
      if (this.ciContext.commitShaShort) {
        tags["test:git-commit"] = this.ciContext.commitShaShort;
      }
      if (this.ciContext.branch) {
        tags["test:git-branch"] = this.ciContext.branch;
      }
    }

    return tags as IntegrationTestTags;
  }

  /**
   * Checks if resources from this run are eligible for cleanup
   *
   * @param now - Current time (defaults to now)
   * @returns Whether cleanup is eligible
   */
  public isCleanupEligible(now?: Date): boolean {
    const currentTime = now || new Date();
    return currentTime >= this.cleanupAfter;
  }

  /**
   * Serializes metadata to JSON for logging
   *
   * @returns JSON-serializable object
   */
  public toJSON(): Record<string, any> {
    return {
      runId: this.runId,
      testName: this.testName,
      createdAt: this.createdAt.toISOString(),
      cleanupAfter: this.cleanupAfter.toISOString(),
      maxAgeHours: this.maxAgeHours,
      autoCleanup: this.autoCleanup,
      cleanupPolicy: this.cleanupPolicy,
      ciContext: this.ciContext,
    };
  }

  /**
   * Sanitizes test name to be Azure-compliant
   *
   * @param name - Raw test name
   * @returns Sanitized name
   */
  private sanitizeTestName(name: string): string {
    let sanitized = name
      .toLowerCase()
      // Replace spaces and special characters with hyphens
      .replace(/[^a-z0-9-]/g, "-")
      // Remove consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "");

    // Truncate to 63 characters (DNS label limit)
    if (sanitized.length > 63) {
      sanitized = sanitized.substring(0, 63).replace(/-+$/, "");
    }

    return sanitized;
  }
}

/**
 * Detects and extracts CI context from environment
 *
 * @returns CI context or undefined if not in CI
 */
export function detectCIContext(): CIContext | undefined {
  // Detect GitHub Actions
  if (process.env.GITHUB_ACTIONS === "true") {
    return {
      platform: "github-actions",
      pipelineId: process.env.GITHUB_WORKFLOW,
      runId: process.env.GITHUB_RUN_ID,
      runNumber: process.env.GITHUB_RUN_NUMBER,
      commitSha: process.env.GITHUB_SHA,
      commitShaShort: process.env.GITHUB_SHA?.substring(0, 7),
      branch: process.env.GITHUB_REF_NAME,
      repository: process.env.GITHUB_REPOSITORY,
    };
  }

  // Detect Azure DevOps
  if (process.env.TF_BUILD === "True") {
    return {
      platform: "azure-devops",
      pipelineId: process.env.BUILD_DEFINITIONNAME,
      runId: process.env.BUILD_BUILDID,
      runNumber: process.env.BUILD_BUILDNUMBER,
      commitSha: process.env.BUILD_SOURCEVERSION,
      commitShaShort: process.env.BUILD_SOURCEVERSION?.substring(0, 7),
      branch: process.env.BUILD_SOURCEBRANCHNAME,
      repository: process.env.BUILD_REPOSITORY_NAME,
    };
  }

  // Detect generic CI
  if (process.env.CI === "true") {
    return {
      platform: "generic-ci",
      commitShaShort: "ci",
    };
  }

  // Local execution
  return {
    platform: "local",
    commitShaShort: "local",
  };
}
