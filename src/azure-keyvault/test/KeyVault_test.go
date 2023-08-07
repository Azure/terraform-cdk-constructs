package test

import (
	"os"
	"testing"

	"github.com/microsoft/terraform-azure-cdk-modules/util"
	"github.com/stretchr/testify/assert"

	"github.com/gruntwork-io/terratest/modules/azure"
	"github.com/gruntwork-io/terratest/modules/shell"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureKeyVaultExample(t *testing.T) {
	t.Parallel()

	stack_dir := "../../../cdktf.out/stacks/testAzureKeyVault"
	example_file := "./src/azure-keyvault/test/ExampleAzureKeyVault.ts"

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
	keyVaultName := terraform.Output(t, terraformOptions, "key_vault_name")

	// Determine whether the keyvault exists
	keyVault := azure.GetKeyVault(t, resourceGroupName, keyVaultName, "")
	assert.Equal(t, keyVaultName, *keyVault.Name)

}
