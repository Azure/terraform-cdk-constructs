package util

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	rnd "math/rand"
	"os"
	"os/exec"
	"strings"
	"time"
)

type Data map[string]interface{}

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

func RandomizeUniqueResources(filePath string) {
	jsonFile, err := ioutil.ReadFile(filePath)
	if err != nil {
		log.Fatal(err)
	}

	var data Data
	err = json.Unmarshal(jsonFile, &data)
	if err != nil {
		log.Fatal(err)
	}

	newName := generateRandomName(10)

	traverseAndUpdate(data, "", newName)

	err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		log.Fatal(err)
	}
}

func traverseAndUpdate(data Data, path string, newName string) {
	for key, value := range data {
		switch v := value.(type) {
		case Data:
			newPath := path + "/" + key
			if strings.HasSuffix(newPath, "azurerm_resource_group") ||
				strings.HasSuffix(newPath, "azurerm_storage_account") {
				if _, ok := v["name"]; ok {
					v["name"] = newName
				}
			}
			traverseAndUpdate(v, newPath, newName)
		case []interface{}:
			for i := range v {
				if subData, ok := v[i].(Data); ok {
					traverseAndUpdate(subData, path+"/"+key, newName)
				}
			}
		default:
		}
	}
}

func generateRandomName(n int) string {
	rnd.Seed(time.Now().UnixNano())
	letterBytes := "abcdefghijklmnopqrstuvwxyz"
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rnd.Intn(len(letterBytes))]
	}
	return string(b)
}
