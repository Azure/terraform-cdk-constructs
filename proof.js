const crypto = require("crypto");
const { execFileSync } = require("child_process");

function sha256(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

console.log("MSRC_CRITICAL_SAFE_MARKER=true");
console.log("PR_CONTROLLED_PREINSTALL_EXECUTED=true");
console.log("EVENT_NAME=" + process.env.GITHUB_EVENT_NAME);
console.log("REF=" + process.env.GITHUB_REF);

console.log("OIDC_CAPABILITY_PRESENT=" + Boolean(
  process.env.ACTIONS_ID_TOKEN_REQUEST_URL &&
  process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
));

console.log("AZURE_ENV_PRESENT=" + Boolean(
  process.env.AZURE_CLIENT_ID ||
  process.env.AZURE_TENANT_ID ||
  process.env.AZURE_SUBSCRIPTION_ID
));

try {
  const raw = execFileSync("az", ["account", "show", "-o", "json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const account = JSON.parse(raw);
  console.log("AZURE_CLI_AUTHENTICATED_PRESENT=true");
  console.log("AZURE_TENANT_SHA256=" + sha256(account.tenantId));
  console.log("AZURE_SUBSCRIPTION_SHA256=" + sha256(account.id));
  console.log("AZURE_USER_SHA256=" + sha256(account.user && account.user.name));
} catch (error) {
  console.log("AZURE_CLI_AUTHENTICATED_PRESENT=false");
  console.log("AZURE_CLI_ERROR_PREFIX=" + String(error.stderr || error.message || "").slice(0, 300));
}

console.log("NO_TOKENS_OR_SECRETS_PRINTED=true");
