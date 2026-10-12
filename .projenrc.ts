import { cdktn } from "projen";
import {
  NodePackageManager,
  NpmAccess,
  UpdateSnapshot,
} from "projen/lib/javascript";
import { JsonPatch } from "projen/lib/json-patch";

const project = new cdktn.ConstructLibraryCdktn({
  author: "Microsoft",
  authorAddress: "https://microsoft.com",
  cdktnVersion: "0.24.0", // pinned; ConstructLibraryCdktn adds cdktn + constructs as peer/dev deps
  jsiiVersion: "~5.9.0",
  description:
    "Azure CDK constructs using AZAPI provider for direct Azure REST API access. Version 1.0.0 - Major breaking change migration from AzureRM to AZAPI.",
  keywords: [
    "azapi",
    "azure",
    "cdk",
    "cloud",
    "devops",
    "infrastructure",
    "opentofu",
    "rest-api",
  ], // ConstructLibraryCdktn adds "cdktn" and "terraform"
  // cdktn@0.24.0 and @cdktn/provider-azapi@1.x require constructs >=10.6.0 <10.8.0
  constructsVersion: "10.7.2",
  typescriptVersion: "~5.9.3", // should always be the same major/minor as JSII
  minNodeVersion: "22.19.0", // cdktn@0.24.0 declares engines.node >= 22.11.0; keep the 0.22 floor
  defaultReleaseBranch: "main",
  name: "@microsoft/terraform-cdk-constructs",
  majorVersion: 2, // Set to version 2.0.0 for cdktn migration (breaking change from cdktf)
  projenrcTs: true,
  packageManager: NodePackageManager.YARN_CLASSIC,
  jest: true,
  testdir: "", // tests live next to sources in src/
  tsconfigDevFile: "tsconfig.dev.json", // projen >=0.9x defaults to <testdir>/tsconfig.json, invalid with testdir ""
  tsconfig: {
    compilerOptions: {
      // projen's jsii default is "node16", which requires file extensions on the
      // relative dynamic import() calls in azapi-resource.ts. Keep CommonJS, which
      // is what jsii generated before projen owned tsconfig.json.
      module: "commonjs",
    },
  },
  prettier: true,
  repositoryUrl: "https://github.com/azure/terraform-cdk-constructs.git",
  licensed: true,
  license: "MIT",
  pullRequestTemplate: false,
  githubOptions: { mergify: false },
  npmAccess: NpmAccess.PUBLIC,
  // NOTE: Java and .NET publishing is disabled. cdktn now publishes to Maven Central and
  // NuGet, so these can be re-enabled once a 2.x release for those languages is planned.
  // publishToNuget: {
  //   dotNetNamespace: "Microsoft.Cdktf.Azure.TFConstructs",
  //   packageId: "Microsoft.Cdktf.Azure.TFConstructs",
  // },
  publishToPypi: {
    distName: "microsoft-cdktfconstructs",
    module: "microsoft_cdktfconstructs",
  },
  // publishToMaven: {
  //   javaPackage: "com.microsoft.terraformcdkconstructs",
  //   mavenGroupId: "com.microsoft.terraformcdkconstructs",
  //   mavenArtifactId: "cdktf-azure-constructs",
  // },
  jestOptions: {
    updateSnapshot: UpdateSnapshot.NEVER,
  },
  // cdktn and constructs are added as peer + dev dependencies by ConstructLibraryCdktn.
  // The AZAPI provider bindings come from the pre-built @cdktn/provider-azapi package
  // (peer dependency, like every other jsii dependency).
  peerDeps: ["@cdktn/provider-azapi@^1.0.0"],
  bundledDeps: ["uuid@^11.0.3"],
  devDeps: [
    "@cdktn/provider-azapi@^1.0.0",
    "@types/jest@^29",
    "@types/node@^20",
    "@types/uuid@^10.0.0",
    "jest@^29",
    "ts-jest@^29",
    "jest-junit@^15",
    "ts-node@^10.9.2",
    "typescript@~5.9.3",
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
project.tsconfigDev.include.push("scripts/**/*.ts");
project.addScripts({
  test: "jest --testMatch '**/*.spec.ts'",
  integration: "STREAM_OUTPUT=true jest --testMatch '**/*.integ.ts'",
  "integration:nostream":
    "STREAM_OUTPUT=false jest --maxWorkers=12 --testMatch '**/*.integ.ts'",
  "cleanup-test-resources": "ts-node scripts/cleanup-test-resources.ts",
});

// projen builds the eslint patterns from [srcdir, testdir, "build-tools"]; with
// testdir "" that yields an empty pattern, which eslint 9 rejects.
// Eslint re-renders its task at synth time, so drop the pattern at the source.
const lintPatterns: Set<string> | undefined = (project.eslint as any)
  ?._lintPatterns;
if (lintPatterns?.delete("")) {
  (project.eslint as any).updateTask();
}

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

// Add include-hidden-files to upload-artifact and download-artifact steps
// NOTE: addOverride applies to the BASE template BEFORE JsonPatch operations
// so use indices from the original template, not after Azure step insertion

// For build workflow (BEFORE Azure step is inserted at position 2):
// Step 5 = Upload patch, Step 8 = Upload artifact
if (buildWorkflow) {
  buildWorkflow.addOverride(
    "jobs.build.steps.5.with.include-hidden-files",
    true,
  );
  buildWorkflow.addOverride(
    "jobs.build.steps.8.with.include-hidden-files",
    true,
  );
  // Add include-hidden-files to download-artifact steps in package jobs
  // package-js: step 1 = Download build artifacts (index 1, after setup-node at index 0)
  buildWorkflow.addOverride(
    "jobs.package-js.steps.1.with.include-hidden-files",
    true,
  );
  // NOTE: package-java disabled - see publishToMaven above
  // buildWorkflow.addOverride(
  //   "jobs.package-java.steps.2.with.include-hidden-files",
  //   true,
  // );
  // package-python: step 2 = Download build artifacts (index 2, after setup-node and setup-python)
  buildWorkflow.addOverride(
    "jobs.package-python.steps.2.with.include-hidden-files",
    true,
  );
  // NOTE: package-dotnet disabled - see publishToNuget above
  // buildWorkflow.addOverride(
  //   "jobs.package-dotnet.steps.2.with.include-hidden-files",
  //   true,
  // );
}

// For release workflow (BEFORE Azure step is inserted at position 3):
// Step 8 = Upload artifact
if (releaseWorkflow) {
  releaseWorkflow.addOverride(
    "jobs.release.steps.8.with.include-hidden-files",
    true,
  );
}

// For upgrade-main workflow (no Azure step, use original indices):
// Step 5 = Upload patch
const upgradeWorkflow = project.tryFindObjectFile(
  ".github/workflows/upgrade-main.yml",
);
if (upgradeWorkflow) {
  upgradeWorkflow.addOverride(
    "jobs.upgrade.steps.5.with.include-hidden-files",
    true,
  );
}

// Override GitHub Actions versions to v4 to prevent self-mutation issues
// This ensures projen generates @v4 versions instead of @v3 defaults
project.github?.actions.set("actions/setup-java", "actions/setup-java@v4");
project.github?.actions.set("actions/setup-dotnet", "actions/setup-dotnet@v4");

// Add .gitignore entries
project.gitignore.include("cdk.out");
project.gitignore.exclude("cdktf.out");
project.gitignore.exclude("/test");
project.gitignore.exclude("*terraform.*.tfstate*");
project.gitignore.exclude(".gen"); // Exclude locally generated provider bindings (cdktn get)

project.prettier?.addIgnorePattern(".github");
project.eslint?.addIgnorePattern(".github");

// Add generate index script
project.addScripts({
  "generate-index": "node ./scripts/generate-index.js",
});

project.synth();
