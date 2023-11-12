# Contributing to the Terraform Azure CDK Modules

Thank for your interesting in contributing! 

- [Getting Started](#getting-started)
- [Pull Requests](#pull-requests)
  - [Step 1: Find something to work on](#step-1-find-something-to-work-on)
  - [Step 2: Modifications](#step-2-modifications)
  - [Step 3: Pull Request](#step-3-pull-request)
  - [Step 4: Merge](#step-4-merge)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)

## Getting Started

To open this repository in a Code Space, click the button below:

[![Open in Code Spaces](https://img.shields.io/badge/Open%20in%20Code%20Spaces-Terraform%20Azure%20CDK%20Modules%20Project-blue?logo=github)](https://github.com/microsoft/terraform-azure-cdk-modules/codespaces)

## Pull Requests

Pull requests are a key mechanism by which contributions are made to the project. They allow developers to propose changes, get feedback, and iterate on their ideas before merging them into the main project.

### Step 1: Find something to work on

You can start by looking at the project's open issues. Choose an issue that matches your expertise and interest. If you have a new feature or a bug fix that doesn't have an associated issue, you can create a new one.

### Step 2: Modifications

After identifying an issue, fork the repository to your GitHub account by clicking the 'Fork' button at the top right of the repository page. 

Then, clone the forked repository to your local machine:

```bash
git clone https://github.com/<your-username>/terraform-azure-cdk-modules.git
```

Create a new branch for your task:

```
git checkout -b <branch-name>
```

Make your changes to the new branch. Be sure to adhere to the existing coding style, and include comments in your code as necessary.

### Step 3: Pull Request
Once you've made your changes, push them to your fork:
```
git add .
git commit -m "<commit-message>"
git push origin <branch-name>
```

Go to the GitHub page of your forked repository and click 'New pull request'. Choose the original repository as the base repository and your branch as the compare branch, then click 'Create pull request'.

Fill out the pull request form. Include the issue number you're addressing, a summary of changes made, and any additional information that might be helpful for reviewers. Then, submit the pull request.

### Step 4: Merge
After your pull request has been reviewed and approved, a project maintainer will merge it into the main codebase. You will be notified once your changes have been merged.

## Testing
Testing is an essential part of the development process. We require both unit and integration tests for all modules.

### Unit Tests
To run the unit tests, use the following command:
```
npm test
```

### Integration Tests
Integration tests allow us to deploy in an Azure environment and verify that the code will work and is idempotent. We use Terratest for our integration tests.

Remember to create a test with all default values and additional tests for other potential configurations, within reason. Do not create a multitude of tests for a configuration that has many options.

To run the integration test, use the following command in the module test directory:
```
go test -v resource_group_test.go
```

These tests will run in your own Azure subscription. They will look for the ARM_SUBSCRIPTION_ID environment variable, and if it's not available, it will try to pull from Azure CLI and use the current subscription context.

Please be aware that running integration tests may incur charges on your Azure account. Always verify the resources you are creating and their associated costs.

**Thank you for your interest in contributing to the Azure Terraform CDK Modules project! Your efforts help make our project even better.**