package util

import (
	"encoding/json"
	"math/rand"
	"os"
	"os/exec"
	"strings"
	"time"
)

func GetSubscriptionID() string {
	subscriptionID := os.Getenv("ARM_SUBSCRIPTION_ID")

	if subscriptionID == "" {
		out, err := exec.Command("az", "account", "show", "--query", "id", "-o", "tsv").Output()
		if err != nil {
			return "" // or handle error appropriately
		}

		subscriptionID = strings.TrimSpace(string(out))
	}

	return subscriptionID
}

func ReadFile(filePath string) ([]byte, error) {
	return os.ReadFile(filePath)
}

func UnmarshalJSON(data []byte) (map[string]interface{}, error) {
	var jsonData map[string]interface{}
	err := json.Unmarshal(data, &jsonData)
	return jsonData, err
}

func RandomizeResourceNames(resourceData map[string]interface{}, resourceName string) {
	if specificResourceData, ok := resourceData[resourceName].(map[string]interface{}); ok {
		for _, v := range specificResourceData {
			if specificResource, ok := v.(map[string]interface{}); ok {
				if _, ok := specificResource["name"]; ok {
					specificResource["name"] = randomString(10)
				}
			}
		}
	}
}

func MarshalJSON(jsonData map[string]interface{}) ([]byte, error) {
	return json.Marshal(jsonData)
}

func WriteFile(filePath string, jsonDataBytes []byte) error {
	return os.WriteFile(filePath, jsonDataBytes, os.ModePerm)
}

func RandomizeUniqueResources(filePath string) error {
	data, err := ReadFile(filePath)
	if err != nil {
		return err
	}

	jsonData, err := UnmarshalJSON(data)
	if err != nil {
		return err
	}

	if resourceData, ok := jsonData["resource"].(map[string]interface{}); ok {
		RandomizeResourceNames(resourceData, "azurerm_storage_account")
		RandomizeResourceNames(resourceData, "azurerm_resource_group")
		RandomizeResourceNames(resourceData, "azurerm_eventhub_namespace")
		RandomizeResourceNames(resourceData, "azurerm_key_vault")
		RandomizeResourceNames(resourceData, "azurerm_container_registry")
	}

	jsonDataBytes, err := MarshalJSON(jsonData)
	if err != nil {
		return err
	}

	err = WriteFile(filePath, jsonDataBytes)
	if err != nil {
		return err
	}

	return nil
}

// Generate a random string of the specified length
const allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789"

func randomString(length int) string {
	rand.Seed(time.Now().UnixNano())
	chars := []rune(allowedChars)
	result := make([]rune, length)
	for i := range result {
		result[i] = chars[rand.Intn(len(chars))]
	}
	return string(result)
}
