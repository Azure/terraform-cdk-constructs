/**
 * Resource naming utilities for integration tests
 *
 * Provides functions for generating unique, Azure-compliant
 * resource names with proper length constraints and character restrictions.
 */

/**
 * Resource type prefix mapping for Azure resources
 */
const RESOURCE_PREFIXES: Record<string, string> = {
  "Microsoft.Resources/resourceGroups": "rg",
  "Microsoft.Storage/storageAccounts": "st",
  "Microsoft.Compute/virtualMachines": "vm",
  "Microsoft.Compute/virtualMachineScaleSets": "vmss",
  "Microsoft.ContainerService/managedClusters": "aks",
  "Microsoft.Network/virtualNetworks": "vnet",
  "Microsoft.Network/subnets": "snet",
  "Microsoft.Network/networkInterfaces": "nic",
  "Microsoft.Network/publicIPAddresses": "pip",
  "Microsoft.Network/networkSecurityGroups": "nsg",
  "Microsoft.Insights/actionGroups": "ag",
  "Microsoft.Insights/metricAlerts": "ma",
  "Microsoft.Insights/activityLogAlerts": "ala",
};

/**
 * Azure resource naming constraints
 */
interface ResourceConstraints {
  maxLength: number;
  allowHyphens: boolean;
  allowUnderscores: boolean;
  allowPeriods: boolean;
  casePolicy: "lower" | "upper" | "any";
  allowedPattern?: RegExp;
}

/**
 * Resource naming constraints by type
 */
const RESOURCE_CONSTRAINTS: Record<string, ResourceConstraints> = {
  "Microsoft.Resources/resourceGroups": {
    maxLength: 90,
    allowHyphens: true,
    allowUnderscores: true,
    allowPeriods: true,
    casePolicy: "any",
  },
  "Microsoft.Storage/storageAccounts": {
    maxLength: 24,
    allowHyphens: false,
    allowUnderscores: false,
    allowPeriods: false,
    casePolicy: "lower",
  },
  "Microsoft.Compute/virtualMachines": {
    maxLength: 64, // Windows: 15, Linux: 64
    allowHyphens: true,
    allowUnderscores: false,
    allowPeriods: false,
    casePolicy: "any",
  },
  "Microsoft.Compute/virtualMachineScaleSets": {
    maxLength: 64,
    allowHyphens: true,
    allowUnderscores: true,
    allowPeriods: false,
    casePolicy: "any",
  },
  "Microsoft.ContainerService/managedClusters": {
    maxLength: 63,
    allowHyphens: true,
    allowUnderscores: false,
    allowPeriods: false,
    casePolicy: "any",
  },
  "Microsoft.Network/virtualNetworks": {
    maxLength: 64,
    allowHyphens: true,
    allowUnderscores: true,
    allowPeriods: true,
    casePolicy: "any",
  },
  "Microsoft.Network/subnets": {
    maxLength: 80,
    allowHyphens: true,
    allowUnderscores: true,
    allowPeriods: true,
    casePolicy: "any",
  },
  "Microsoft.Network/networkInterfaces": {
    maxLength: 80,
    allowHyphens: true,
    allowUnderscores: true,
    allowPeriods: true,
    casePolicy: "any",
  },
  "Microsoft.Network/publicIPAddresses": {
    maxLength: 80,
    allowHyphens: true,
    allowUnderscores: true,
    allowPeriods: true,
    casePolicy: "any",
  },
  "Microsoft.Network/networkSecurityGroups": {
    maxLength: 80,
    allowHyphens: true,
    allowUnderscores: true,
    allowPeriods: true,
    casePolicy: "any",
  },
  "Microsoft.Insights/actionGroups": {
    maxLength: 260,
    allowHyphens: true,
    allowUnderscores: true,
    allowPeriods: true,
    casePolicy: "any",
  },
  "Microsoft.Insights/metricAlerts": {
    maxLength: 260,
    allowHyphens: true,
    allowUnderscores: true,
    allowPeriods: true,
    casePolicy: "any",
  },
  "Microsoft.Insights/activityLogAlerts": {
    maxLength: 260,
    allowHyphens: true,
    allowUnderscores: true,
    allowPeriods: true,
    casePolicy: "any",
  },
};

