package util

import (
	"os"
	"os/exec"
	"strings"
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
