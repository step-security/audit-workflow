import nock from "nock";
import { API_ENDPOINT, fetchPolicy, mergeConfigs } from "./policy-utils";
import { Configuration, PolicyResponse } from "./interfaces";

test("success: fetching policy", async () => {
  let owner = "h0x0er";
  let policyName = "policy1";
  let response = {
    owner: "h0x0er",
    policyName: "policy1",
    allowed_endpoints: ["github.com:443"],
    egress_policy: "audit",
    disable_telemetry: false,
    disable_sudo: false,
    disable_file_monitoring: false,
  };
  const policyScope = nock(`${API_ENDPOINT}`)
    .get(`/github/${owner}/actions/policies/${policyName}`)
    .reply(200, response);

  let idToken = "xyz";
  let policy = await fetchPolicy(owner, policyName, idToken);
  console.log(policy);
  expect(policy).toStrictEqual(response);
});

test("merge configs", async () => {
  let localConfig: Configuration = {
    repo: "test/repo",
    run_id: "xyx",
    correlation_id: "aaaaa",
    working_directory: "/xyz",
    api_url: "xyz",
    allowed_endpoints: "",
    egress_policy: "audit",
    disable_telemetry: false,
    disable_sudo: false,
    disable_file_monitoring: false,
  };
  let policyResponse: PolicyResponse = {
    owner: "h0x0er",
    policyName: "policy1",
    allowed_endpoints: ["github.com:443", "google.com:443"],
    egress_policy: "audit",
    disable_telemetry: false,
    disable_sudo: false,
    disable_file_monitoring: false,
  };

  let expectedConfiguration: Configuration = {
    repo: "test/repo",
    run_id: "xyx",
    correlation_id: "aaaaa",
    working_directory: "/xyz",
    api_url: "xyz",
    allowed_endpoints: "github.com:443 google.com:443",
    egress_policy: "audit",
    disable_telemetry: false,
    disable_sudo: false,
    disable_file_monitoring: false,
  };

  localConfig = mergeConfigs(localConfig, policyResponse);
  expect(localConfig).toStrictEqual(expectedConfiguration);
});
