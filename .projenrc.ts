import { cdktf } from "projen";
import { NpmAccess, UpdateSnapshot } from "projen/lib/javascript";
import { JsonPatch } from "projen/lib/json-patch";

const project = new cdktf.ConstructLibraryCdktf({
  author: "Microsoft",
  authorAddress: "https://microsoft.com",
  cdktfVersion: "0.20.8",
  jsiiVersion: "~5.9.0",
  description:
    "Azure CDK constructs using AZAPI provider for direct Azure REST API access. Version 1.0.0 - Major breaking change migration from AzureRM to AZAPI.",
  keywords: [
    "cdk",
    "cdktf",
    "terraform",
    "infrastructure",
    "cloud",
    "devops",
    "azure",
    "azapi",
    "rest-api",
  ],
  constructsVersion: "^10.3.0",
  typescriptVersion: "~5.6.2", // should always be the same major/minor as JSII
  minNodeVersion: "20.10.0",
  defaultReleaseBranch: "main",
  name: "@microsoft/terraform-cdk-constructs",
  majorVersion: 1, // Set to version 1.0.0 for AZAPI migration
  projenrcTs: true,
  jest: true,
  testdir: "",
  prettier: true,
  repositoryUrl: "https://github.com/azure/terraform-cdk-constructs.git",
  licensed: true,
  license: "MIT",
  pullRequestTemplate: false,
  mergify: false,
  npmAccess: NpmAccess.PUBLIC,
  publishToNuget: {
    dotNetNamespace: "Microsoft.Cdktf.Azure.TFConstructs",
    packageId: "Microsoft.Cdktf.Azure.TFConstructs",
  },
  publishToPypi: {
    distName: "microsoft-cdktfconstructs",
    module: "microsoft_cdktfconstructs",
  },
  publishToMaven: {
    javaPackage: "com.microsoft.terraformcdkconstructs",
    mavenGroupId: "com.microsoft.terraformcdkconstructs",
    mavenArtifactId: "cdktf-azure-constructs",
  },
  jestOptions: {
    updateSnapshot: UpdateSnapshot.NEVER,
  },
  // Dependencies for AZAPI-only implementation (removed AzureRM dependencies)
  // AZAPI provider classes are built into this package in src/core-azure/lib/providers-azapi/
  deps: ["cdktf@0.20.8"],
  peerDeps: ["cdktf@0.20.8", "constructs@^10.3.0"], // Only core CDK dependencies
  bundledDeps: [],
  devDeps: [
    "cdktf@0.20.8",
    "@types/jest@^29.5.13",
    "@types/node@^22",
    "jest@^29.7.0",
    "ts-jest@^29.2.5",
    "ts-node@^10.9.2",
    "typescript@~5.6.2",
  ],
  releaseToNpm: true,
});

// Required for jest to work with CDK tests
project.jest?.addSetupFileAfterEnv("<rootDir>/setup.js");

// Fix jest warnings
if (project.jest && project.jest.config) {
  project.jest.config.maxWorkers = "100%";
  project.jest.config.globals = {};
  project.jest.config.transform = {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.dev.json" }],
  };
  project.jest.config.testMatch = [
    "<rootDir>/src/**/__tests__/**/*.ts?(x)",
    "<rootDir>/@(|src)/**/*(*.)@(spec|test|integ).ts?(x)",
  ];
}
project.tsconfigDev.include.push("**/*.integ.ts");
project.tsconfigDev.include.push("**/*.spec.ts");
project.tsconfigDev.include.push("src/**/v*/**/*.ts");
project.tsconfigDev.include.push("src/utils/**/*.ts");
project.addScripts({
  test: "jest --testMatch '**/*.spec.ts'",
  integration: "STREAM_OUTPUT=true jest --testMatch '**/*.integ.ts'",
  "integration:nostream":
    "STREAM_OUTPUT=false jest --maxWorkers=12 --testMatch '**/*.integ.ts'",
});

