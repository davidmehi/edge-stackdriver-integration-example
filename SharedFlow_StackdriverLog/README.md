# SharedFlow_StackdriverLog
This is an example of how to log messages to Stackdriver using a Shared Flow.

## Description ##
This shared flow is meant to be a common way to send any kind of log message to Stackdriver.  This example builds on a [previous example](https://community.apigee.com/articles/38004/logging-from-apigee-edge-api-proxies-to-a-saas-log.html) done by Dino Chiesa - please review and implement before trying to run this shared flow.

## Deployment Instructons ##
To deploy, zip the folder "sharedflowbundle" and upload as a new shared flow.  Once uploaded, deploy to a environment.

**Note that for this shared flow to work, it must be deployed to a "paid org".  It will not work on a "trial org".  This shared flow relies on a Java Callout policy and multiple JAR files.  Java Callouts are not available on the trial version of Apigee.**

See this link for more information about shared flows work and how to deploy shared flows.  http://docs.apigee.com/api-services/content/shared-flows

See this link on how to incorporate proxies and shared flows in your CI/CD approach.  https://community.apigee.com/content/kbentry/35173/continuous-integration-for-api-proxies.html

## Usage ##
This shared flow can be called at any time in the proxy to log a message to Stackdriver.  Two variables need to be set.  If they are not set, then default values will be set before sending to Stackdriver.

flow.log.message - This is the message that you want to log to Stackdriver

flow.log.severity - This is the severity of the message.  Values are: DEFAULT, DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY

Other data about the proxy, uri, developer, app, etc will be automatically included in the log message.

The shared flow error handling mechanism (described here: https://github.com/davidmehi/edge-stackdriver-integration-example), will automatically call this shared flow to log messages to StackDriver.
