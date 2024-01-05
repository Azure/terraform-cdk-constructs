import { cdktf } from "projen";
import { NpmAccess, UpdateSnapshot } from "projen/lib/javascript";
import { JsonPatch } from "projen/lib/json-patch";

const project = new cdktf.ConstructLibraryCdktf({
  author: "Microsoft",
  authorAddress: "https://microsoft.com",
  cdktfVersion: "0.17.3",
  jsiiVersion: "~5.2.0",
  constructsVersion: "^10.1.106",
  typescriptVersion: "~5.2.0", // should always be the same major/minor as JSII
  minNodeVersion: "20.10.0",
  defaultReleaseBranch: "main",
  name: "terraform-cdk-modules",
  projenrcTs: true,
  jest: true,
  testdir: "",
  prettier: true,
  repositoryUrl: "https://github.com/azure/terraform-cdk-modules.git",
  licensed: false,
  pullRequestTemplate: false,
  mergify: false,
  npmAccess: NpmAccess.PUBLIC,
  jestOptions: {
    updateSnapshot: UpdateSnapshot.NEVER,
  },
  deps: [
    "@cdktf/provider-azurerm@9.0.8",
    "nanoid@^4.0.2",
    "ts-md5@^1.3.1",
    "cdktf@0.17.3",
    //"constructs@^10.1.106",
    "moment@^2.30.1",
  ],
  peerDeps: ["@cdktf/provider-azurerm@9.0.8"],
  bundledDeps: ["moment@^2.30.1", "ts-md5@^1.3.1", "nanoid@^4.0.2"],
  devDeps: [
    "@cdktf/provider-azurerm@9.0.8",
    "cdktf@0.17.3",
    "@types/jest@^29.5.8",
    "@types/node@^18.7.18",
    "jest@^29.6.1",
    "ts-jest@^29.1.1",
    "ts-node@^10.9.1",
    "typescript@^4.9.5",
    //"constructs@10.1.106",
    "@types/moment@^2.13.0",
  ],
  releaseToNpm: true,
});

// Required for jest to work with CDK tests
project.jest?.addSetupFileAfterEnv("<rootDir>/setup.js");

// Fix jest warnings
if (project.jest && project.jest.config) {
  project.jest.config.globals = {};
  project.jest.config.transform = {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.dev.json" }],
  };
}
project.tsconfigDev.include.push("**/*.spec.ts");

// Release Workflow

// Add internal npm auth to pipelines
const setupNpmrcScript = {
  name: "Setup .npmrc",
  run: 'ENCODED_TOKEN=$(echo -n ${{ secrets.AZURE_DEVOPS_FEED_PAT }} | base64)\necho "AUTH_TOKEN=$ENCODED_TOKEN" >> $GITHUB_ENV\nexport AUTH_TOKEN=$ENCODED_TOKEN\n\nAZURE_DEVOPS_URL=${{ secrets.AZURE_DEVOPS_URL }}\n\ncat << EOF > .npmrc\nregistry=https://$AZURE_DEVOPS_URL/npm/registry/\nalways-auth=true\n; begin auth token\n//${AZURE_DEVOPS_URL}/npm/registry/:username=msasg\n//${AZURE_DEVOPS_URL}/npm/registry/:_password=\\${AUTH_TOKEN}\n//${AZURE_DEVOPS_URL}/npm/registry/:email=nothing\n//${AZURE_DEVOPS_URL}/npm/:username=msasg\n//${AZURE_DEVOPS_URL}/npm/:_password=\\${AUTH_TOKEN}\n//${AZURE_DEVOPS_URL}/npm/:email=nothing\n; end auth token\nEOF',
  shell: "bash",
};

const releaseWorkflow = project.tryFindObjectFile(
  ".github/workflows/release.yml",
);
releaseWorkflow?.patch(
  JsonPatch.add("/jobs/release_npm/steps/1", setupNpmrcScript),
);
releaseWorkflow?.patch(JsonPatch.remove("/jobs/release_npm/steps/8/env"));

// Build Workflow
const buildWorkflow = project.tryFindObjectFile(".github/workflows/build.yml");
buildWorkflow?.patch(JsonPatch.remove("/jobs/build/steps/0/with")); // Remove because build tries to copy forked repo which is private

// Add .gitignore entries
project.gitignore.include("cdk.out");
project.gitignore.exclude("cdktf.out");
project.gitignore.exclude("test");
project.gitignore.exclude("*terraform.*.tfstate*");

// Add generate index script
project.addScripts({
  "generate:index": "node ./scripts/generate-index.js",
});

project.synth();