// Modify the existing test task
const testTask = project.tasks.tryFind("test");
if (testTask) {
  // Clear existing steps
  testTask.reset();

  // Add modified steps
  testTask.exec(
    "jest --passWithNoTests --coverageProvider=v8 --ci --testMatch '**/*.spec.ts'",
    { receiveArgs: true },
  );
  const eslintTask = project.tasks.tryFind("eslint");
  if (eslintTask) {
    testTask.spawn(eslintTask);
  }
}

const releaseWorkflow = project.tryFindObjectFile(
  ".github/workflows/release.yml",
);
if (releaseWorkflow) {
  releaseWorkflow.patch(
    JsonPatch.add("/jobs/release/permissions/id-token", "write"),
  );
  releaseWorkflow.patch(
    JsonPatch.add("/jobs/release/permissions/contents", "read"),
  );
  releaseWorkflow.patch(JsonPatch.add("/jobs/release/environment", "Build"));
  releaseWorkflow.patch(
    JsonPatch.add("/jobs/release/steps/3", {
      name: "Authenticate with Azure",
      id: "azure_login",
      uses: "azure/login@v2",
      with: {
        "subscription-id": "${{ secrets.AZURE_SUBSCRIPTION_ID }}",
        "tenant-id": "${{ secrets.AZURE_TENANT_ID }}",
        "client-id": "${{ secrets.AZURE_CLIENT_ID }}",
      },
    }),
  );
  releaseWorkflow.patch(JsonPatch.remove("/jobs/release_npm")); // remove npm release job, release is handled elsewhere
  releaseWorkflow.patch(JsonPatch.remove("/jobs/release_maven")); // remove maven release job, release is handled elsewhere
  releaseWorkflow.patch(JsonPatch.remove("/jobs/release_pypi")); // remove pypi release job, release is handled elsewhere
  releaseWorkflow.patch(JsonPatch.remove("/jobs/release_nuget")); // remove nuget release job, release is handled elsewhere
  releaseWorkflow.addOverride("jobs.release_github.needs", ["release"]);
}
// Build Workflow
const buildWorkflow = project.tryFindObjectFile(".github/workflows/build.yml");
if (buildWorkflow) {
  buildWorkflow.addOverride("on", {
    pull_request_target: {
      branches: ["main"],
      "paths-ignore": [".devcontainer/**", "README.md"],
    },
  });
  buildWorkflow.patch(JsonPatch.remove("/on/pull_request"));
  buildWorkflow.patch(
    JsonPatch.add("/jobs/build/permissions/id-token", "write"),
  );
  buildWorkflow.patch(
    JsonPatch.add("/jobs/build/permissions/contents", "read"),
  );
  buildWorkflow.patch(JsonPatch.remove("/jobs/self-mutation")); // remove self-mutate job
  buildWorkflow.patch(JsonPatch.add("/jobs/build/environment", "Build"));
  buildWorkflow.patch(
    JsonPatch.add("/jobs/build/steps/2", {
      name: "Authenticate with Azure",
      id: "azure_login",
      uses: "azure/login@v2",
      with: {
        "subscription-id": "${{ secrets.AZURE_SUBSCRIPTION_ID }}",
        "tenant-id": "${{ secrets.AZURE_TENANT_ID }}",
        "client-id": "${{ secrets.AZURE_CLIENT_ID }}",
      },
    }),
  );
}

// Add .gitignore entries
project.gitignore.include("cdk.out");
project.gitignore.exclude("cdktf.out");
project.gitignore.exclude("/test");
project.gitignore.exclude("*terraform.*.tfstate*");

project.prettier?.addIgnorePattern(".github");
project.eslint?.addIgnorePattern(".github");

// Disable member ordering for generated AZAPI provider files
project.eslint?.addOverride({
  files: ["src/core-azure/lib/providers-azapi/**/*.ts"],
  rules: {
    "@typescript-eslint/member-ordering": "off",
  },
});

// Add generate index script
project.addScripts({
  "generate-index": "node ./scripts/generate-index.js",
});

project.synth();
