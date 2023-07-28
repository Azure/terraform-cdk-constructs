package test

import (
	"io/ioutil"
	"log"
	"math/rand"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/tidwall/gjson"
	"github.com/tidwall/sjson"

	"github.com/gruntwork-io/terratest/modules/shell"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

// An example of how to test the Terraform module in examples/terraform-azure-example using Terratest.
func TestTerraformCDKAzureResourceGroupExample(t *testing.T) {
	t.Parallel()

	cmd := shell.Command{
		Command:    "cdktf",
		Args:       []string{"synth", "--app", "npx ts-node ./src/resource-group/ExampleAzureResourceGroup.ts"},
		WorkingDir: "../",
	}

	shell.RunCommandAndGetStdOut(t, cmd)

	RandomizeResourceGroupName("../cdktf.out/stacks/testAzureResourceGroup/cdk.tf.json")

	terraformOptions := &terraform.Options{

		// The path to where our Terraform code is located
		TerraformDir: "../cdktf.out/stacks/testAzureResourceGroup",
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApplyAndIdempotent(t, terraformOptions)
}

func ReadFile(path string) []byte {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}
	return data
}

func FindResourceGroupKey(data []byte) string {
	resourceGroupKey := ""
	gjson.Get(string(data), "resource.azurerm_resource_group").ForEach(func(key, value gjson.Result) bool {
		if strings.HasPrefix(key.String(), "testRG_rg") {
			resourceGroupKey = key.String()
			return false // stop iterating
		}
		return true // keep iterating
	})

	if resourceGroupKey == "" {
		log.Fatal("Could not find a key that starts with testRG_rg")
	}

	return resourceGroupKey
}

func GenerateRandomName() string {
	rand.Seed(time.Now().UnixNano())
	return "rg-test-" + strconv.Itoa(rand.Intn(1000))
}

func SetNewName(data []byte, resourceGroupKey string, randomName string) []byte {
	newData, err := sjson.Set(string(data), "resource.azurerm_resource_group."+resourceGroupKey+".name", randomName)
	if err != nil {
		log.Fatal(err)
	}
	return []byte(newData)
}

func WriteFile(path string, data []byte) {
	err := ioutil.WriteFile(path, data, 0644)
	if err != nil {
		log.Fatal(err)
	}
}

func RandomizeResourceGroupName(path string) {
	data := ReadFile(path)
	resourceGroupKey := FindResourceGroupKey(data)
	randomName := GenerateRandomName()
	newData := SetNewName(data, resourceGroupKey, randomName)
	WriteFile(path, newData)
}
