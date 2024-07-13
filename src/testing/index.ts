import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as cdktf from "cdktf";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";

export class BaseTestStack extends TerraformStack {
  public readonly name: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const name = new cdktf.TerraformVariable(this, "name", {
      type: "string",
      default: "test",
      description: "System name used to randomize the resources",
    });

    this.name = name.value;
  }
}

export function execTerraformCommand(
  command: string,
  opts: ExecSyncOptionsWithStringEncoding,
  streamOutput: boolean,
): { stdout: string; stderr: string; exitCode: number } {
  try {
    if (streamOutput) {
      execSync(command, { ...opts, stdio: "inherit" });
      return { stdout: "", stderr: "", exitCode: 0 };
    } else {
      const stdout = execSync(command, { ...opts, stdio: "pipe" }).toString();
      return { stdout, stderr: "", exitCode: 0 };
    }
  } catch (error: any) {
    const stdout = error.stdout ? error.stdout.toString() : "";
    const stderr = error.stderr ? error.stderr.toString() : "";
    return { stdout, stderr, exitCode: error.status || 1 };
  }
}

export function TerraformApply(
  stack: any,
  streamOutput: boolean = false,
): { stdout: string; stderr: string; error: any } {
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve(stack, "manifest.json"), "utf8"),
    );
    const stacks = Object.entries(manifest.stacks);

    for (const [, stackDetails] of stacks) {
      const opts: ExecSyncOptionsWithStringEncoding = {
        cwd: path.resolve(stack, (stackDetails as any).workingDirectory),
        env: process.env,
        encoding: "utf-8",
      };

      const initResult = execTerraformCommand(
        `terraform init`,
        opts,
        streamOutput,
      );
      if (initResult.exitCode !== 0)
        throw new Error(
          `Terraform init failed: ${initResult.stdout} ${initResult.stderr}`,
        );

      const applyResult = execTerraformCommand(
        `terraform apply -auto-approve`,
        opts,
        streamOutput,
      );
      if (applyResult.exitCode !== 0) {
        return {
          stdout: applyResult.stdout,
          stderr: applyResult.stderr,
          error: new Error(
            `Terraform apply failed: ${applyResult.stdout} ${applyResult.stderr}`,
          ),
        };
      }
    }

    return { stdout: "Terraform apply succeeded", stderr: "", error: null };
  } catch (error: any) {
    console.error("Error during Terraform init or apply:", error);
    return { stdout: "", stderr: "", error };
  }
}

export function TerraformPlanExitCode(
  stack: any,
  streamOutput: boolean = false,
): { stdout: string; stderr: string; exitCode: number; error: any } {
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve(stack, "manifest.json"), "utf8"),
    );
    const stacks = Object.entries(manifest.stacks);

    for (const [, stackDetails] of stacks) {
      const opts: ExecSyncOptionsWithStringEncoding = {
        cwd: path.resolve(stack, (stackDetails as any).workingDirectory),
        env: process.env,
        encoding: "utf-8",
      };

      const initResult = execTerraformCommand(
        `terraform init`,
        opts,
        streamOutput,
      );
      if (initResult.exitCode !== 0)
        throw new Error(
          `Terraform init failed: ${initResult.stdout} ${initResult.stderr}`,
        );

      const planResult = execTerraformCommand(
        `terraform plan -input=false -lock=false -detailed-exitcode`,
        opts,
        streamOutput,
      );
      return {
        stdout: planResult.stdout,
        stderr: planResult.stderr,
        exitCode: planResult.exitCode,
        error: null,
      };
    }

    return {
      stdout: "Terraform plan succeeded",
      stderr: "",
      exitCode: 0,
      error: null,
    };
  } catch (error: any) {
    console.error("Error during Terraform init or plan:", error);
    return { stdout: "", stderr: "", exitCode: 1, error };
  }
}
export function TerraformIdempotentCheck(stack: any): AssertionReturn {
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve(stack, "manifest.json"), "utf8"),
    );
    const stacks = Object.entries(manifest.stacks);

    for (const [, stackDetails] of stacks) {
      const opts = {
        cwd: path.resolve(stack, (stackDetails as any).workingDirectory),
        env: process.env,
        stdio: "pipe",
      } as any;

      execSync(`terraform init`, opts);

      let planOutput: string;
      try {
        planOutput = execSync(
          `terraform plan -input=false -detailed-exitcode`,
          opts,
        ).toString();
      } catch (error: any) {
        planOutput = error.stdout ? error.stdout.toString() : "";
      }

      if (
        planOutput.includes(
          "No changes. Your infrastructure matches the configuration.",
        )
      ) {
        return new AssertionReturn(
          `Expected subject to be idempotent with no changes`,
          true,
        );
      } else {
        throw new Error(`Plan resulted in changes:\n${planOutput}`);
      }
    }

    return new AssertionReturn(
      `Expected subject to be idempotent with no changes`,
      true,
    );
  } catch (error) {
    console.error("Error during Terraform init or plan:", error);
    throw error;
  }
}

