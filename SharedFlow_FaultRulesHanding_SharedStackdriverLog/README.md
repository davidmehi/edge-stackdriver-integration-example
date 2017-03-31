# SharedFlow_FaultRulesHanding_SharedStackdriverLog
This is an example of how to use a common error handling flow and automatically log messages to Stackdriver using another shared flow that handles the actual connection to Stackdriver

## Description ##
This shared flow is meant to be a common way to handle any faults that may occur in the proxy.  It is designed to be called in the &lt;FaultRules&rt; and &lt;DefaultFaulRule&rt; of the proxy.  It is pretty much the same as this example, but with an extra call to the shared flow to log messages to Stackdriver.  https://github.com/davidmehi/edge-shared-errorhandling-flow-example

## Deployment Instructons ##
To deploy, zip the folder "sharedflowbundle" and upload as a new shared flow.  Once uploaded, deploy to a environment.

* You must also deploy the SharedFlow_StackDriverLog shared flow:  .  This shared flow relies on the SharedFlow_StackDriverLog shared flow to log to Stackdriver.

See this link for more information about shared flows work and how to deploy shared flows.  http://docs.apigee.com/api-services/content/shared-flows

See this link on how to incorporate proxies and shared flows in your CI/CD approach.  https://community.apigee.com/content/kbentry/35173/continuous-integration-for-api-proxies.html

## Usage ##
This shared flow will be used in the same way as this example: https://github.com/davidmehi/edge-shared-errorhandling-flow-example

This uses the "SharedFlow_StackDriverLog" to send messages to Stackdriver.  Be sure to deploy that shared flow as well.
