# Azure SRE Agent

This module provides a CDK construct for creating and managing Azure SRE Agents
(`Microsoft.App/agents`) via the AZAPI provider. SRE Agents are AI-powered Site
Reliability Engineering agents that can be configured with knowledge graphs,
actions, and incident management integrations.

## Overview

- **Resource type**: `Microsoft.App/agents`
- **API version**: `2026-01-01` (latest stable)
- **Reference**: [Azure REST API specs – SreAgent](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/SreAgent)

## Installation

```bash
npm install @microsoft/terraform-cdk-constructs
```

## Quick Start

```typescript
import { SreAgent } from "@microsoft/terraform-cdk-constructs/azure-sreagent";
import { ResourceGroup } from "@microsoft/terraform-cdk-constructs/azure-resourcegroup";

const resourceGroup = new ResourceGroup(this, "rg", {
  name: "my-sre-agent-rg",
  location: "eastus",
});

new SreAgent(this, "sre-agent", {
  name: "my-sre-agent",
  location: "eastus",
  resourceGroupId: resourceGroup.id,
  identity: { type: "SystemAssigned" },
  agentIdentity: {
    initialSponsorGroupId: "<azure-ad-object-id>",
  },
  upgradeChannel: "Stable",
  tags: {
    environment: "production",
  },
});
```

## Properties

| Property                          | Type                       | Required | Description                                                                |
| --------------------------------- | -------------------------- | -------- | -------------------------------------------------------------------------- |
| `name`                            | `string`                   | Yes      | Name of the SRE Agent                                                      |
| `location`                        | `string`                   | Yes      | Azure region                                                               |
| `resourceGroupId`                 | `string`                   | No       | Parent resource group ID (required for proper scoping)                     |
| `identity`                        | `SreAgentManagedIdentity`  | No       | Managed service identity (SystemAssigned / UserAssigned)                   |
| `agentIdentity`                   | `SreAgentIdentity`         | No       | Agent runtime identity (requires `initialSponsorGroupId`)                  |
| `agentSpaceId`                    | `string`                   | No       | ARM ID of the parent `Microsoft.App/agentSpaces`                           |
| `defaultModel`                    | `SreAgentDefaultModel`     | No       | Default AI model configuration                                             |
| `knowledgeGraphConfiguration`     | `object`                   | No       | Knowledge graph configuration                                              |
| `actionConfiguration`             | `object`                   | No       | Action configuration                                                       |
| `logConfiguration`                | `object`                   | No       | Log configuration                                                          |
| `incidentManagementConfiguration` | `object`                   | No       | Incident management configuration                                          |
| `upgradeChannel`                  | `string`                   | No       | Upgrade channel for the agent                                              |
| `tags`                            | `{ [key: string]: string }`| No       | Resource tags                                                              |
| `ignoreChanges`                   | `string[]`                 | No       | Lifecycle `ignore_changes` rules                                           |
| `apiVersion`                      | `string`                   | No       | Pin to a specific API version (default: latest)                            |

## Outputs

The construct exposes the following outputs:

- `id` – Resource ID of the SRE Agent
- `name` – Resource name
- `location` – Resource location
- `tags` – Tags assigned to the resource
- `agent_endpoint` – Data plane endpoint of the agent
- `provisioning_state` – Provisioning state
- `power_state` – Power state (`Running` or `Stopped`)

## Testing

- Unit tests: `npm test`
- Integration tests: `npm run integration` (requires Azure credentials and a
  valid `SRE_AGENT_SPONSOR_GROUP_ID` environment variable)
