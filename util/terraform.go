package util

import (
	"fmt"
	"os"
	"path"
	"strings"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/gruntwork-io/terratest/modules/testing"
	"github.com/stretchr/testify/require"
)

// CdkTFInvalidBinary occurs when a cdktf function is called and the TerraformBinary is
// set to a value other than cdktf
type CdkTFInvalidBinary string

func (err CdkTFInvalidBinary) Error() string {
	return fmt.Sprintf("cdktf must be set as TerraformBinary to use this function. [ TerraformBinary : %s ]", string(err))
}

func CdkTFSynth(t testing.TestingT, options *terraform.Options, exampleFile string) (string, error) {
	if options.TerraformBinary != "cdktf" {
		t.Errorf("Invalid Terraform Binary")
		return "Failure", CdkTFInvalidBinary(options.TerraformBinary)
	}

	// Get the directory of the example_file
	dir := path.Dir(exampleFile)

	// Replace the filename with "tempstacks"
	tempstackfolder := path.Join(dir, ".tempstacks")

	// RunTerraformCommandE doesn't actually raise any errors. It returns them.
	result, err := terraform.RunTerraformCommandE(t, options, terraform.FormatArgs(options, "synth", "--app", "npx ts-node"+" "+exampleFile, "--output", tempstackfolder)...)
	if err != nil {
		t.Errorf("%s", err.Error())
	}
	return result, err
}

func CdkTFOutput(t testing.TestingT, options *terraform.Options, variableName string) string {
	options.TerraformBinary = "terraform"

	// Clone options with deep copy
	tfoutputOptions, err := options.Clone()
	if err != nil {
		return fmt.Sprintf("%s", err)
	}

	// List all directories inside stacksFolder
	stackDirs, err := os.ReadDir(".tempstacks/stacks")

	if err != nil {
		return fmt.Sprintf("%s", err)
	}

	// Iterate through each directory inside the "stacks" folder and run terraform.Output
	for _, stackDir := range stackDirs {
		if stackDir.IsDir() {
			currentDir := path.Join(".tempstacks/stacks", stackDir.Name())
			tfoutputOptions.TerraformDir = currentDir

			outputValue := terraform.Output(t, tfoutputOptions, variableName)
			if outputValue != "" {
				return outputValue
			}
		}
	}

	// If no value is found after iterating through all directories
	return ""
}

func CdkTFApplyAll(t testing.TestingT, options *terraform.Options, exampleFile string) (string, error) {

	options.TerraformBinary = "cdktf"

	// Get the directory of the example_file
	dir := path.Dir(exampleFile)

	// Replace the filename with "tempstacks"
	tempstackfolder := path.Join(dir, ".tempstacks")

	// If Vars is present, convert it to Args and remove it from the struct
	var args []string
	var varsArgs []string
	if options.Vars != nil {
		varsArgs = FormatTerraformVarsAsArgs(options.Vars)
		options.Vars = nil
	}

	// Format the remaining options into arguments
	args = append(args, terraform.FormatArgs(options, "deploy", "*", "--auto-approve", "--app", "npx ts-node"+" "+exampleFile, "--output", tempstackfolder)...)

	// If Vars was present, append its arguments to the end
	if varsArgs != nil {
		args = append(args, varsArgs...)
	}

	// RunTerraformCommandE doesn't actually raise any errors. It returns them.
	result, err := terraform.RunTerraformCommandE(t, options, args...)

	if err != nil {
		t.Errorf("%s", err.Error())
	}
	return result, err
}

func CdkTFDestroyAll(t testing.TestingT, options *terraform.Options, exampleFile string) (string, error) {

	options.TerraformBinary = "cdktf"

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

func CdkTFApplyAllAndIdempotent(t testing.TestingT, options *terraform.Options, exampleFile string) (string, error) {
	options.TerraformBinary = "cdktf"

	// Clone options with deep copy
	tfplanOptions, err := options.Clone()
	if err != nil {
		return "", err
	}

	out, err := CdkTFApplyAll(t, options, exampleFile)
	if err != nil {
		return out, err
	}

	nonIdempotentStacks, err := CheckStacksIdempotency(t, tfplanOptions, ".tempstacks/stacks")
	if err != nil {
		return out, err
	}

	if len(nonIdempotentStacks) > 0 {
		stacksStr := strings.Join(nonIdempotentStacks, ", ")
		err = fmt.Errorf("terraform configuration not idempotent for stacks: %s", stacksStr)
	}

	require.NoError(t, err)

	return out, err
}

func CheckStacksIdempotency(t testing.TestingT, options *terraform.Options, tempstackfolder string) ([]string, error) {
	options.TerraformBinary = "terraform"

	// List all directories under .tempstacks/stacks
	stackFolders, err := os.ReadDir(tempstackfolder)
	if err != nil {
		return nil, err
	}

	nonIdempotentStacks := []string{} // Slice to store stack directories with non-zero planexitcode

	for _, stackFolder := range stackFolders {
		if stackFolder.IsDir() {
			stackPath := path.Join(tempstackfolder, stackFolder.Name())
			options.TerraformDir = stackPath

			exitCode := terraform.PlanExitCode(t, options)

			// First, check the exit code.
			if exitCode != 0 {
				fmt.Printf("terraform plan exit code: %d\n", exitCode)
				nonIdempotentStacks = append(nonIdempotentStacks, stackFolder.Name())
			}

			// Then, handle any other errors from the PlanExitCodeE function.
			if err != nil {
				t.Errorf("%s", err.Error())
				require.NoError(t, err) // This will fail the test immediately if there's an error.
				return nil, err
			}
		}
	}

	return nonIdempotentStacks, nil
}

func formatTerraformArgs(vars map[string]interface{}, prefix string, useSpaceAsSeparator bool) []string {
	var args []string

	for key, value := range vars {
		argValue := fmt.Sprintf("%s=%s", key, value)
		if useSpaceAsSeparator {
			args = append(args, prefix, argValue)
		} else {
			args = append(args, fmt.Sprintf("%s=%s", prefix, argValue))
		}
	}

	return args
}

func FormatTerraformVarsAsArgs(vars map[string]interface{}) []string {
	return formatTerraformArgs(vars, "--var", true)
}
