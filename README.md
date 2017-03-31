# edge-stackdriver-integration-example
This is an example of how to use GCP Stackdriver for logging and monitoring of Edge proxies

* This example builds on a [previous example](https://community.apigee.com/articles/38004/logging-from-apigee-edge-api-proxies-to-a-saas-log.html) done by Dino Chiesa - please review and implement before trying to run these proxies. *


# Stackdriver Monitoring and Logging For Edge

The Stackdriver products available in GCP provide a complete monitoring and logging solution for your APIs.  This article will highlight some of the ways that Stackdriver could be used for your Edge monitoring and logging needs.  The Stackdriver documentation is very good, so this document does not attempt to repeat instructions that are specified elsewhere.  However, the goal is to show how to configure the monitoring and logging options for Edge API purposes.


## GCP and Stackdriver Setup
Assuming you have a GCP account already, Dino has put together great instructions on how to configure Stackdriver in GCP.  He has also created some example proxies that will do the initial connection from the proxy to Stackdriver and send example log messages.  **Follow these instructions first.**  This guide is to enhance his examples and show how it could be configured for project use.
https://community.apigee.com/articles/38004/logging-from-apigee-edge-api-proxies-to-a-saas-log.html

## Monitoring
A common need is to be able to monitor API endpoints and confirm that they are up and running.  This usually consists of a monitoring service that sends a request to the endpoint at a set interval.  If the endpoint goes down, then an admin should be notified.  This capability is available in Stackdriver Monitoring.

### Create an endpoint "up-time check"
The following link describes how to create an "up-time check".  This allows you to enter the protocol, hostname, path and other advanced options (data checks) that define what endpoint you are monitoring.  The call is assumed to be a GET call.  (It does not seem like other HTTP verbs are available.)  Then choose the interval you want to the check to occur.  Do this for each endpoint you want to monitor.  **It is recommended to put the check in for each "proxy" or "product".**  It is also useful if you could tie the call in with the backend, to confirm that both the proxy and the backend are alive.

https://cloud.google.com/monitoring/alerts/uptime-checks

![Uptime Check Panel](images/stackdriver-uptime-check-panel.png)

View a list of uptime checks

![Uptime Check List](images/stackdriver-uptime-list.png)


### Create an alert policy based on the up-time check
The uptime check will determine if the endpoint can be reached or not.  **However, it will not inform you directly if it goes down.**  You can see if it’s available or not in the console, however, if you want to receive an alert, then you will need to create an alert policy.

**First,** you will need to configure the different ways you want to receive alerts.  Some popular options include email, sms and through the GCP mobile app.  A list of options are here: https://cloud.google.com/monitoring/support/notification-options.  To configure your email and phone, go to your account profile.  There you can add emails, phone numbers and apps to receive alerts to.  You can install the GCP app on your phone, log into your account and receive alerts through the app.

**Second,** you will need to create an alert based on the up-time check.  The best way to create an alert policy is from the up-time check listing page.  Under the "Actions" column, click the dotted icon of the up-time check that you want to create an alert for.  In the menu that pops up, choose "Create Alerting Policy".  This will create a default alert policy with the endpoint already configured.  (Everytime I try to create an alert policy by itself, I do not have the option to choose an uptime-check, so it’s best to do it through the list page.)  Choose a notification method (from first step), the message in the alert, and the name of the alert policy and click "Save".

A new alert policy will need to be created for each "up-time check".  (I did not see a way to re-use alert policies.)

When the ‘up-time check’ receives an error or timeout, it will send an alert through the mechanism that is specified.

![Create Alert Policy](images/stackdriver-create-alert-policy.png)


Alert Policy Listing Page

![Alert Policy Listing Page](images/stackdriver-alert-policy-list.png)


More information: https://cloud.google.com/monitoring/alerts/

It does not seem like we can do the following with Alert Policies:
 * Doesn’t seem to be able to re-use alert policies.  Will need to create a new alert policy for each up-time check
 * Doesn’t seem to be able to set thresholds or other settings on URL monitoring
 * Doesn’t seem to be able to do latency alerts on URL monitoring

### Add the monitor to the dashboard
Stackdriver allows the user to create a "dashboard" that they can then use to track the metrics that they would like to see.  

Create a new dashboard
 * Click the "Add Chart" button at the top right of the screen
 * Under "Resource Type", choose "Instance Uptime Check"
 * There doesn’t seem to be a way to choose specific up-time checks
 * Choose "Chart Type" and other options before saving.

![API Monitoring Dashboard](images/stackdriver-api-mon-chart.png)


### Agent Monitoring
Stackdriver Monitoring can also run as an agent on each node.  This would not apply to cloud but would be useful for private cloud installations.  A drawback is that each agent will need to be able to call out to the GCP to return the results - appropriate firewall and other network rules will need to be established.  Agent monitoring is not included as part of this document - but it would be a good POC to try.  The agent can plugin to many popular open source programs, such as Apache, Postgresql or even the JVM.  There is also an "auto-detect" feature that will detect what components/daemons are running on the machine and hook in to enable monitoring.
https://cloud.google.com/monitoring/agent/

### Additional Monitoring
Stackdriver Monitoring has many other capabilities for monitoring that are built into the Google Cloud Platform and are automatically available. These capabilities don’t really apply to Apigee Cloud APIs at this point.  


## Logging
A common requirement is to be able to log messages from the API Proxy.  These messages could be strictly error messages or other types like information messages.  An administrator or other person should be able to sign in to the logging panel and see these messages.  Administrators should also be able to set alerts based on log messages.  This capability is available in Stackdriver Logging.  
https://cloud.google.com/logging/docs/basic-concepts

### Sending A Log Message To Stackdriver Logging
Dino’s Stackdriver article provides a great description and example of how to send a basic text message to the logging API.  (Please review if you haven’t already)  In short, Stackdriver does not offer a "MessageLogging" or "SysLog" port to send messages to - however, there is a REST based API that messages can be sent to asynchronously.  It is recommended to use Edge’s Javascript HTTP client to "fire and forget" the log messages.  

The documentation for the "write log" API is available here: https://cloud.google.com/logging/docs/reference/v2/rest/v2/entries/write

The documentation for the "LogEntry" object in the logging payload is available here: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry

The documentation gives you a better idea of what data can be sent to the logging API.  Two fields are important to highlight as they will likely contain custom information per log.

#### Defining jsonPayload
In projects, it is preferred to send a more detailed log message to the logging API.  Using the "jsonPayload" field in the logging API will allow you to pass in much more relevant information to the call.  This can be put into a shared flow, where each call will have the same set of data, such as basepath, parameters, developer, app, product, etc.  This payload can contain whatever you want.  In the console, this "jsonPayload" field can be used to search for specific attributes that were recorded in the log entry.  See the LogEntry object for more information.

#### Setting severity
It is important to set the "severity" of the log message.  The options available are: DEFAULT, DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY
https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity

#### API Call Example
This is an example of the logging API call.  See Dino’s article to learn how to get a Bearer token.

POST https://logging.googleapis.com/v2/entries:write
Headers:
  Content-Type: application/json
  Authorization: Bearer ya29.EloXBNV3Ex03rLcMzsVNHHf-olRV69QxvhMUf0gjxIvY7xlJdtSkU-pVn2B6OXFXXqODATdKASpyLJYNRk4Ow0Ruf5QjfGfZ89WFMkhA-VyanKMgCTKNWExc8sI

Payload:
```json
{
	"logName": "projects/{**project_name**}/logs/syslog",
	"resource": {
		"type": "api",
		"labels": {}
	},
	"labels": {
		"flavor": "test"
	},
	"entries": [{
		"severity": "ERROR",
		"jsonPayload": {
			"status": "500",
			"reason": "Internal Server Error",
			"message": "internal server error",
			"errorStatusCode": "500",
			"errorReason": "Internal Server Error",
			"errorMessage": "internal server error",
			"developer": "*****@*****.com",
			"app": "StackdriverLogTest App",
			"product": "StackdriverLogTest Product",
			"environment": "dev",
			"org": "**org_name**",
			"apiproxy_name": "Example-Shared-Proxy-SDLog",
			"apiproxy_revision": "1",
			"proxy_basepath": "/example-shared-proxy-sdlog",
			"proxy_pathsuffix": "/500errorkey",
			"request_queryParams": null,
			"request_uri": "/example-shared-proxy-sdlog/500errorkey?apikey=3eOQO5DrvvuTMRvOXbAl68K39aGf02D0",
			"request_verb": "GET",
			"proxy_client_ip": "104.132.140.72"
		}
	}],
	"partialSuccess": true
}
```

Response: (There is no response payload for a success.  An error will return an error payload.)
```json
{}
```

Payload Information:

logName - either generic as api or by proxy or team.  could even do resource
resource - api, proxyname, endpoint (what is the resource logging the message) (https://cloud.google.com/logging/docs/api/v2/resource-list)
labels - can be used for extra data (most covered already in jsonPayload)
entries: []
    severity - (see above)
    insertId - could be used to tie multiple calls together (say in one transaction)
    httpRequest - general info about the http request
    operation - if there are multiple logs per "operation", then link/sequence them with this data
    trace - used for stackdriver tracing, optional
    sourceLocation - what policy, js file, line of code, etc the log is coming from
    textPayload - message string
    jsonPayload - json object of data to be logged (preferred)
partialSuccess - if an error, still write?  or not?



#### Use in Proxies
In the example outlined in the link below, the logic to get the access token, cache, and make log calls to Stackdriver is encapsulated into a proxy "Shared Flow" (borrowed from Dino’s example).  By setting some logging flow variables and calling the shared flow, the shared flow will send a log message to the logging API.  The payload will contain the message and severity set in the logging flow variables, plus the standard JSON payload containing org, env, error message, developer, etc (see example in the section above).

This "Stackdriver Logging" shared flow can be used at any time to send any kind of log message to Stackdriver.  This shared flow is also incorporated into the "Common Error Handling" shared flow.  This way, any error that is detected through the FaultRules or DefaultFaultRule will automatically be logged to Stackdriver.  

See example of this here:

*Note: The Stackdriver proxy contains JAR files and a Java policy that are only executable in paid orgs.  The Java policy will not work in trial orgs.*

### Logging Agents
Logging agents can be configured that run on your VMs.  These agents will stream log files from popular open source tools (like Apache, Postresql, etc) to the Stackdriver logs.
https://cloud.google.com/logging/docs/agent/

### Logging SDKs
Stackdriver provides SDKs for logging that can be used by applications.  Languages such as Java, Python, Node.JS and others are supported.  It would be interesting POC to try a Java logging policy in Edge to see how it works.  One of the drawbacks is that we would need to incorporate the GCP Java libraries, which could be quite large.  
https://cloud.google.com/logging/docs/reference/libraries
Diego has created an example using the Node.js logging library.
Logging APIs
There is a complete REST API for logging.
https://cloud.google.com/logging/docs/api/

### Log Console Viewer
All logs sent to Stackdriver can be viewed through the console.  Logs can be filtered for viewing.  https://cloud.google.com/logging/docs/view/advanced_filters

![API Monitoring Dashboard](images/stackdriver-log-list.png)


### Exporting Log Data
There are several different ways to export log data, highlighted in the documentation.  You can also create "sinks" - where log messages are filtered and sent to another GCP product like "CloudStorage", "BigQuery" or "Pub/Sub".
https://cloud.google.com/logging/docs/export/configure_export_v2

### Creating Logging Metrics
Once the logs have been sent to Stackdriver, they are available for view by the administrator.  However, it is likely that so many logs messages will be recorded that it is too hard for someone to read through all of them.  Creating log metrics will help identify the very important messages that you should pay attention to.  Create a metric based on the filtering capability of the log viewer (use the filtering to narrow down what messages are important).
https://cloud.google.com/logging/docs/view/logs_based_metrics


### Creating Alerts Based On Log Metrics
Once you have create log metrics to identify what log messages are important, you can configure alert policies for those log metrics.  That allows you to be alerted when you do receive an important log message.  The alert policies work the same way as described in the monitoring section.
https://cloud.google.com/logging/docs/view/logs_based_metrics#creating_an_alerting_policy
There are also some predefined log metrics that you can leverage for alerts.
https://cloud.google.com/logging/docs/view/logs_based_metrics#system-metrics

### Add Log Metrics to Dashboard
Similar to how you added monitoring widgets to your dashboard, log metric widgets can be added as well.  Click the "Add Chart" button on your dashboard and choose the log metric and other options.  
https://cloud.google.com/monitoring/quickstart-lamp#gs-dashboards

### Setting Access Control
There are ways to set security and what users can see what log information.  
https://cloud.google.com/logging/docs/access-control

### Auditing and Compliance Logging
Auditing and compliance logging is available.
https://cloud.google.com/logging/docs/audit/


## Other Stackdriver Features
Stackdriver has other features like Error Reporting, Debugger and Trace.  From what I can tell, these features are best used with other GCP products and wouldn’t work for Edge Proxies.  There might be some integration possible using Node.js or Java, but this has not been explored yet.




