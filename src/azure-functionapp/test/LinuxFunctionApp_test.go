package test

import (
	"os"
	"strings"
	"testing"

	"github.com/microsoft/azure-terraform-cdk-modules/util"
	"github.com/stretchr/testify/assert"

	"github.com/gruntwork-io/terratest/modules/azure"
	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureLinuxFunctionAppExample(t *testing.T) {
	t.Parallel()

	// Location of example file to test
	example_file := "./src/azure-functionapp/test/ExampleAzureLinuxFunctionApp.ts"

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
	appName := util.CdkTFOutput(t, terraformOptions, "function_app_name")

	appId := util.CdkTFOutput(t, terraformOptions, "function_app_id")
	appDefaultHostName := util.CdkTFOutput(t, terraformOptions, "default_hostname")
	appKind := util.CdkTFOutput(t, terraformOptions, "function_app_kind")

	// website::tag::4:: Assert
	assert.True(t, azure.AppExists(t, appName, resourceGroupName, ""))
	site := azure.GetAppService(t, appName, resourceGroupName, "")

	assert.Equal(t, appId, *site.ID)
	assert.Equal(t, appDefaultHostName, *site.DefaultHostName)
	assert.Equal(t, appKind, *site.Kind)

	assert.NotEmpty(t, *site.OutboundIPAddresses)
	assert.Equal(t, "Running", *site.State)

}
