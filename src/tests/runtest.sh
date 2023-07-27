# example of how to run the integration test with Golang
go test -v -args -azureExampleFilePath=./src/resource-group/ExampleAzureResourceGroup.ts -stackDirPath=../../cdktf.out/stacks/testAzureResourceGroup TerraformIntegration_test.go
