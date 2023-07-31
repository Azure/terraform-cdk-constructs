package test

import (
	"os"
	"testing"

	"github.com/microsoft/terraform-azure-cdk-modules/util"

	"github.com/gruntwork-io/terratest/modules/shell"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureApplicationInsightsExample(t *testing.T) {
	t.Parallel()

	// subscriptionID is overridden by the environment variable "ARM_SUBSCRIPTION_ID"
	subscriptionID := util.GetSubscriptionID()
	os.Setenv("ARM_SUBSCRIPTION_ID", subscriptionID)

	cmd := shell.Command{
		Command:    "cdktf",
		Args:       []string{"synth", "--app", "npx ts-node ./src/application-insights/ExampleAzureApplicationInsights.ts"},
		WorkingDir: "../",
	}

	shell.RunCommandAndGetStdOut(t, cmd)

	terraformOptions := &terraform.Options{

		// The path to where our Terraform code is located
		TerraformDir: "../cdktf.out/stacks/testAzureApplicationInsights",
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApplyAndIdempotent(t, terraformOptions)

}
