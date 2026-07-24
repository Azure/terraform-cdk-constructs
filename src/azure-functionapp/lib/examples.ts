/**
 * Integration example: Azure Function App with Asset Pipeline
 *
 * This example demonstrates how to use the asset pipeline to deploy
 * function code with Docker-based bundling for dependency management.
 */

import { Construct } from "constructs";
import { FunctionApp } from "./function-app";

/**
 * Example 1: Node.js Function App with npm dependencies
 *
 * This example creates a Function App that:
 * - Uses a local directory containing TypeScript functions
 * - Bundles using Node.js 20 Docker image
 * - Installs production dependencies with npm
 * - Caches the bundled output based on asset hash
 */
export class NodeJsFunctionAppWithAssets extends Construct {
  readonly functionApp: FunctionApp;

  constructor(scope: Construct, id: string, props: {
    functionAppName: string;
    location: string;
    resourceGroupId: string;
    appServicePlanId: string;
  }) {
    super(scope, id);

    this.functionApp = new FunctionApp(this, "func", {
      name: props.functionAppName,
      location: props.location,
      resourceGroupId: props.resourceGroupId,
      serverFarmId: props.appServicePlanId,
      kind: "functionapp,linux",
      
      // Asset pipeline: Stage and bundle the function code
      codeAsset: {
        // Point to the functions directory
        sourcePath: "./src/functions",
        
        // Docker-based bundling to install dependencies
        bundling: {
          dockerImage: "node:20",
          command: ["npm", "install", "--production"],
          environment: {
            NPM_CONFIG_LOGLEVEL: "error",
          },
          workingDirectory: "/asset-input",
        },
        
        // Exclude node_modules from source (will be recreated during bundling)
        exclude: [
          "node_modules",
          "*.test.ts",
          "*.spec.ts",
        ],
      },
      
      // Function App configuration
      siteConfig: {
        appSettings: [
          {
            name: "FUNCTIONS_WORKER_RUNTIME",
            value: "node",
          },
          {
            name: "FUNCTIONS_EXTENSION_VERSION",
            value: "~4",
          },
          {
            name: "NODE_ENV",
            value: "production",
          },
        ],
        linuxFxVersion: "NODE|20",
        alwaysOn: true,
      },
      
      // Security and networking
      httpsOnly: true,
      identity: {
        type: "SystemAssigned",
      },
    });
  }

  /**
   * Get the asset hash for cache invalidation
   */
  get assetHash(): string | undefined {
    return this.functionApp.assetHash;
  }

  /**
   * Get the staged asset path
   */
  get assetPath(): string | undefined {
    return this.functionApp.assetPath;
  }
}

/**
 * Example 2: Python Function App with pip requirements
 *
 * This example demonstrates:
 * - Python function code deployment
 * - Pip-based dependency management
 * - Environment-specific settings
 */
export class PythonFunctionAppWithAssets extends Construct {
  readonly functionApp: FunctionApp;

  constructor(scope: Construct, id: string, props: {
    functionAppName: string;
    location: string;
    resourceGroupId: string;
    appServicePlanId: string;
  }) {
    super(scope, id);

    this.functionApp = new FunctionApp(this, "func", {
      name: props.functionAppName,
      location: props.location,
      resourceGroupId: props.resourceGroupId,
      serverFarmId: props.appServicePlanId,
      kind: "functionapp,linux",
      
      // Asset pipeline for Python
      codeAsset: {
        sourcePath: "./src/functions",
        
        bundling: {
          dockerImage: "python:3.11",
          command: [
            "pip",
            "install",
            "-r",
            "requirements.txt",
            "-t",
            "/asset-output",
          ],
          environment: {
            PIP_NO_CACHE_DIR: "1",
          },
        },
        
        exclude: [
          "__pycache__",
          "*.pyc",
          ".pytest_cache",
          "venv",
        ],
      },
      
      siteConfig: {
        appSettings: [
          {
            name: "FUNCTIONS_WORKER_RUNTIME",
            value: "python",
          },
          {
            name: "FUNCTIONS_EXTENSION_VERSION",
            value: "~4",
          },
        ],
        linuxFxVersion: "PYTHON|3.11",
      },
      
      httpsOnly: true,
    });
  }
}

/**
 * Example 3: Function App with minimal asset configuration
 *
 * This example shows the simplest asset pipeline usage:
 * - Just stage the code without bundling
 * - Useful when dependencies are pre-installed or using built-in runtimes
 */
export class SimpleAssetFunctionApp extends Construct {
  readonly functionApp: FunctionApp;

  constructor(scope: Construct, id: string, props: {
    functionAppName: string;
    location: string;
    resourceGroupId: string;
    appServicePlanId: string;
  }) {
    super(scope, id);

    this.functionApp = new FunctionApp(this, "func", {
      name: props.functionAppName,
      location: props.location,
      resourceGroupId: props.resourceGroupId,
      serverFarmId: props.appServicePlanId,
      kind: "functionapp,linux",
      
      // Minimal asset configuration: just stage without bundling
      codeAsset: {
        sourcePath: "./src/functions",
        exclude: [".gitignore", "*.md", ".env"],
      },
      
      siteConfig: {
        appSettings: [
          {
            name: "FUNCTIONS_WORKER_RUNTIME",
            value: "node",
          },
        ],
        linuxFxVersion: "NODE|20",
      },
    });
  }
}

/**
 * Example 4: Advanced use case - Custom bundling with environment-specific builds
 *
 * This example shows:
 * - Custom build environment
 * - Environment variable substitution
 * - Multi-stage-like builds
 */
export class AdvancedBundlingFunctionApp extends Construct {
  readonly functionApp: FunctionApp;

  constructor(scope: Construct, id: string, props: {
    functionAppName: string;
    location: string;
    resourceGroupId: string;
    appServicePlanId: string;
    environment: "dev" | "prod";
  }) {
    super(scope, id);

    this.functionApp = new FunctionApp(this, "func", {
      name: props.functionAppName,
      location: props.location,
      resourceGroupId: props.resourceGroupId,
      serverFarmId: props.appServicePlanId,
      kind: "functionapp,linux",
      
      // Advanced bundling with custom environment
      codeAsset: {
        sourcePath: "./src/functions",
        
        bundling: {
          dockerImage: "node:20-alpine", // Use Alpine for smaller image
          command: [
            "sh",
            "-c",
            // Custom build script with environment-specific optimizations
            props.environment === "prod"
              ? "npm ci --only=production && npm run build"
              : "npm install && npm run build:dev",
          ],
          environment: {
            NODE_ENV: props.environment === "prod" ? "production" : "development",
            BUILD_ENV: props.environment,
            NPM_CONFIG_LOGLEVEL: "error",
          },
        },
        
        exclude: [
          "node_modules",
          ".env*",
          "*.test.ts",
          "coverage",
          ".git",
        ],
        
        // Custom hash to distinguish prod vs dev builds
        assetHash: `${props.environment}-build`,
      },
      
      siteConfig: {
        appSettings: [
          {
            name: "FUNCTIONS_WORKER_RUNTIME",
            value: "node",
          },
          {
            name: "ENVIRONMENT",
            value: props.environment,
          },
          {
            name: "FUNCTIONS_EXTENSION_VERSION",
            value: "~4",
          },
        ],
        linuxFxVersion: "NODE|20",
        alwaysOn: props.environment === "prod",
      },
      
      identity: {
        type: "SystemAssigned",
      },
      
      tags: {
        Environment: props.environment,
        AssetPipeline: "enabled",
      },
    });
  }
}
