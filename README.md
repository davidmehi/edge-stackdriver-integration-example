# edge-stackdriver-integration-example
This is an example of how to use GCP Stackdriver for logging and monitoring of Edge proxies


# Stackdriver Monitoring and Logging For Edge

The Stackdriver products available in GCP provide a complete monitoring and logging solution for your APIs.  This article will highlight some of the ways that Stackdriver could be used for your Edge monitoring and logging needs.  The Stackdriver documentation is very good, so this document does not attempt to repeat instructions that are specified elsewhere.  However, the goal is to show how to configure the monitoring and logging options for Edge API purposes.


## GCP and Stackdriver Setup
Assuming you have a GCP account already, Dino has put together great instructions on how to configure an application and Stackdriver in GCP.  He has also created some example proxies that will do the initial connection from the proxy to Stackdriver and send example log messages.  Follow these instructions first.  This guide is to enhance his examples and show how it could be configured for project use.
https://community.apigee.com/articles/38004/logging-from-apigee-edge-api-proxies-to-a-saas-log.html

## Monitoring
A common need is to be able to monitor API endpoints and confirm that they are up and running.  This usually consists of a monitoring service that sends a request to the endpoint at a set interval.  If the endpoint goes down, then an admin should be notified.  This capability is available in Stackdriver Monitoring.

## Create an endpoint “up-time check”
The following link describes how to create an “up-time check”.  This allows you to enter the protocol, hostname, path and other advanced options (data checks) that define what endpoint you are monitoring.  The call is assumed to be a GET call.  (It does not seem like other HTTP verbs are available.)  Then choose the interval you want to the check to occur.  Do this for each endpoint you want to monitor.  It is recommended to put the check in for each “proxy” or “product”.  It is also useful if you could tie the call in with the backend, to confirm that both the proxy and the backend are alive.

https://cloud.google.com/monitoring/alerts/uptime-checks

![Uptime Check Panel](images/stackdriver-uptime-check-panel.png)

View a list of uptime checks

![Uptime Check List](images/stackdriver-uptime-list.png)


## Create an alert policy based on the up-time check
The uptime check will determine if the endpoint can be reached or not.  However, it will not inform you directly if it goes down.  You can see if it’s available or not in the console, however, if you want to receive an alert, then you will need to create an alert policy.

First, you will need to configure the different ways you want to receive alerts.  Some popular options include email, sms and through the GCP mobile app.  A list of options are here: https://cloud.google.com/monitoring/support/notification-options.  To configure your email and phone, go to your account profile.  There you can add emails, phone numbers and apps to receive alerts to.  You can install the GCP app on your phone, log into your account and receive alerts through the app.

Second, you will need to create an alert based on the up-time check.  The best way to create an alert policy is from the up-time check listing page.  Under the “Actions” column, click the dotted icon of the up-time check that you want to create an alert for.  In the menu that pops up, choose “Create Alerting Policy”.  This will create a default alert policy with the endpoint already configured.  (Everytime I try to create an alert policy by itself, I do not have the option to choose an uptime-check, so it’s best to do it through the list page.)  Choose a notification method (from first step), the message in the alert, and the name of the alert policy and click “Save”.

A new alert policy will need to be created for each “up-time check”.  (I did not see a way to re-use alert policies.)

When the ‘up-time check’ receives an error or timeout, it will send an alert through the mechanism that is specified.

![Create Alert Policy](images/stackdriver-create-alert-policy.png)


Alert Policy Listing Page

![Alert Policy Listing Page](images/stackdriver-alert-policy-list.png)


More information: https://cloud.google.com/monitoring/alerts/

It does not seem like we can do the following with Alert Policies:
 * Doesn’t seem to be able to re-use alert policies.  Will need to create a new alert policy for each up-time check
 * Doesn’t seem to be able to set thresholds or other settings on URL monitoring
 * Doesn’t seem to be able to do latency alerts on URL monitoring

## Add the monitor to the dashboard
Stackdriver allows the user to create a “dashboard” that they can then use to track the metrics that they would like to see.  

Create a new dashboard
 * Click the “Add Chart” button at the top right of the screen
 * Under “Resource Type”, choose “Instance Uptime Check”
 * There doesn’t seem to be a way to choose specific up-time checks
 * Choose “Chart Type” and other options before saving.

![API Monitoring Dashboard](images/stackdriver-api-mon-chart.png)


## Agent Monitoring
Stackdriver Monitoring can also run as an agent on each node.  This would not apply to cloud but would be useful for private cloud installations.  A drawback is that each agent will need to be able to call out to the GCP to return the results - appropriate firewall and other network rules will need to be established.  Agent monitoring is not included as part of this document - but it would be a good POC to try.  The agent can plugin to many popular open source programs, such as Apache, Postgresql or even the JVM.  There is also an “auto-detect” feature that will detect what components/daemons are running on the machine and hook in to enable monitoring.
https://cloud.google.com/monitoring/agent/

## Additional Monitoring
Stackdriver Monitoring has many other capabilities for monitoring that are built into the Google Cloud Platform and are automatically available. These capabilities don’t really apply to Apigee Cloud APIs at this point.  


