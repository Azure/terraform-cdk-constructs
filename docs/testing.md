# CDK Testing Guidelines

The purpose of this document is to provide guidelines for writing tests in the CDK library to ensure all modules are of highest quality and reliability standards.


- [Writing Tests](#writing-tests)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
  - [End-to-End Tests](#end-to-end-tests)
  - [Testing Pyramid](#testing-pyramid)
- [Authentication for Tests](#authentication-for-tests)
- [How to Write Unit Tests](#how-to-write-unit-tests)
  - [Running the Unit Tests](#running-the-unit-tests)
  - [Snapshots](#snapshots)
- [Integration Tests](#integration-tests-1)
  - [Running the Integration Tests](#running-the-integration-tests)
  - [Further Troubleshooting of Tests](#further-troubleshooting-of-tests)
  - [Randomizing Globally Unique Resource Names](#randomizing-globally-unique-resource-names)
- [End to End Tests](#end-to-end-tests-1)

# How to run tests

### How to run any single test:
1. Must be logged in with Az Login
2. Run the following command: 
```
jest ./pathtotestfile/filename.ts
```

### How to run all unit tests at same time:
1. Must be logged in with Az Login
2. Run the following command: 
```
npx projen test
```

### How to run all integration tests at same time:
1. Must be logged in with Az Login
2. Run the following command: 
```
npm run integration:nostream
```


## Writing Tests

In the realm of infrastructure development, testing is paramount to ensure that infrastructure code is reliable, maintainable, and scalable. Just like in software development, there are different levels of testing, each with its own purpose and scope. The three primary levels are: Unit Tests, Integration Tests, and End-to-End Tests.

### Unit Tests
- **Purpose**: Validate individual pieces of infrastructure code in isolation. Unit tests are written in typescript using Jest.
- **Terraform Commands**:
    - *terraform validate*: Checks syntax and basic semantics.
    - *terraform plan*: Creates an execution plan to verify expected changes.
- **Snapshot Testing**: Capture the current state or configuration of a module as a "snapshot". On subsequent tests, compare the current state against the saved snapshot to detect any unexpected changes. Useful for catching unintended modifications.
- **Advantages**:
Fast execution.
No interaction with real infrastructure, thus cost-effective.

### Integration Tests
- **Purpose**: Ensure the construct can be effectively deployed and destroyed within the Cloud provider environment without issues. Integration tests are written in Golang using the Terratest library.
- **Terraform Commands**:
    - *terraform apply*: Provisions or modifies resources.
    - *Idempotency Check*: Ensures configuration is idempotent by re-running terraform apply.
    - *terraform destroy*: Removes provisioned resources.
- **Advantages**: Interacts with real infrastructure. Validates real-world scenarios.

### End-to-End Tests
- **Purpose**: Validate the behavior of an entire infrastructure environment.End-to-End tests are written in Golang using the Terratest library.
- **Terraform Implementation**:
Combine multiple modules to build a larger environment. Provision using terraform apply and test the entire setup. Clean up with terraform destroy.
- **Advantages**: Provides a comprehensive view of the entire infrastructure. Ensures cohesive and functional infrastructure setup.

### Testing Pyramid

![testing pyramid](https://global-uploads.webflow.com/619e15d781b21202de206fb5/6316d9e765cd53d9937e2b6a_The-Testing-Pyramid-Simplified-for-One-and-All.webp)

As depicted in the testing pyramid, it's recommended to have:

**Many Unit Tests**: They are quick, cheap, and can catch a majority of the issues early in the development cycle.

**Fewer Integration Tests**: While they provide valuable insights by interacting with real infrastructure, they are slower and can be costlier.

**Very Few End-to-End Tests**: These are the most expensive and time-consuming tests, but they provide a comprehensive view of the entire infrastructure environment.

By adhering to this pyramid structure, teams can ensure efficient and effective testing, catching issues early and ensuring robust infrastructure code

## Authentication for Tests
The tests will use AZ CLI for authentication. Make sure to set the Azure subscription to a dev environment:
```
az account set -s MySubscription
```


## How to Write Unit Tests
Unit tests are written in Typescript using Jest. They consist of a `spec` test file within the module folder under the `test` folder:

```plaintext
src
└── modules
    └── azure-resourcegroup
        ├── test
        │   ├── ResourceGroup.test.ts # spec test file
        └── index.ts
```

Below is a spec test for the resource group construct:

```
# index.ts
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Testing, TerraformStack } from "cdktf";
import { TerraformPlan } from "../../testing";
import "cdktf/lib/testing/adapters/jest";
import * as rg from "..";

describe("Resource Group With Defaults", () => {
  let stack: TerraformStack;
  let fullSynthResult: any;

  beforeEach(() => {
    const app = Testing.app();
    stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", { features: {} });
    new rg.Group(stack, "testRG");

    fullSynthResult = Testing.fullSynth(stack);
  });

  it("renders a Resource Group with defaults and checks snapshot", () => {
    expect(Testing.synth(stack)).toMatchSnapshot(); 
  });

  it("check if the produced terraform configuration is valid", () => {
    expect(fullSynthResult).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    TerraformPlan(fullSynthResult);
  });
});
```
Before each test, a new instance of the `AzureResourceGroup` is created. The stack is then fully synthesized, and the result is stored in `fullSynthResult` to be used for each test. The synthesize process turns the Typescript code into a Terraform JSON configuration that can be deployed with the Terraform cli. The following minimum tests are run for each module:

- **Snapshot Test**: The test checks if the rendered Resource Group matches a previously saved snapshot. This ensures that any changes to the stack's output are intentional and reviewed.
- **Terraform Validate**: Runs the `terraform validate` command against the synthesized Terraform configuration. Verifies that the synthesized result produces a valid Terraform configuration.
- **Terraform Plan**: Runs the `terraform plan` command against the synthesized Terraform configuration. Ensures that the Terraform configuration can be successfully planned, indicating that the resources can be provisioned without errors.

Its good practice to write at least one test that contains all defaults, meaning only specifying the required inputs. This provides a visualization of how minimal the abstraction can be for the module being tested. The goal is to be able to have as few required inputs as possible for each module to create the best experience for developers.

### Running the Unit Tests

You can run all unit tests in the project using the command:
```
npm test
```

This will run all unit tests for all modules:
```
@lukeorellana_microsoft ➜ /workspaces/terraform-cdk-modules$ npm test

> terraform-modules@1.0.0 test
> jest

 RUNS  src/azure-alerts/test/AzureAlerts.test.ts
 RUNS  src/azure-aks-core/test/AzureAksCore.test.ts
 RUNS  src/azure-alerts/test/AzureAlerts.test.ts
 RUNS  src/azure-aks-core/test/AzureAksCore.test.ts
 RUNS  src/azure-alerts/test/AzureAlerts.test.ts
 RUNS  src/azure-aks-core/test/AzureAksCore.test.ts
 PASS  src/azuredevops-pipelines/__tests__/pipelines.test.ts (11.077 s)

Test Suites: 1 passed, 1 of 11 total
Tests:       1 todo, 6 passed, 7 total
Snapshots:   0 total
Time:        16 s
```



Alternatively add the test file to the end of the command to only run the tests in that file:
```
npm test src/azure-resourcegroup/test/AzureResourceGroup.spec.ts
```
This allows for fast iteration upon one module in development:

```
> terraform-core-modules@7.3.0-rc.44 test
> jest src/azure-resourcegroup/test/AzureResourceGroup.spec.ts

 PASS  src/azure-resourcegroup/test/AzureResourceGroup.spec.ts (23.914 s)
  Resource Group With Defaults
    ✓ renders an Resource Group with defaults and checks snapshot (22 ms)
    ✓ check if the produced terraform configuration is valid (5465 ms)
    ✓ check if this can be planned (14608 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   1 passed, 1 total
Time:        23.955 s, estimated 32 s
```

### Snapshots

When the test runs, a snapshot file is created in the __snapshots__ folder:

```plaintext
src
  └── azure-resourcegroup
      ├── test
      │   ├── AzureResourceGroup.spec.ts
      │   └── __snapshots__
      │       └── AzureResourceGroup.test.ts.snap
      └── index.ts
```
All `npm tests` after, will now check the syntheszied configuration against the previously stored snapshot. The test will fail if it doesnt match. In order to update a snapshot type the following command:
```
npm test src/azure-resourcegroup/test/AzureResourceGroup.spec.ts -- -u
```



## Integration Tests
Integration tests are written in typescript and end in `.integ.ts`:


```plaintext
src
  └── azure-resourcegroup
      ├── test
      │   └── AzureResourceGroup.integ.ts
      │     
      └── index.ts
```

The integration test will perform the following against the example file:

1. **terraform apply**: The integration test starts by executing a terraform apply.
2. **terraform plan**: After setup, a terraform plan is run to:
    - Confirm there are no additional changes needed.
    - Ensure the setup is stable and consistent (idempotent).
    - This step is crucial to detect issues like looping bugs, which can arise due to Terraform's declarative nature.
3. **terraform destroy**: At the end of the test, terraform destroy is executed.
    - This step removes the test environment and ensures the infrastructure can be cleanly deleted.
    - It's designed to catch common problems that occur when removing infrastructure, especially those related to resource dependencies.

## End to End Tests

End to End tests are used when testing a class that contains multiple stacks. The workflow is the same as with integration tests, however the test will take much longer. 