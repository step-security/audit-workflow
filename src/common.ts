import * as core from "@actions/core";
import { exit } from "process";
export function printInfo(web_url) {
  console.log(
    "\x1b[32m%s\x1b[0m",
    "View security insights and recommended policy at:"
  );

  console.log(
    `${web_url}/github/${process.env["GITHUB_REPOSITORY"]}/actions/runs/${process.env["GITHUB_RUN_ID"]}`
  );
}
export async function addSummary() {
  if (process.env.STATE_monitorStatusCode === "200") {
    const web_url = "https://app.stepsecurity.io";
    const insights_url = `${web_url}/github/${process.env["GITHUB_REPOSITORY"]}/actions/runs/${process.env["GITHUB_RUN_ID"]}`;

    await core.summary
      .addSeparator()
      .addImage(
        "https://github.com/step-security/harden-runner/raw/main/images/banner.png",
        "StepSecurity Harden-Runner",
        { width: "200" }
      )
      .addLink("View security insights and recommended policy", insights_url)
      .addSeparator()
      .write();
  }
}

export const STATUS_HARDEN_RUNNER_UNAVAILABLE = "409";

export const CONTAINER_MESSAGE =
  "This job is running in a container. Harden Runner does not run in a container as it needs sudo access to run. This job will not be monitored.";

export const UBUNTU_MESSAGE =
  "This job is not running in a GitHub Actions Hosted Runner Ubuntu VM. Harden Runner is only supported on Ubuntu VM. This job will not be monitored.";

export const HARDEN_RUNNER_UNAVAILABLE_MESSAGE =
  "Sorry, we are currently experiencing issues with the Harden Runner installation process. It is currently unavailable.";
