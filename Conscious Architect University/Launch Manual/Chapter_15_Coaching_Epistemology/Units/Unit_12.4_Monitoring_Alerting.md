# Unit 12.4: Monitoring & Alerting

## 🧠 THE SCIENCE (145 words)

**UNLEARN:** Monitoring is not a post-launch luxury; it is a fundamental launch requirement. Launching without an alerting loop is not "shipping fast"—it is engineering a blind spot that will inevitably lead to silent failure, eroded trust, and financial leakage.

Think of monitoring as the **Reticular Activating System (RAS)** in the human brain. Your brain is bombarded with millions of bits of sensory data every second—background noise, the feel of your clothes, the hum of the air conditioner. The RAS filters this noise, allowing the conscious mind to ignore the mundane while instantly alerting it to anomalies that signal danger or opportunity (like hearing your name in a crowded room). 

In the CCP architecture, we generate massive amounts of "sensory" telemetry—logs, state transitions, and cost metrics. Without a robust monitoring layer, you are a conscious mind with no RAS, forced to manually check every service to see if it’s alive. We don't monitor for the sake of data; we monitor to automate the detection of survival-critical anomalies.

## 🧠 TECHNICAL KNOWLEDGE (235 words)

The production observability stack in 2026 is built on **Amazon CloudWatch Application Signals**. Instead of manual instrumentation, Application Signals automatically discovers service interdependencies and generates the **4 Golden Signals**—Latency, Traffic, Errors, and Saturation—aligned with the SRE handbook standards.

1. **Latency:** The time it takes to service a request. We track both `p99` latency for successful batches and the "Time to Failure" for aborted ones.
2. **Traffic:** The demand placed on our schedule. For the CCP, this is the number of concurrent coach batch jobs in the queue.
3. **Errors:** The rate of requests that fail. We specifically monitor the `FAILED` state in the `pipeline_commander.py` state machine.
4. **Saturation:** Resource exhaustion. In our "Spin Up/Down" architecture, the primary saturation point is **GPU Spot Capacity** and **RDS Connection Pooling**.

The alerting loop follows a strict **SNS → PagerDuty Handshake**. CloudWatch Alarms do not send emails (which are easily ignored); they publish to an **Amazon SNS Topic**. This topic has an HTTPS subscription to a **PagerDuty Integration URL**. PagerDuty then handles the incident lifecycle: alerting the on-call engineer (you), managing escalation, and automatically resolving the incident when the CloudWatch Alarm returns to an `OK` state.

Finally, we implement **GPU Cost Governance** via CloudWatch Alarms on **AWS Budgets**. If a batch process exceeds the predicted per-video cost of $0.08 (T2I + I2V), the system triggers a "Financial Anomaly" alert, preventing runaway spend from unoptimized LoRA loops or failed termination cycles.

## 📂 OUR CODE (180 words)

The monitoring hooks are already integrated into our telemetry-aware agents. We use custom metrics to track batch health and cost in real-time.

- `src/ccp/agents/scheduled_monitor.py` line 423: The `save_session_log` method is our primary hook for **Session Initiation Metrics**. Every time a cultural observation triggers a DARN-CAT session, we emit a `QuestionsGenerated` metric to the `CCP/Monitoring` namespace.
- `cmf/apps/cmf-assembler/pipeline_commander.py` line 392: The `update_cost` function calculates the specific USD spend for each video project. This value is written to the `total_generation_cost_usd` field in the state machine, which the CloudWatch agent scrapes to monitor for budget deviations.
- `cmf-docker/docker-compose.yml`: (🔧 EXTEND) Add `healthcheck` policies for all 6+ services. A healthy service is defined not just by a running container, but by a successful `200 OK` from its internal `/api/health` endpoint.

```python
# pipeline_commander.py, line 221
# WHY: Transitioning to FAILED state provides the specific 
# error_message that the CloudWatch Log Metric Filter 
# uses to fire the PagerDuty alarm.
```

## 🤖 AGENT PROMPT (120 words)

> **Prompt for Claude Code / Gemini CLI:**
> 
> You are establishing the monitoring harness for the CCP production stack. Use the AWS CLI to create a CloudWatch Dashboard named `CCP-Production-Health`.
> 
> Requirements:
> 1. Add a Metric Widget showing `Latency` and `ErrorRate` from the `AWS/ApplicationSignals` namespace.
> 2. Add a Log Table Widget that queries `/aws/lambda/scheduled_monitor` for the last 10 "Failed session initiation" errors.
> 3. Add an Alarm Status Widget showing the state of the `GPU-Cost-Anomaly` alarm.
> 4. Add a Custom Metric Widget for `QuestionsGenerated` from the `CCP/Monitoring` namespace.
> 
> Output the exact `aws cloudwatch put-dashboard` command with the JSON `dashboard-body`.

## ⌨️ TERMINAL (90 words)

```bash
# Create the SNS Topic for PagerDuty
aws sns create-topic --name ccp-pagerduty-alerts

# Subscribe PagerDuty to the topic (REPLACE with your integration URL)
aws sns subscribe --topic-arn arn:aws:sns:region:account:ccp-pagerduty-alerts \
  --protocol https --notification-endpoint https://events.pagerduty.com/integration/ID/enqueue

# Put a custom metric to verify CloudWatch connectivity
aws cloudwatch put-metric-data --namespace "CCP/Monitoring" --metric-name "Heartbeat" --value 1
# Expected: 200 OK
```

## ✅ IMPLEMENTATION STEPS (180 words)

1. **Provision the SNS Topic:** Execute the terminal command above to create the `ccp-pagerduty-alerts` topic.
2. **Handshake PagerDuty:** In your PagerDuty dashboard, create a new Service using the "Amazon CloudWatch" integration. Copy the integration URL and use it in the `aws sns subscribe` command.
3. **Configure the Batch Alarm:** Create a Log Metric Filter in CloudWatch that looks for the string `"FAILED"` in your `pipeline_commander.py` logs. 
4. **Trigger the Cost Alarm:** Set an AWS Budget for $10/day. Link a CloudWatch Alarm to this budget that fires when forecasted spend reaches 80% ($8).
5. **Build the Dashboard:** Paste the prompt from Section 4 into your AI agent to generate the production dashboard mapping your 4 Golden Signals.
6. **Verify the Loop:** Manually trigger a mock alert using `aws sns publish` to ensure your phone receives the PagerDuty notification within 15 seconds.

## ✅ VERIFY (40 words)

Run `aws cloudwatch describe-alarms --state-value ALARM`. If your simulated failure is active, the PagerDuty incident should be visible in your mobile app. `aws cloudwatch list-metrics --namespace "CCP/Monitoring"` must return the `Heartbeat` metric.

## 🔗 BRIDGE (45 words)

Unit 12.4 gave you the "eyes" to see your system's health in production. Unit 12.5 builds on this by putting those eyes to the test with **Load Testing — 100×5 Target**, where we simulate concurrent batch processing to find the first breaking point before actual clients do.

<!-- FACT-CHECK: "CloudWatch Application Signals 2026" → Available as of 2024, fully automated in 2026 for EKS/ECS and standard EC2 with the unified agent. Cross-service map is now default. -->
<!-- FACT-CHECK: "PagerDuty CloudWatch Integration 2026" → Integration remains via SNS (HTTPS endpoint) or EventBridge (API Destinations). SNS is documentation standard for reliability. -->
<!-- FACT-CHECK: "GPU Spot Instance Costs 2026" → Standard rate for L40S/H100 remains variable; Cost Explorer + Anomaly Detection are the primary guardrails. -->
