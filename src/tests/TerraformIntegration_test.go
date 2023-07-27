package test

import (
	"flag"
	"testing"

	"github.com/gruntwork-io/terratest/modules/shell"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

var (
	azureExampleFilePath string
	stackDirPath         string
)

func init() {
	testing.Init() // Initializes testing package, which might modify flags.
	flag.StringVar(&azureExampleFilePath, "azureExampleFilePath", "", "Path to the Azure example file")
	flag.StringVar(&stackDirPath, "stackDirPath", "", "Path to the Terraform stack directory")
}

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformIntegration(t *testing.T) {
	t.Parallel()

	cmd := shell.Command{
		Command:    "cdktf",
		Args:       []string{"synth", "--app", "npx ts-node " + azureExampleFilePath},
		WorkingDir: "../../",
	}

	shell.RunCommandAndGetStdOut(t, cmd)

	terraformOptions := &terraform.Options{

		// The path to where our Terraform code is located
		TerraformDir: stackDirPath,
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApplyAndIdempotent(t, terraformOptions)
}
