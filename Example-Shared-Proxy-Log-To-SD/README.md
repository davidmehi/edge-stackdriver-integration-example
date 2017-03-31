# Example-Shared-Proxy-Log-To-SD
This is an example of how to use a common error handling flow and the common logging flow to log to Stackdriver

## Description ##
This is an example proxy on how to leverage the error handling shared flow and the logging shared flow.  This approach allows you to concentrate on the proxy logic and not have to worry about the error handling or logging details.  

## Deployment Instructons ##
To deploy, zip the folder "apiproxy" and upload as a new proxy.  Once uploaded, deploy to a environment.

This uses the "SharedFlow_StackDriverLog" to send messages to Stackdriver.  Be sure to deploy that shared flow.

This uses the "SharedFlow_FaultRulesHandling_SharedStackDriverLog" to handle fault rules.  Be sure to deploy that shared flow.

See this link on how to incorporate proxies and shared flows in your CI/CD approach.  https://community.apigee.com/content/kbentry/35173/continuous-integration-for-api-proxies.html

## Usage ##
Before calling the "SharedFlow_StackDriverLog", two variables need to be set.  If they are not set, then default values will be set before sending to Stackdriver.

flow.log.message - This is the message that you want to log to Stackdriver

flow.log.severity - This is the severity of the message.  Values are: DEFAULT, DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY

Other data about the proxy, uri, developer, app, etc will be automatically included in the log message.


