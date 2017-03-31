// log-To-Stackdriver-2.js
// ------------------------------------------------------------------
//
// Send a POST to stackdriver without waiting for a response.
//
// created: Wed Feb 15 16:28:55 2017
// last saved: <2017-February-28 10:12:50>

// Define properties here instead of in the policy

// fire and forget
context.setVariable("debug.properties.payload", properties.payload);
context.setVariable("debug.properties.authz_header", properties.authz_header);
context.setVariable("debug.properties.endpoint", properties.endpoint);
context.setVariable("debug.properties.authz_header", properties.authz_header);

var payload = (new MessageTemplate(properties.payload)).fill();
var headers = {
      'Content-Type' : 'application/json',
      'Authorization' : (new MessageTemplate(properties.authz_header)).fill()
    };
var url = (new MessageTemplate(properties.endpoint)).fill();
var req = new Request(url, 'POST', headers, payload);

context.setVariable("debug.req.url", url);
context.setVariable("debug.req.headers", headers);
context.setVariable("debug.req.payload", payload);

var exchange = httpClient.send(req);
