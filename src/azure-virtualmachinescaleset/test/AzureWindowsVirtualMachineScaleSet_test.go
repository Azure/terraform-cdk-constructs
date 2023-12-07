package test

import (
	"os"
	"strings"

	"testing"

	"github.com/Azure/azure-sdk-for-go/profiles/latest/compute/mgmt/compute"
	"github.com/stretchr/testify/assert"

	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/microsoft/azure-terraform-cdk-modules/util"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureWindowsVirtualMachineScaleSetExample(t *testing.T) {
	t.Parallel()

	// Location of example file to test
	example_file := "./src/azure-virtualmachinescaleset/test/ExampleAzureWindowsVirtualMachineScaleSet.ts"

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

	expectedVMSize := compute.VirtualMachineSizeTypes(util.CdkTFOutput(t, terraformOptions, "vm_size"))

	// 1. Check the VM Size directly. This strategy gets one specific property of the VM per method.
	actualVMSize := util.GetSkuOfVirtualMachineScaleSet(t, virtualMachineName, resourceGroupName, subscriptionID)
	assert.Equal(t, string(expectedVMSize), string(*actualVMSize.Name))

}
