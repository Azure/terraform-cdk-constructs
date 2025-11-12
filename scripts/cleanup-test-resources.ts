#!/usr/bin/env ts-node
/**
 * Standalone script for cleaning up orphaned test resources
 *
 * Usage:
 *   npm run cleanup-test-resources -- --dry-run
 *   npm run cleanup-test-resources -- --min-age 4
 *   npm run cleanup-test-resources -- --subscription "sub-id"
 *   npm run cleanup-test-resources -- --help
 */

import {
  findOrphanedResources,
  cleanupOrphanedResources,
  CleanupOptions,
  OrphanedResource,
} from "../src/testing/lib/cleanup";

// ANSI color codes for better UX
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

/**
 * Parse command line arguments
 */
function parseArgs(): {
  dryRun: boolean;
  minAge: number;
  subscription?: string;
  help: boolean;
  maxResources?: number;
} {
  const args = process.argv.slice(2);

  const options = {
    dryRun: false,
    minAge: 2, // Default minimum age: 2 hours
    subscription: undefined as string | undefined,
    help: false,
    maxResources: undefined as number | undefined,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "--help":
      case "-h":
        options.help = true;
        break;

      case "--dry-run":
      case "-d":
        options.dryRun = true;
        break;

      case "--min-age":
        if (i + 1 < args.length) {
          options.minAge = parseInt(args[++i], 10);
          if (isNaN(options.minAge) || options.minAge < 2) {
            console.error(
              `${colors.red}Error: --min-age must be a number >= 2${colors.reset}`,
            );
            process.exit(1);
          }
        }
        break;

      case "--subscription":
      case "-s":
        if (i + 1 < args.length) {
          options.subscription = args[++i];
        }
        break;

      case "--max-resources":
      case "-m":
        if (i + 1 < args.length) {
          options.maxResources = parseInt(args[++i], 10);
          if (isNaN(options.maxResources) || options.maxResources < 1) {
            console.error(
              `${colors.red}Error: --max-resources must be a positive number${colors.reset}`,
            );
            process.exit(1);
          }
        }
        break;

      default:
        console.error(
          `${colors.red}Error: Unknown argument ${arg}${colors.reset}`,
        );
        options.help = true;
        break;
    }
  }

  return options;
}

/**
 * Display help information
 */
function showHelp(): void {
  console.log(`
${colors.bright}${colors.cyan}Cleanup Test Resources${colors.reset}

${colors.bright}DESCRIPTION:${colors.reset}
  Finds and optionally deletes orphaned Azure test resources that are past
  their TTL timestamp. Implements safety checks to prevent accidental deletion.

${colors.bright}USAGE:${colors.reset}
  npm run cleanup-test-resources -- [options]

${colors.bright}OPTIONS:${colors.reset}
  ${colors.green}--dry-run, -d${colors.reset}
      Perform a dry run (show what would be deleted without deleting)
      ${colors.yellow}Recommended for first-time use${colors.reset}

  ${colors.green}--min-age <hours>${colors.reset}
      Minimum age in hours before resource can be cleaned (default: 2)
      ${colors.yellow}Safety feature: prevents deletion of recent resources${colors.reset}

  ${colors.green}--subscription <id>, -s <id>${colors.reset}
      Target specific Azure subscription ID
      ${colors.yellow}Optional: defaults to current subscription${colors.reset}

  ${colors.green}--max-resources <n>, -m <n>${colors.reset}
      Maximum number of resources to clean up in one operation
      ${colors.yellow}Safety feature: limits scope of deletion${colors.reset}

  ${colors.green}--help, -h${colors.reset}
      Show this help information

${colors.bright}EXAMPLES:${colors.reset}
  # Preview what would be deleted (safe)
  npm run cleanup-test-resources -- --dry-run

  # Delete resources older than 4 hours
  npm run cleanup-test-resources -- --min-age 4

  # Delete resources in specific subscription
  npm run cleanup-test-resources -- --subscription "abc-123"

  # Dry run with increased age threshold
  npm run cleanup-test-resources -- --dry-run --min-age 6

  # Limit cleanup to 10 resources
  npm run cleanup-test-resources -- --max-resources 10

${colors.bright}SAFETY FEATURES:${colors.reset}
  • Minimum 2-hour age requirement
  • Dry-run mode for safe previewing
  • Tag validation (requires test:managed-by tag)
  • Confirmation prompts for destructive operations
  • Only deletes resources with test:auto-cleanup=true

${colors.bright}NOTES:${colors.reset}
  • Requires Azure CLI (az) to be installed and authenticated
  • Resource deletions are initiated asynchronously (--no-wait)
  • Check Azure portal after 5-10 minutes to confirm deletions

${colors.bright}RELATED COMMANDS:${colors.reset}
  npm run integration          # Run integration tests
  npm run integration:nostream # Run tests without streaming output
`);
}

/**
 * Display resource summary
 */