export function TerraformDestroy(
  stack: any,
  streamOutput: boolean = false,
): AssertionReturn {
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve(stack, "manifest.json"), "utf8"),
    );
    const stacks = Object.entries(manifest.stacks);

    for (const [, stackDetails] of stacks) {
      const opts: ExecSyncOptionsWithStringEncoding = {
        cwd: path.resolve(stack, (stackDetails as any).workingDirectory),
        env: process.env,
        encoding: "utf-8",
      };

      const initResult = execTerraformCommand(
        `terraform init`,
        opts,
        streamOutput,
      );
      if (initResult.exitCode !== 0)
        throw new Error(
          `Terraform init failed: ${initResult.stdout} ${initResult.stderr}`,
        );

      const destroyResult = execTerraformCommand(
        `terraform destroy -auto-approve`,
        opts,
        streamOutput,
      );
      if (destroyResult.exitCode !== 0)
        throw new Error(
          `Terraform destroy failed: ${destroyResult.stdout} ${destroyResult.stderr}`,
        );
    }

    return new AssertionReturn(
      `Expected subject to destroy successfully`,
      true,
    );
  } catch (error: any) {
    console.error("Error during Terraform init or destroy:", error);
    return new AssertionReturn(
      `Expected subject to destroy successfully`,
      false,
    );
  }
}

export function TerraformApplyAndCheckIdempotency(
  stack: any,
  streamOutput: boolean = false,
): AssertionReturn {
  const applyResult = TerraformApply(stack, streamOutput);
  if (applyResult.error) {
    return new AssertionReturn(applyResult.error.message, false);
  }

  const planResult = TerraformPlanExitCode(stack, streamOutput);
  if (planResult.error) {
    return new AssertionReturn(planResult.error.message, false);
  }

  if (planResult.exitCode !== 0) {
    return new AssertionReturn(
      `Terraform configuration not idempotent:\n${planResult.stdout}`,
      false,
    );
  }

  return new AssertionReturn(
    `Terraform apply and idempotency check completed successfully`,
    true,
  );
}

export function TerraformApplyCheckAndDestroy(stack: any): void {
  try {
    const applyAndCheckResult = TerraformApplyAndCheckIdempotency(stack);
    if (!applyAndCheckResult.pass) {
      throw new Error(applyAndCheckResult.message);
    }
  } catch (error) {
    console.error("Error during Terraform apply and idempotency check:", error);
    throw error; // Re-throw the error to ensure the test fails
  } finally {
    try {
      const destroyResult = TerraformDestroy(stack);
      if (!destroyResult.pass) {
        console.error("Error during Terraform destroy:", destroyResult.message);
      }
    } catch (destroyError) {
      console.error("Error during Terraform destroy:", destroyError);
    }
  }
}

export function TerraformPlan(stack: any): AssertionReturn {
  try {
    // Assuming the presence of a received variable pointing to the relevant directory
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve(stack, "manifest.json"), "utf8"),
    );
    const stacks = Object.entries(manifest.stacks);
    stacks.forEach(([, stackDetails]) => {
      const opts = {
        cwd: path.resolve(stack, (stackDetails as any).workingDirectory),
        env: process.env,
        stdio: "pipe",
      } as any;
      execSync(`terraform init`, opts);
      execSync(`terraform plan -input=false -lock=false`, opts);
    });

    return new AssertionReturn(
      `Expected subject not to plan successfully`,
      true,
    );
  } catch (error) {
    console.error("Error during Terraform init or plan:", error);
    throw error;
    return new AssertionReturn(
      "Expected subject to plan successfully, false",
      false,
    );
  }
}

export class AssertionReturn {
  /**
   * Create an AssertionReturn
   * @param message - String message containing information about the result of the assertion
   * @param pass - Boolean pass denoting the success of the assertion
   */
  constructor(
    public readonly message: string,
    public readonly pass: boolean,
  ) {
    if (!pass) {
      throw new Error(message);
    }
  }
}

// Define a cleanup function that can be exported and used in tests.
export function cleanupCdkTfOutDirs() {
  try {
    execSync('find /tmp -name "cdktf.outdir.*" -type d -exec rm -rf {} +');
    // console.log(
    //   "Cleanup of cdktf.outdir.* directories in /tmp was successful.",
    // );
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}
