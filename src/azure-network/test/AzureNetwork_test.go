package test

import (
	"os"
	"testing"

	"github.com/microsoft/terraform-azure-cdk-modules/util"

	"github.com/gruntwork-io/terratest/modules/azure"

	"github.com/gruntwork-io/terratest/modules/shell"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureNetworkExample(t *testing.T) {
	t.Parallel()

	stack_dir := "../../../cdktf.out/stacks/testAzureNetwork"
	example_file := "./src/azure-network/test/ExampleAzureNetwork.ts"

	// subscriptionID is overridden by the environment variable "ARM_SUBSCRIPTION_ID"
	subscriptionID := util.GetSubscriptionID()
	os.Setenv("ARM_SUBSCRIPTION_ID", subscriptionID)

	cmd := shell.Command{
		Command:    "cdktf",
		Args:       []string{"synth", "--app", "npx ts-node" + " " + example_file},
		WorkingDir: "../../../",
	}

	shell.RunCommandAndGetStdOut(t, cmd)

	util.RandomizeUniqueResources(stack_dir + "/cdk.tf.json")

	terraformOptions := &terraform.Options{

		// The path to where our Terraform code is located
		TerraformDir: stack_dir,
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApplyAndIdempotent(t, terraformOptions)

	// Run `terraform output` to get the values of output variables
	resourceGroupName := terraform.Output(t, terraformOptions, "resource_group_name")
	vnetName := terraform.Output(t, terraformOptions, "virtual_network_name")
	snetName := terraform.Output(t, terraformOptions, "subnet_name")

	// Integrated network resource tests
	t.Run("VirtualNetwork_Subnet", func(t *testing.T) {
		// Check the Subnet exists in the Virtual Network Subnets with the expected Address Prefix
		actualVnetSubnets := azure.GetVirtualNetworkSubnets(t, vnetName, resourceGroupName, subscriptionID)
		assert.NotNil(t, actualVnetSubnets[snetName])
	})

}
