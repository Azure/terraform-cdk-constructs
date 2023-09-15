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

	stack_dir := "../../../cdktf.out/stacks/testExampleAzureDiagnosticSettings"
	example_file := "./src/azure-diagsettings/test/ExampleAzureDiagSettings.ts"

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

	expectedDiagnosticSettingName := terraform.Output(t, terraformOptions, "diag_settings_name")
	eventHubNamespaceID := terraform.Output(t, terraformOptions, "event_hub_namespace_id")

	diagnosticSettingsResourceExists := azure.DiagnosticSettingsResourceExists(t, expectedDiagnosticSettingName, eventHubNamespaceID, subscriptionID)

	assert.Equal(t, diagnosticSettingsResourceExists, true, "Diagnostic settings should exist")

}
