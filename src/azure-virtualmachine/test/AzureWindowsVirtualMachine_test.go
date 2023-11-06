package test

import (
	"crypto/tls"
	"fmt"
	"os"
	"strings"
	"testing"
	"time"

	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"
	"github.com/gruntwork-io/terratest/modules/random"

	"github.com/Azure/azure-sdk-for-go/profiles/latest/compute/mgmt/compute"
	"github.com/microsoft/azure-terraform-cdk-modules/util"
	"github.com/stretchr/testify/assert"

	"github.com/gruntwork-io/terratest/modules/azure"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureWindowsVirtualMachineExample(t *testing.T) {
	t.Parallel()

	// Location of example file to test
	example_file := "./src/azure-virtualmachine/test/ExampleAzureWindowsVirtualMachine.ts"

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
	virtualMachineName := util.CdkTFOutput(t, terraformOptions, "vm_name")
	endpoint := util.CdkTFOutput(t, terraformOptions, "vm_endpoint")

	expectedVMSize := compute.VirtualMachineSizeTypes(util.CdkTFOutput(t, terraformOptions, "vm_size"))

	// 1. Check the VM Size directly. This strategy gets one specific property of the VM per method.
	actualVMSize := azure.GetSizeOfVirtualMachine(t, virtualMachineName, resourceGroupName, subscriptionID)
	assert.Equal(t, string(expectedVMSize), string(actualVMSize))

	// Test the endpoint for up to 5 minutes. This will only fail if we timeout waiting for the service to return a 200
	// response.
	http_helper.HttpGetWithRetryWithCustomValidation(
		t,
		fmt.Sprintf("http://%s", endpoint),
		&tls.Config{},
		30,
		10*time.Second,
		func(statusCode int, body string) bool {
			return statusCode == 200
		},
	)
}
