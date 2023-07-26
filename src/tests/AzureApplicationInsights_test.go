package test

import (
	"testing"

	"github.com/gruntwork-io/terratest/modules/shell"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureApplicationInsightsExample(t *testing.T) {
	t.Parallel()

	cmd := shell.Command{
		Command:    "cdktf",
		Args:       []string{"synth", "--app", "npx ts-node ./src/examples/AzureApplicationInsights.ts"},
		WorkingDir: "../../",
	}

	shell.RunCommandAndGetStdOut(t, cmd)

	terraformOptions := &terraform.Options{

		// The path to where our Terraform code is located
		TerraformDir: "../../cdktf.out/stacks/testAzureApplicationInsights",
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApplyAndIdempotent(t, terraformOptions)
}