function displayResourceSummary(resources: OrphanedResource[]): void {
  if (resources.length === 0) {
    console.log(`\n${colors.green}✓ No orphaned resources found${colors.reset}`);
    return;
  }

  console.log(
    `\n${colors.bright}Found ${resources.length} orphaned resource(s):${colors.reset}\n`,
  );

  // Group by resource group
  const byResourceGroup = new Map<string, OrphanedResource[]>();
  for (const resource of resources) {
    const group = byResourceGroup.get(resource.resourceGroup) || [];
    group.push(resource);
    byResourceGroup.set(resource.resourceGroup, group);
  }

  // Display grouped resources
  for (const [rgName, rgResources] of byResourceGroup) {
    console.log(
      `${colors.cyan}${colors.bright}Resource Group:${colors.reset} ${rgName}`,
    );
    console.log(
      `  ${colors.yellow}Resources:${colors.reset} ${rgResources.length}`,
    );

    for (const resource of rgResources) {
      console.log(`    ${colors.blue}•${colors.reset} ${resource.name}`);
      console.log(
        `      Type: ${resource.resourceType.split("/").pop() || resource.resourceType}`,
      );
      console.log(`      Age: ${resource.ageHours.toFixed(1)} hours`);
      console.log(`      Test: ${resource.testName}`);
      console.log(
        `      Created: ${resource.createdAt.toISOString().split("T")[0]}`,
      );
    }
    console.log();
  }
}

/**
 * Confirm cleanup operation
 */
async function confirmCleanup(resources: OrphanedResource[]): Promise<boolean> {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(
    `\n${colors.red}${colors.bright}⚠️  WARNING ⚠️${colors.reset}`,
  );
  console.log(
    `${colors.yellow}You are about to delete ${resources.length} resource(s) across ${new Set(resources.map((r) => r.resourceGroup)).size} resource group(s).${colors.reset}`,
  );
  console.log(`${colors.yellow}This operation CANNOT be undone.${colors.reset}\n`);

  return new Promise((resolve) => {
    readline.question(
      `${colors.bright}Type 'DELETE' to confirm (or anything else to cancel): ${colors.reset}`,
      (answer: string) => {
        readline.close();
        resolve(answer.trim() === "DELETE");
      },
    );
  });
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  console.log(
    `${colors.bright}${colors.cyan}=== Cleanup Test Resources ===${colors.reset}\n`,
  );

  // Display configuration
  console.log(`${colors.bright}Configuration:${colors.reset}`);
  console.log(
    `  Mode: ${options.dryRun ? `${colors.yellow}DRY RUN${colors.reset}` : `${colors.red}EXECUTE${colors.reset}`}`,
  );
  console.log(`  Minimum Age: ${options.minAge} hours`);
  if (options.subscription) {
    console.log(`  Subscription: ${options.subscription}`);
  }
  if (options.maxResources) {
    console.log(`  Max Resources: ${options.maxResources}`);
  }
  console.log();

  // Build cleanup options
  const cleanupOptions: CleanupOptions = {
    dryRun: options.dryRun,
    minAgeHours: options.minAge,
    subscription: options.subscription,
    maxResources: options.maxResources,
  };

  try {
    // Step 1: Find orphaned resources
    console.log(`${colors.bright}Searching for orphaned resources...${colors.reset}`);
    const resources = await findOrphanedResources(cleanupOptions);

    // Step 2: Display summary
    displayResourceSummary(resources);

    if (resources.length === 0) {
      process.exit(0);
    }

    // Step 3: Execute cleanup (or dry run)
    if (options.dryRun) {
      console.log(
        `\n${colors.yellow}${colors.bright}DRY RUN - No resources were deleted${colors.reset}`,
      );
      console.log(`\nTo actually delete these resources, run:`);
      console.log(
        `  ${colors.cyan}npm run cleanup-test-resources -- --min-age ${options.minAge}${colors.reset}`,
      );
    } else {
      // Confirm before executing
      const confirmed = await confirmCleanup(resources);

      if (!confirmed) {
        console.log(
          `\n${colors.yellow}Cleanup cancelled by user${colors.reset}`,
        );
        process.exit(0);
      }

      console.log(`\n${colors.bright}Executing cleanup...${colors.reset}\n`);
      const result = await cleanupOrphanedResources(resources, cleanupOptions);

      // Display results
      console.log(`\n${colors.bright}${colors.cyan}Cleanup Summary:${colors.reset}`);
      console.log(
        `  ${colors.green}Deleted:${colors.reset} ${result.deleted} resource(s)`,
      );
      console.log(
        `  ${colors.red}Failed:${colors.reset} ${result.failed} resource(s)`,
      );
      console.log(
        `  ${colors.yellow}Skipped:${colors.reset} ${result.skipped} resource(s)`,
      );

      if (result.errors && result.errors.length > 0) {
        console.log(`\n${colors.red}${colors.bright}Errors:${colors.reset}`);
        result.errors.forEach((error) => {
          console.log(`  ${colors.red}•${colors.reset} ${error}`);
        });
      }

      if (result.deleted > 0) {
        console.log(
          `\n${colors.green}${colors.bright}✓ Cleanup initiated successfully${colors.reset}`,
        );
        console.log(
          `${colors.yellow}Note: Resource deletions are asynchronous. ` +
            `Check Azure portal in 5-10 minutes to confirm.${colors.reset}`,
        );
      }

      if (result.failed > 0) {
        process.exit(1);
      }
    }
  } catch (error: any) {
    console.error(`\n${colors.red}${colors.bright}Error:${colors.reset} ${error.message}`);
    if (error.stack) {
      console.error(`\n${colors.red}${error.stack}${colors.reset}`);
    }
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error(
    `${colors.red}${colors.bright}Fatal error:${colors.reset} ${error.message}`,
  );
  process.exit(1);
});