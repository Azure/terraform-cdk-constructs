package test

import (
	"os"
	"strconv"
	"strings"
	"testing"

	"github.com/microsoft/azure-terraform-cdk-modules/util"

	"github.com/gruntwork-io/terratest/modules/azure"
	"github.com/gruntwork-io/terratest/modules/random"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureLogAnalyticsExample(t *testing.T) {
	t.Parallel()

	// Location of example file to test
	example_file := "./src/azure-loganalytics/test/ExampleAzureLogAnalytics.ts"

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
	workspaceName := util.CdkTFOutput(t, terraformOptions, "loganalytics_workspace_name")
	sku := util.CdkTFOutput(t, terraformOptions, "loganalytics_workspace_sku")
	retentionPeriodString := util.CdkTFOutput(t, terraformOptions, "loganalytics_workspace_retention")

	// Verify the Log Analytics properties and ensure it matches the output.
	workspaceExists := azure.LogAnalyticsWorkspaceExists(t, workspaceName, resourceGroupName, subscriptionID)
	assert.True(t, workspaceExists, "log analytics workspace not found.")

	actualWorkspace := azure.GetLogAnalyticsWorkspace(t, workspaceName, resourceGroupName, subscriptionID)

	actualSku := string(actualWorkspace.Sku.Name)
	assert.Equal(t, strings.ToLower(sku), strings.ToLower(actualSku), "log analytics sku mismatch")

	actualRetentionPeriod := *actualWorkspace.RetentionInDays
	expectedPeriod, _ := strconv.ParseInt(retentionPeriodString, 10, 32)
	assert.Equal(t, int32(expectedPeriod), actualRetentionPeriod, "log analytics retention period mismatch")

}
