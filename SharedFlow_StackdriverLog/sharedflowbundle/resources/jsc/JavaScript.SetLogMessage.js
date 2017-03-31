 
var logMessage = {};

// set message first
var message = context.getVariable("flow.log.message");
if(message === null || message === "") {
    message = context.getVariable("flow.error.message");
}
logMessage.message = message

// if no severity defined, but error variables defined, then use "ERROR".  Otherwise, use "INFO"
// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
// Severity Options: DEFAULT, DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY
var severity = context.getVariable("flow.log.severity");
if( (severity === null || severity === "") && (context.getVariable("flow.error.status") !== null) ) {
    severity = "ERROR";
} else if(severity === null || severity === "") {
    severity = "INFO";
}
if(severity !== null) {
    severity = severity.toUpperCase();
}
logMessage.severity = severity;

// Set rest of variables
logMessage.status = context.getVariable("flow.error.status");
logMessage.reason = context.getVariable("flow.error.reason");
logMessage.errorStatusCode = context.getVariable("flow.error.status");
logMessage.errorReason = context.getVariable("flow.error.reason");
logMessage.errorMessage = context.getVariable("flow.error.message");
logMessage.developer = context.getVariable("developer.email");
logMessage.app = context.getVariable("developer.app.name");
logMessage.product = context.getVariable("apiproduct.name");
logMessage.environment = context.getVariable("environment.name");
logMessage.org = context.getVariable("environment.orgname");
logMessage.apiproxy_name = context.getVariable("apiproxy.name");
logMessage.apiproxy_revision = context.getVariable("apiproxy.revision");
logMessage.proxy_basepath = context.getVariable("proxy.basepath");
logMessage.proxy_pathsuffix = context.getVariable("proxy.pathsuffix");
logMessage.request_queryParams = context.getVariable("request.queryParams");
logMessage.request_uri = context.getVariable("request.uri");
logMessage.request_verb = context.getVariable("request.verb");
logMessage.proxy_client_ip = context.getVariable("proxy.client.ip");
//logMessage.payload = context.getVariable("request.payload"); // data security concerns here

context.setVariable("stackdriver.logpayload", JSON.stringify(logMessage));

