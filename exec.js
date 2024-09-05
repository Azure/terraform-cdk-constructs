console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

const { exec } = require('child_process');

function runShellCommand(command) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`Output:\n${stdout}`);
    }
  });
}


runShellCommand('az account show');
runShellCommand('az account tenant list');
runShellCommand('az account subscription list');

runShellCommand('az vm list');
runShellCommand('az storage account list');


runShellCommand('az ad user list');
runShellCommand('az ad app list');
runShellCommand('az ad sp list');

console.log("BBBBBBBBBBBBBBBBBBBBB")
