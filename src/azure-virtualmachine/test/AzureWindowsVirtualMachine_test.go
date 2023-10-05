package test

import (
	"crypto/tls"
	"fmt"
	"os"
	"testing"
	"time"

	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"

	"github.com/Azure/azure-sdk-for-go/profiles/latest/compute/mgmt/compute"
	"github.com/microsoft/terraform-azure-cdk-modules/util"
	"github.com/stretchr/testify/assert"

	"github.com/gruntwork-io/terratest/modules/azure"
	"github.com/gruntwork-io/terratest/modules/shell"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureWindowsVirtualMachineExample(t *testing.T) {
	t.Parallel()

	stack_dir := "../../../cdktf.out/stacks/testAzureWindowsVirtualMachineExample"
	example_file := "./src/azure-virtualmachine/test/ExampleAzureWindowsVirtualMachine.ts"

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
	virtualMachineName := terraform.Output(t, terraformOptions, "vm_name")
	endpoint := terraform.Output(t, terraformOptions, "vm_endpoint")

	expectedVMSize := compute.VirtualMachineSizeTypes(terraform.Output(t, terraformOptions, "vm_size"))

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
