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
func TestTerraformCDKAzureVirtualNetworkExample(t *testing.T) {
	t.Parallel()

	stack_dir := "../../../cdktf.out/stacks/testAzureNetworkSecurityGroup"
	example_file := "./src/azure-networksecuritygroup/test/ExampleAzureNetworkSecurityGroup.ts"

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
	nsgName := terraform.Output(t, terraformOptions, "nsg_name")
	sshRuleName := terraform.Output(t, terraformOptions, "ssh_rule_name")

	rules, err := azure.GetAllNSGRulesE(resourceGroupName, nsgName, "")
	assert.NoError(t, err)
	// We should have a rule for allowing ssh
	sshRule := rules.FindRuleByName(sshRuleName)

	// That rule should allow port 22 inbound
	assert.True(t, sshRule.AllowsDestinationPort(t, "22"))

}
