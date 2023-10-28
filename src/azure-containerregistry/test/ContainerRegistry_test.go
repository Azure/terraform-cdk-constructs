package test

import (
	"os"
	"strings"
	"testing"

	"github.com/gruntwork-io/terratest/modules/azure"
	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/microsoft/azure-terraform-cdk-modules/util"
	"github.com/stretchr/testify/assert"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureContainerRegistryExample(t *testing.T) {
	t.Parallel()

	// Location of example file to test
	example_file := "./src/azure-containerregistry/test/ExampleAzureContainerRegistry.ts"

	// subscriptionID is overridden by the environment variable "ARM_SUBSCRIPTION_ID"
	subscriptionID := util.GetSubscriptionID()
	os.Setenv("ARM_SUBSCRIPTION_ID", subscriptionID)

	// Randomize System Name
	rndName := strings.ToLower(random.UniqueId())

	terraformOptions := &terraform.Options{
		TerraformBinary: "cdktf",
		//Terraform Variables
		Vars: map[string]interface{}{
			"name": rndName,
		},
		TerraformDir: "../../../",
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer func() {
		util.CdkTFDestroyAll(t, terraformOptions, example_file)
		os.RemoveAll("./.tempstacks")
	}()
	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	util.CdkTFApplyAllAndIdempotent(t, terraformOptions, example_file)

	// Run `terraform output` to get the values of output variables
	resourceGroupName := util.CdkTFOutput(t, terraformOptions, "resource_group_name")
	acrName := util.CdkTFOutput(t, terraformOptions, "container_registry_name")
	loginServer := util.CdkTFOutput(t, terraformOptions, "login_server")

	// Assert
	assert.True(t, azure.ContainerRegistryExists(t, acrName, resourceGroupName, ""))

	actualACR := azure.GetContainerRegistry(t, acrName, resourceGroupName, "")

	assert.Equal(t, loginServer, *actualACR.LoginServer)
	assert.False(t, *actualACR.AdminUserEnabled)
	assert.Equal(t, "Premium", string(actualACR.Sku.Name))
}
