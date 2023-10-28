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
	example_file := "./src/azure-diagsettings/test/ExampleAzureDiagSettings.ts"

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
	expectedDiagnosticSettingName := util.CdkTFOutput(t, terraformOptions, "diag_settings_name")
	eventHubNamespaceID := util.CdkTFOutput(t, terraformOptions, "event_hub_namespace_id")

	diagnosticSettingsResourceExists := azure.DiagnosticSettingsResourceExists(t, expectedDiagnosticSettingName, eventHubNamespaceID, subscriptionID)

	assert.Equal(t, diagnosticSettingsResourceExists, true, "Diagnostic settings should exist")

}
