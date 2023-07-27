import * as cp from "child_process";
import { sleep } from "./setup";
import * as core from "@actions/core";

export function isArcRunner(): boolean {
  const runnerUserAgent = process.env["GITHUB_ACTIONS_RUNNER_EXTRA_USER_AGENT"];

  if (!runnerUserAgent) {
    return false;
  }

  return runnerUserAgent.includes("actions-runner-controller/");
}

function getRunnerTempDir(): string {
  const isTest = process.env["isTest"];

  if (isTest === "1") {
    return "/tmp";
  }

  return process.env["RUNNER_TEMP"] || "/tmp";
}

export function sendAllowedEndpoints(endpoints: string): void {
  let areValidEndpoints = validateEndpoints(endpoints);
  if (!areValidEndpoints) {
    core.warning(
      "[!] Unable to apply block-mode. Please make sure allowed-endpoints are in '<domain>:<port>' format"
    );
    return;
  }

  const allowedEndpoints = endpoints.split(" "); // endpoints are space separated

  for (const endpoint of allowedEndpoints) {
    if (endpoint) {
      const encodedEndpoint = Buffer.from(endpoint).toString("base64");
      cp.execSync(
        `echo "${endpoint}" > "${getRunnerTempDir()}/step_policy_endpoint_${encodedEndpoint}"`
      );
    }
  }

  if (allowedEndpoints.length > 0) {
    applyPolicy(allowedEndpoints.length);
  }
}

function applyPolicy(count: number): void {
  const fileName = `step_policy_apply_${count}`;
  cp.execSync(`echo "${fileName}" > "${getRunnerTempDir()}/${fileName}"`);
}

export function removeStepPolicyFiles() {
  cp.execSync(`rm ${getRunnerTempDir()}/step_policy_*`);
}

export function arcCleanUp() {
  cp.execSync(`echo "cleanup" > "${getRunnerTempDir()}/step_policy_cleanup"`);
}

export function validateEndpoints(endpoints: string): boolean {
  const allowed_endpoints = endpoints.split(" "); // endpoints are space separated
  for (let endp of allowed_endpoints) {
    let endpParts = endp.split(":"); // endp=google.com:443
    if (endpParts.length !== 2) {
      return false;
    }
  }

  return true;
}
