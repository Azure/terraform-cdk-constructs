package test

import (
	"os"
	"strconv"
	"strings"
	"testing"

	"github.com/microsoft/terraform-azure-cdk-modules/util"

	"github.com/gruntwork-io/terratest/modules/azure"

	"github.com/gruntwork-io/terratest/modules/shell"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureLogAnalyticsExample(t *testing.T) {
	t.Parallel()

	stack_dir := "../../../cdktf.out/stacks/testAzureLogAnalytics"
	example_file := "./src/azure-loganalytics/test/ExampleAzureLogAnalytics.ts"

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
	workspaceName := terraform.Output(t, terraformOptions, "loganalytics_workspace_name")
	sku := terraform.Output(t, terraformOptions, "loganalytics_workspace_sku")
	retentionPeriodString := terraform.Output(t, terraformOptions, "loganalytics_workspace_retention")

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
