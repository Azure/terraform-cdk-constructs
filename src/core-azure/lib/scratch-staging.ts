/**
 * This module gives constructs a scratch directory for a staged asset's
 * real bytes. `BlobAsset` and `FunctionApp`'s code asset use it to hand a
 * file to the Azure CLI, outside cdktn's normal Terraform asset flow.
 *
 * `AssetStaging.stage(targetPath)` leaves allocation and cleanup of
 * `targetPath` to the caller. This mirrors cdktn's own
 * `registerStrandedScratch`/exit-sweep pattern (see `asset-staging.ts`).
 * These directories get the same best-effort cleanup on normal exit,
 * SIGINT, or SIGTERM, instead of leaking into the OS temp directory.
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const scratchDirs = new Set<string>();
let exitSweepInstalled = false;

function sweepScratchDirs(): void {
  for (const dir of scratchDirs) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // This cleanup is best effort; a failure here has no useful recovery.
    }
  }
  scratchDirs.clear();
}

function installExitSweep(): void {
  if (exitSweepInstalled) {
    return;
  }
  exitSweepInstalled = true;
  // `exit` handlers must be synchronous; `rmSync` is.
  process.once("exit", sweepScratchDirs);
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, () => {
      sweepScratchDirs();
      // Re-raise so the signal isn't swallowed, matching cdktn's own
      // stranded-scratch sweep.
      process.kill(process.pid, signal);
    });
  }
}

/**
 * A path a staged artifact can be written to, without creating anything on
 * disk yet. Namespaced by `assetHash` so repeated synths of unchanged
 * content reuse the same path rather than allocating a fresh directory
 * every time.
 */
export function scratchAssetPath(
  namespace: string,
  assetHash: string,
  fileName: string,
): string {
  return path.join(os.tmpdir(), namespace, assetHash, fileName);
}

/**
 * Creates the directory for a path returned by `scratchAssetPath` and
 * registers it for best-effort removal at process exit.
 *
 * Call this immediately before staging into that path, not unconditionally
 * at construction. That way, a scratch directory never exists unless
 * something actually writes to it.
 */
export function prepareScratchDir(filePath: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  installExitSweep();
  scratchDirs.add(dir);
}