/**
 * Default constraints for unknown resource types
 */
const DEFAULT_CONSTRAINTS: ResourceConstraints = {
  maxLength: 64,
  allowHyphens: true,
  allowUnderscores: false,
  allowPeriods: false,
  casePolicy: "any",
};

/**
 * Options for generating resource names
 */
export interface NameGenerationOptions {
  /**
   * Azure resource type (e.g., 'Microsoft.Resources/resourceGroups')
   */
  resourceType: string;

  /**
   * Test name or identifier
   */
  testName: string;

  /**
   * Test run UUID
   */
  runId: string;

  /**
   * Optional custom identifier to include in name
   */
  customIdentifier?: string;
}

/**
 * Generates a unique, Azure-compliant resource name
 *
 * Creates names in format: {prefix}-{identifier}-{suffix} or
 * {prefix}{identifier}{suffix} depending on resource constraints.
 *
 * @param options - Name generation options
 * @returns Azure-compliant resource name
 *
 * @example
 * generateResourceName({
 *   resourceType: 'Microsoft.Resources/resourceGroups',
 *   testName: 'storage-test',
 *   runId: 'a1b2c3d4-e5f6-4789-b012-3456789abcde'
 * });
 * // Returns: 'rg-storage-test-a1b2c3'
 *
 * generateResourceName({
 *   resourceType: 'Microsoft.Storage/storageAccounts',
 *   testName: 'basic-test',
 *   runId: 'a1b2c3d4-e5f6-4789-b012-3456789abcde'
 * });
 * // Returns: 'stbasictesta1b2c3'
 */
export function generateResourceName(options: NameGenerationOptions): string {
  const { resourceType, testName, runId, customIdentifier } = options;

  // Get resource constraints
  const constraints = RESOURCE_CONSTRAINTS[resourceType] || DEFAULT_CONSTRAINTS;

  // Get resource prefix
  const prefix = getResourcePrefix(resourceType);

  // Sanitize identifier
  const identifier = customIdentifier
    ? sanitizeIdentifier(customIdentifier, constraints)
    : sanitizeIdentifier(testName, constraints);

  // Generate short suffix from run ID
  const suffix = generateShortId(runId);

  // Build name based on constraints
  const separator = constraints.allowHyphens ? "-" : "";
  let name = separator
    ? `${prefix}${separator}${identifier}${separator}${suffix}`
    : `${prefix}${identifier}${suffix}`;

  // Apply case policy
  name = applyCasePolicy(name, constraints.casePolicy);

  // Truncate if exceeds max length
  if (name.length > constraints.maxLength) {
    name = truncateName(prefix, identifier, suffix, constraints);
  }

  // Validate final name
  validateResourceName(name, resourceType, constraints);

  return name;
}

/**
 * Gets the resource type prefix
 *
 * @param resourceType - Azure resource type
 * @returns Short prefix for the resource type
 */
export function getResourcePrefix(resourceType: string): string {
  return RESOURCE_PREFIXES[resourceType] || "test";
}

/**
 * Sanitizes a test identifier to be Azure-compliant
 *
 * @param identifier - Raw identifier
 * @param constraints - Resource naming constraints
 * @returns Sanitized identifier
 */
export function sanitizeIdentifier(
  identifier: string,
  constraints: ResourceConstraints,
): string {
  let sanitized = identifier.toLowerCase();

  // Remove or replace special characters based on constraints
  if (!constraints.allowHyphens) {
    sanitized = sanitized.replace(/-/g, "");
  }
  if (!constraints.allowUnderscores) {
    sanitized = sanitized.replace(/_/g, "");
  }
  if (!constraints.allowPeriods) {
    sanitized = sanitized.replace(/\./g, "");
  }

  // Remove any remaining non-alphanumeric characters (except allowed ones)
  const allowedChars = [
    "a-z0-9",
    constraints.allowHyphens ? "-" : "",
    constraints.allowUnderscores ? "_" : "",
    constraints.allowPeriods ? "\\." : "",
  ].join("");

  const pattern = new RegExp(`[^${allowedChars}]`, "g");
  sanitized = sanitized.replace(pattern, "");

  // Remove leading/trailing special characters
  sanitized = sanitized.replace(/^[-_.]+|[-_.]+$/g, "");

  // Collapse multiple consecutive special characters
  sanitized = sanitized.replace(
    /[-_.]{2,}/g,
    constraints.allowHyphens ? "-" : "",
  );

  return sanitized;
}

