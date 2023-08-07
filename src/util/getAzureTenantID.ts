// azureTools.ts

import { execSync } from 'child_process';

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
