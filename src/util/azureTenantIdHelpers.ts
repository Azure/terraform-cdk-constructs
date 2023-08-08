// getAzureTenantId.ts

import { execSync } from 'child_process';

// Use Az CLI to collect TenantID, if not logged in substitute fake TenantID
export function getAzureTenantId(): string {
    let tenantId: string;
    try {
        tenantId = execSync('az account show --query tenantId -o tsv').toString().trim();
    } catch (error) {
        console.log('Azure CLI is not logged in. Setting tenant ID to fake TenantID.');
        tenantId = '123e4567-e89b-12d3-a456-426614174000';
    }
    return tenantId;
}

// Removed TenantID from snapshot
export function removeTenantIdFromSnapshot(obj: Record<string, any>): Record<string, any> {
    for (let propName in obj) {
      if (propName === 'tenant_id') {
        delete obj[propName];
      } else if (typeof obj[propName] === 'object' && obj[propName] !== null) {
        removeTenantIdFromSnapshot(obj[propName]);
      }
    }
    return obj;
  }