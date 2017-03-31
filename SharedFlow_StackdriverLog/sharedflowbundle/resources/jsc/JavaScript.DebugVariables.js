 
var faultName = context.getVariable("fault.name");
print("faultName: " + faultName); 
var logMessage = context.getVariable("flow.log.message");
print("logMessage: " + logMessage); 
var logSeverity = context.getVariable("flow.log.severity");
print("logSeverity: " + logSeverity); 
var logStatus = context.getVariable("flow.error.status");
print("logStatus: " + logStatus); 
var logReason = context.getVariable("flow.error.reason");
print("logReason: " + logReason); 
var logErrorMessage = context.getVariable("flow.error.message");
print("logErrorMessage: " + logErrorMessage); 

