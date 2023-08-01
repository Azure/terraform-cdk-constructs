package test

import (
	"os"
	"testing"

	"github.com/gruntwork-io/terratest/modules/azure"
	"github.com/gruntwork-io/terratest/modules/shell"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/microsoft/terraform-azure-cdk-modules/util"
	"github.com/stretchr/testify/assert"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureContainerRegistryExample(t *testing.T) {
	t.Parallel()

	// subscriptionID is overridden by the environment variable "ARM_SUBSCRIPTION_ID"
	subscriptionID := util.GetSubscriptionID()
	os.Setenv("ARM_SUBSCRIPTION_ID", subscriptionID)

	cmd := shell.Command{
		Command:    "cdktf",
		Args:       []string{"synth", "--app", "npx ts-node ./src/container-registry/ExampleAzureContainerRegistry.ts"},
		WorkingDir: "../",
	}

	shell.RunCommandAndGetStdOut(t, cmd)

	terraformOptions := &terraform.Options{

		// The path to where our Terraform code is located
		TerraformDir: "../cdktf.out/stacks/testAzureContainerRegistry",
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApplyAndIdempotent(t, terraformOptions)

	// Run `terraform output` to get the values of output variables
	resourceGroupName := terraform.Output(t, terraformOptions, "resource_group_name")
	acrName := terraform.Output(t, terraformOptions, "container_registry_name")
	loginServer := terraform.Output(t, terraformOptions, "login_server")

	// Assert
	assert.True(t, azure.ContainerRegistryExists(t, acrName, resourceGroupName, ""))

	actualACR := azure.GetContainerRegistry(t, acrName, resourceGroupName, "")

	assert.Equal(t, loginServer, *actualACR.LoginServer)
	assert.False(t, *actualACR.AdminUserEnabled)
	assert.Equal(t, "Premium", string(actualACR.Sku.Name))
}