/**
 * Generates a short unique ID from a UUID
 *
 * Takes the first 6 characters of the UUID (without hyphens)
 * to create a short, unique suffix.
 *
 * @param runId - UUID v4 run ID
 * @returns Short ID (6 characters)
 */
export function generateShortId(runId: string): string {
  return runId.replace(/-/g, "").substring(0, 6).toLowerCase();
}

/**
 * Applies case policy to a name
 *
 * @param name - Resource name
 * @param policy - Case policy to apply
 * @returns Name with applied case policy
 */
function applyCasePolicy(
  name: string,
  policy: "lower" | "upper" | "any",
): string {
  switch (policy) {
    case "lower":
      return name.toLowerCase();
    case "upper":
      return name.toUpperCase();
    case "any":
    default:
      return name;
  }
}

/**
 * Truncates a name to fit within constraints
 *
 * @param prefix - Resource type prefix
 * @param identifier - Sanitized identifier
 * @param suffix - Short unique ID
 * @param constraints - Resource naming constraints
 * @returns Truncated name
 */
function truncateName(
  prefix: string,
  identifier: string,
  suffix: string,
  constraints: ResourceConstraints,
): string {
  const separator = constraints.allowHyphens ? "-" : "";
  const separatorLength = separator.length;

  // Calculate available space for identifier
  const reservedLength = prefix.length + suffix.length + separatorLength * 2;
  const availableLength = constraints.maxLength - reservedLength;

  if (availableLength <= 0) {
    // Not enough space even for minimal identifier
    // Use just prefix and suffix
    const minName = separator
      ? `${prefix}${separator}${suffix}`
      : `${prefix}${suffix}`;
    return applyCasePolicy(minName, constraints.casePolicy);
  }

  // Truncate identifier to fit
  const truncatedIdentifier = identifier.substring(0, availableLength);

  const name = separator
    ? `${prefix}${separator}${truncatedIdentifier}${separator}${suffix}`
    : `${prefix}${truncatedIdentifier}${suffix}`;

  return applyCasePolicy(name, constraints.casePolicy);
}

/**
 * Validates a generated resource name
 *
 * @param name - Generated resource name
 * @param resourceType - Azure resource type
 * @param constraints - Resource naming constraints
 * @throws Error if name is invalid
 */
function validateResourceName(
  name: string,
  resourceType: string,
  constraints: ResourceConstraints,
): void {
  if (name.length === 0) {
    throw new Error(`Generated name for ${resourceType} is empty`);
  }

  if (name.length > constraints.maxLength) {
    throw new Error(
      `Generated name "${name}" exceeds maximum length ${constraints.maxLength} ` +
        `for ${resourceType}`,
    );
  }

  // Validate case policy
  if (constraints.casePolicy === "lower" && name !== name.toLowerCase()) {
    throw new Error(
      `Generated name "${name}" must be lowercase for ${resourceType}`,
    );
  }

  if (constraints.casePolicy === "upper" && name !== name.toUpperCase()) {
    throw new Error(
      `Generated name "${name}" must be uppercase for ${resourceType}`,
    );
  }

  // Validate character constraints
  const allowedChars = [
    "a-zA-Z0-9",
    constraints.allowHyphens ? "-" : "",
    constraints.allowUnderscores ? "_" : "",
    constraints.allowPeriods ? "\\." : "",
  ].join("");

  const pattern = new RegExp(`^[${allowedChars}]+$`);
  if (!pattern.test(name)) {
    throw new Error(
      `Generated name "${name}" contains invalid characters for ${resourceType}`,
    );
  }
}

/**
 * Gets resource naming constraints for a resource type
 *
 * @param resourceType - Azure resource type
 * @returns Naming constraints for the resource type
 */
export function getResourceConstraints(
  resourceType: string,
): ResourceConstraints {
  return RESOURCE_CONSTRAINTS[resourceType] || DEFAULT_CONSTRAINTS;
}
