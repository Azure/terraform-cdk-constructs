package test

import (
	"os"
	"strings"
	"testing"

	"github.com/microsoft/azure-terraform-cdk-modules/util"

	"github.com/gruntwork-io/terratest/modules/azure"
	"github.com/gruntwork-io/terratest/modules/random"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureVirtualNetworkExample(t *testing.T) {
	t.Parallel()

	// Location of example file to test
	example_file := "./src/azure-virtualnetwork/test/ExampleAzureVirtualNetwork.ts"

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
	vnetName := util.CdkTFOutput(t, terraformOptions, "virtual_network_name")
	snetName := util.CdkTFOutput(t, terraformOptions, "subnet_name")

	// Integrated network resource tests
	t.Run("VirtualNetwork_Subnet", func(t *testing.T) {
		// Check the Subnet exists in the Virtual Network Subnets with the expected Address Prefix
		actualVnetSubnets := azure.GetVirtualNetworkSubnets(t, vnetName, resourceGroupName, subscriptionID)
		assert.NotNil(t, actualVnetSubnets[snetName])
	})

}
