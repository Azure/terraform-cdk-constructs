package util

import (
	"fmt"
	"path"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/gruntwork-io/terratest/modules/testing"
)

// CdkTFInvalidBinary occurs when a cdktf function is called and the TerraformBinary is
// set to a value other than cdktf
type CdkTFInvalidBinary string

func (err CdkTFInvalidBinary) Error() string {
	return fmt.Sprintf("cdktf must be set as TerraformBinary to use this function. [ TerraformBinary : %s ]", string(err))
}

func CdkTFApplyAll(t testing.TestingT, options *terraform.Options, exampleFile string) (string, error) {
	if options.TerraformBinary != "cdktf" {
		t.Errorf("Invalid Terraform Binary")
		return "Failure", CdkTFInvalidBinary(options.TerraformBinary)
	}

	// Get the directory of the example_file
	dir := path.Dir(exampleFile)

	// Replace the filename with "tempstacks"
	tempstackfolder := path.Join(dir, ".tempstacks")

	// RunTerraformCommandE doesn't actually raise any errors. It returns them.
	result, err := terraform.RunTerraformCommandE(t, options, terraform.FormatArgs(options, "deploy", "*", "--auto-approve", "--app", "npx ts-node"+" "+exampleFile, "--output", tempstackfolder)...)
	if err != nil {
		t.Errorf("%s", err.Error())
	}
	return result, err
}

func CdkTFDestroyAll(t testing.TestingT, options *terraform.Options, exampleFile string) (string, error) {
	if options.TerraformBinary != "cdktf" {
		t.Errorf("Invalid Terraform Binary")
		return "", CdkTFInvalidBinary(options.TerraformBinary)
	}

	// Get the directory of the example_file
	dir := path.Dir(exampleFile)

	// Replace the filename with "tempstacks"
	tempstackfolder := path.Join(dir, ".tempstacks")

	cmdoutput := fmt.Sprintf("--output %s", tempstackfolder)

	// RunTerraformCommandE doesn't actually raise any errors. It returns them.
	result, err := terraform.RunTerraformCommandE(t, options, terraform.FormatArgs(options, "destroy", "*", "--skip-synth", "--auto-approve", "--app", "npx ts-node"+" "+exampleFile, cmdoutput)...)
	if err != nil {
		t.Errorf("%s", err.Error())
	}
	return result, err

}
