package util

import (
	"context"

	"github.com/Azure/azure-sdk-for-go/services/compute/mgmt/2019-07-01/compute"

	"github.com/gruntwork-io/terratest/modules/azure"
	"github.com/gruntwork-io/terratest/modules/testing"
	"github.com/stretchr/testify/require"
)

// GetVirtualMachineScaleSetClient is a helper function that will setup an Azure Virtual Machine Scale Set client on your behalf.
func GetVirtualMachineScaleSetClient(t testing.TestingT, subscriptionID string) *compute.VirtualMachineScaleSetsClient {
	vmssClient, err := GetVirtualMachineScaleSetClientE(subscriptionID)
	require.NoError(t, err)
	return vmssClient
}

// GetVirtualMachineScaleSetClientE is a helper function that will setup an Azure Virtual Machine Scale Set client on your behalf.
func GetVirtualMachineScaleSetClientE(subscriptionID string) (*compute.VirtualMachineScaleSetsClient, error) {
	// Create a VMSS client
	vmssClient := compute.NewVirtualMachineScaleSetsClient(subscriptionID)

	// Create an authorizer
	authorizer, err := azure.NewAuthorizer()
	if err != nil {
		return nil, err
	}

	// Attach authorizer to the client
	vmssClient.Authorizer = *authorizer
	return &vmssClient, nil
}

// VirtualMachineScaleSetExists indicates whether the specified Azure Virtual Machine Scale Set exists.
// This function would fail the test if there is an error.
func VirtualMachineScaleSetExists(t testing.TestingT, vmssName string, resGroupName string, subscriptionID string) bool {
	exists, err := VirtualMachineScaleSetExistsE(vmssName, resGroupName, subscriptionID)
	require.NoError(t, err)
	return exists
}

// VirtualMachineScaleSetExistsE indicates whether the specified Azure Virtual Machine Scale Set exists.
func VirtualMachineScaleSetExistsE(vmssName string, resGroupName string, subscriptionID string) (bool, error) {
	// Get VMSS client
	client, err := GetVirtualMachineScaleSetClientE(subscriptionID)
	if err != nil {
		return false, err
	}

	// Get the VMSS
	_, err = client.Get(context.Background(), resGroupName, vmssName)
	if err != nil {
		if azure.ResourceNotFoundErrorExists(err) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// GetVirtualMachineScaleSet gets a Virtual Machine Scale Set in the specified Azure Resource Group.
// This function would fail the test if there is an error.
func GetVirtualMachineScaleSet(t testing.TestingT, vmssName string, resGroupName string, subscriptionID string) *compute.VirtualMachineScaleSet {
	vmss, err := GetVirtualMachineScaleSetE(vmssName, resGroupName, subscriptionID)
	require.NoError(t, err)
	return vmss
}

// GetVirtualMachineScaleSetE gets a Virtual Machine Scale Set in the specified Azure Resource Group.
func GetVirtualMachineScaleSetE(vmssName string, resGroupName string, subscriptionID string) (*compute.VirtualMachineScaleSet, error) {
	// Get the VMSS client reference
	client, err := GetVirtualMachineScaleSetClientE(subscriptionID)
	if err != nil {
		return nil, err
	}

	// Get the VMSS object
	vmss, err := client.Get(context.Background(), resGroupName, vmssName)
	if err != nil {
		return nil, err
	}

	return &vmss, nil
}

// GetSkuOfVirtualMachineScaleSet gets the SKU of the specified Azure Virtual Machine Scale Set.
// This function would fail the test if there is an error.
func GetSkuOfVirtualMachineScaleSet(t testing.TestingT, vmssName string, resGroupName string, subscriptionID string) *compute.Sku {
	sku, err := GetSkuOfVirtualMachineScaleSetE(vmssName, resGroupName, subscriptionID)
	require.NoError(t, err)

	return sku
}

// GetSkuOfVirtualMachineScaleSetE gets the SKU of the specified Azure Virtual Machine Scale Set.
func GetSkuOfVirtualMachineScaleSetE(vmssName string, resGroupName string, subscriptionID string) (*compute.Sku, error) {
	// Get VMSS Object
	vmss, err := GetVirtualMachineScaleSetE(vmssName, resGroupName, subscriptionID)
	if err != nil {
		return nil, err
	}

	return vmss.Sku, nil
}
