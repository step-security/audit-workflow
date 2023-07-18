<p align="center">
<picture>
  <source media="(prefers-color-scheme: light)" srcset="images/banner.png" width="400">
  <img alt="Dark Banner" src="images/banner-dark.png" width="400">
</picture>
</p>

<div align="center">

[![Maintained by stepsecurity.io](https://img.shields.io/badge/maintained%20by-stepsecurity.io-blueviolet)](https://stepsecurity.io/?utm_source=github&utm_medium=organic_oss&utm_campaign=harden-runner)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/step-security/harden-runner/badge)](https://api.securityscorecards.dev/projects/github.com/step-security/harden-runner)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://raw.githubusercontent.com/step-security/harden-runner/main/LICENSE)

</div>

## GitHub Actions Runtime Security

Harden-Runner GitHub Action provides Runtime Security for GitHub-hosted and self-hosted Actions Runner Controller (ARC) runners.

[![Harden Runner Demo](images/RuntimeSecurityDemo.gif)](https://youtu.be/fpdwX5hYACo)

## Explore open source projects using Harden-Runner

| [![Logo 1](https://avatars.githubusercontent.com/u/6154722?s=60&v=4)](link_to_url_1) | [![Logo 2](https://avatars.githubusercontent.com/u/2810941?s=60&v=4)](link_to_url_2) | [![Logo 3](https://avatars.githubusercontent.com/u/365230?s=60&v=4)](link_to_url_3) | [![Logo 4](https://avatars.githubusercontent.com/u/17888862?s=60&v=4)](link_to_url_4) | [![Logo 5](https://avatars.githubusercontent.com/u/36015203?s=60&v=4)](link_to_url_5) |
| --- | --- | --- | --- | --- |
| **Microsoft**<br>[Explore](link_to_explore_1) | **Google**<br>[Explore](link_to_explore_2) | **DataDog**<br>[Explore](link_to_explore_3) | **Intel**<br>[Explore](link_to_explore_4) | **Kubernetes**<br>[Explore](link_to_explore_5) |

## Why

Compromised workflows, dependencies, and build tools typically make outbound calls to exfiltrate credentials, or may tamper source code, dependencies, or artifacts during the build.

Harden-Runner GitHub Action monitors process, file, and network activity to:

|     | Countermeasure                                                                               | Threat                                                                                                                                                                                                                                |
| --- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.  | Blocks egress traffic at the DNS (Layer 7) and network layers (Layers 3 and 4) to prevent exfiltration of credentials | To prevent [Codecov breach](https://github.com/step-security/attack-simulator/blob/main/docs/RestrictOutboundTraffic.md) scenario                                                                                                         |
| 2.  | Detect if source code is being overwritten during the build process to inject a backdoor     | To detect [SolarWinds incident scenario](https://github.com/step-security/attack-simulator/blob/main/docs/MonitorSourceCode.md)                                                                                                           |
| 3.  | Detect compromised dependencies that make unexpected outbound network calls                  | To detect [Dependency confusion](https://github.com/step-security/attack-simulator/blob/main/docs/DNSExfiltration.md) and [Malicious dependencies](https://github.com/step-security/attack-simulator/blob/main/docs/CompromisedDependency.md) |

Read this [case study](https://infosecwriteups.com/detecting-malware-packages-in-github-actions-7b93a9985635) on how Harden-Runner detected malicious packages in the NPM registry.

## How

1. Add `step-security/harden-runner` to your GitHub Actions workflow file as the first step in each job.

   ```yaml
   steps:
     - uses: step-security/harden-runner@55d479fb1c5bcad5a4f9099a5d9f37c8857b2845 # v2.4.1
       with:
         egress-policy: audit
   ```

2. In the workflow logs, you will see a link to security insights and recommendations.

    <p align="left">
      <img src="images/buildlog1.png" alt="Link in build log" >
    </p>

3. Click on the link ([example link](https://app.stepsecurity.io/github/ossf/scorecard/actions/runs/2265028928)). You will see a process monitor view of file and network activities correlated with each step of the job. These insights hold significant value for forensic investigations, proving crucial in the event of an incident.

    <p align="left">
      <img src="images/insights2.png" alt="Insights from harden-runner" >
    </p>

4. Under the insights section, you'll find a suggested policy. You can either update your workflow file with this policy, or alternatively, use the [Policy Store](https://docs.stepsecurity.io/harden-runner/how-tos/block-egress-traffic#2-add-the-policy-using-the-policy-store) to apply the policy without modifying the workflow file.

    <p align="left">
      <img src="images/rec-policy1.png" alt="Policy recommended by harden-runner" >
    </p>

## Features at a glance

For details, check out the documentation at https://docs.stepsecurity.io

<p align="left">
  <img src="images/main-screenshot1.png" alt="Policy recommended by harden-runner">
</p>

### 🚦 Restrict egress traffic to allowed endpoints

Once allowed endpoints are set in the policy in the workflow file, or in the [Policy Store](https://docs.stepsecurity.io/harden-runner/how-tos/block-egress-traffic#2-add-the-policy-using-the-policy-store)

- Harden-Runner blocks egress traffic at the DNS (Layer 7) and network layers (Layers 3 and 4).
- It blocks DNS exfiltration, where attacker tries to send data out using DNS resolution
- Blocks outbound traffic using IP tables
- Wildcard domains are supported, e.g. you can add `*.data.mcr.microsoft.com:443` to the allowed list, and egress traffic will be allowed to `eastus.data.mcr.microsoft.com:443` and `westus.data.mcr.microsoft.com:443`.

<p align="left">
  <img src="images/block-outbound-call.png" alt="Policy recommended by harden-runner" >
</p>

### 🕵️ Detect tampering of source code during build

Harden-Runner monitors file writes and can detect if a file is overwritten.

- Source code overwrite is not expected in a release build
- All source code files are monitored, which means even changes to IaC files (Kubernetes manifest, Terraform) are detected
- You can enable notifications to get one-time alert when source code is overwritten

<p align="left">
  <img src="images/fileoverwrite.png" alt="Policy recommended by harden-runner" >
</p>

### 🚫 Run your job without sudo access

GitHub-hosted runner uses passwordless sudo for running jobs.

- This means compromised build tools or dependencies can install attack tools
- If your job does not need sudo access, you see a policy
  recommendation to disable sudo in the insights page
- When you set `disable-sudo` to `true`, the job steps run without sudo access to the Ubuntu VM

### 🔔 Get security alerts

Install the [StepSecurity Actions Security GitHub App](https://github.com/apps/stepsecurity-actions-security) to get security alerts.

- Email and Slack notifications are supported
- Notifications are sent when outbound traffic is blocked or source code is overwritten
- Notifications are not repeated for the same alert for a given workflow

## Support for ARC and Private Repositories

Actions Runner Controller (ARC) and Private repositories are supported if they have a commercial license. Check out the [documentation](https://docs.stepsecurity.io/harden-runner/installation/business-enterprise-license) for more details.

Install the [StepSecurity Actions Security GitHub App](https://github.com/apps/stepsecurity-actions-security) to use Harden-Runner GitHub Action for `Private` repositories.

- If you use Harden-Runner GitHub Action in a private repository, the generated insights URL is NOT public.
- You need to authenticate first to access insights URL for private repository. Only those who have access to the repository can view it.
- [StepSecurity Actions Security GitHub App](https://github.com/apps/stepsecurity-actions-security) only needs `actions: read` permissions on your repositories.

Read this [case study on how Kapiche uses Harden Runner](https://www.stepsecurity.io/case-studies/kapiche/) to improve software supply chain security in their open source and private repositories.

## Discussions

If you have questions or ideas, please use [discussions](https://github.com/step-security/harden-runner/discussions).

1. [Support for private repositories](https://github.com/step-security/harden-runner/discussions/74)
2. [Where should allowed-endpoints be stored?](https://github.com/step-security/harden-runner/discussions/84)
3. [Cryptographically verify tools run as part of the CI/ CD pipeline](https://github.com/step-security/harden-runner/discussions/94)

## Limitations for GitHub-hosted Runners

1. Only Ubuntu VM is supported. Windows and MacOS GitHub-hosted runners are not supported. There is a discussion about that [here](https://github.com/step-security/harden-runner/discussions/121).
2. Harden-Runner is not supported when [job is run in a container](https://docs.github.com/en/actions/using-jobs/running-jobs-in-a-container) as it needs sudo access on the Ubuntu VM to run. It can be used to monitor jobs that use containers to run steps. The limitation is if the entire job is run in a container. That is not common for GitHub Actions workflows, as most of them run directly on `ubuntu-latest`.

## Testimonials

> _I think this is a great idea and for the threat model of build-time, an immediate network egress request monitoring makes a lot of sense_ - [Liran Tal](https://stars.github.com/profiles/lirantal/), GitHub Star, and Author of Essential Node.js Security

> _Harden-Runner strikes an elegant balance between ease-of-use, maintainability, and mitigation that I intend to apply to all of my 300+ npm packages. I look forward to the tool’s improvement over time_ - [Jordan Harband](https://github.com/ljharb), Open Source Maintainer

> _Harden runner from Step security is such a nice solution, it is another piece of the puzzle in helping treat the CI environment like production and solving supply chain security. I look forward to seeing it evolve._ - Cam Parry, Staff Site Reliability Engineer, Kapiche

## How does it work?

Harden-Runner GitHub Action downloads and installs the StepSecurity Agent.

- The code to monitor file, process, and network activity is in the Agent.
- The agent is written in Go and is open source at https://github.com/step-security/agent
- The agent's build is reproducible. You can view the steps to reproduce the build [here](http://app.stepsecurity.io/github/step-security/agent/releases/latest)
