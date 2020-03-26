'use strict';
const port = process.env.PORT || 3000;
var http = require('http');
var fs = require('fs');

const appInsights = require("applicationinsights");
appInsights.setup("1602f589-9c9a-4998-bc42-689c4877d1c9");
appInsights.start();
 
var server = http.createServer(function (req, res) {
  appInsights.defaultClient.trackNodeHttpRequest({request: req, response: res});
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port, '0.0.0.0');

appInsights.defaultClient.trackEvent({name: "started"});

console.log('server started');
var signals = {
  'SIGINT': 2,
  'SIGTERM': 15
};
 
function shutdown(signal, value) {
  server.close(function () {
    appInsights.defaultClient.trackEvent({name: "shutdown occured"});
    appInsights.defaultClient.flush();
    const stream = fs.createWriteStream('/home/customlogshut.txt');
    stream.write('server stopped by ' + signal);
    stream.end();
    console.log('server stopped by ' + signal);  
    process.exit(128 + value);
  });
}
 
Object.keys(signals).forEach((signal) => {
  process.on(signal, () => {
    appInsights.defaultClient.trackEvent({name: `signal received ${signal}`});
    appInsights.defaultClient.flush();
    const stream = fs.createWriteStream('/home/customlogsig.txt');
    stream.write(`process received a ${signal} signal`);
    stream.end();
    console.log(`process received a ${signal} signal`);
    shutdown(signal, signals[signal]);
  });
});