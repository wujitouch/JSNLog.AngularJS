# Logging and JavaScript error handling for AngularJS

## About this fork
The original code replaces the $log service be declaring a new one. Since the new $log service doesn't implement all the methods that the original one does (like the function debugEnabled(true|false)), it can break code that already uses the service. This fork doesn't replace the service but decorates it using the $provide service (more info here: http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/)

## About logToServer.js

logToServer.js is an AngularJs module that makes it easy to log exceptions, AJAX timeouts and other events from your client side code to your server side log. 

It is essentially an AngularJs layer on top of [JSNLog](http://jsnlog.com), a JavaScript logging library that lets you log events in JavaScript code and automatically store them in your server side log. Supports Elmah, NLog, Log4Net, Serilog and any other package with a Common.Logging adapter.

The logToServer module:

* **Logs uncaught JavaScript exceptions to the server side log -** Replaces the AngularJS [$exceptionHandler](https://docs.angularjs.org/api/ng/service/$exceptionHandler) with a version that logs JavaScript exceptions to your server side log (NLog, Log4Net, etc.)
* **Logs AJAX issues -** Provides [Interceptors](https://docs.angularjs.org/api/ng/service/$http#interceptors) to log AJAX errors and timeouts to the server, and to log warning messages when AJAX responses are slow.
* **Logs debug messages etc. to the server from JavaScript code -** Replaces the standard AngularJS [$log](https://docs.angularjs.org/api/ng/service/$log) with a version that logs to the server, and optionally to the console using a [consoleAppender](http://jsnlog.com/Documentation/WebConfig/JSNLog/ConsoleAppender).

## Working demo code

In the Demo directory you'll find the working source code of a very simple demo site that puts all this in action.

* Download the zip file of this project. Unzip in some directory.
* The solution file is in Demo/JSNLog.AngularJS.Demo. Open that in Visual Studio. If you don't have Visual Studio, get [Visual Studio Express](https://www.visualstudio.com/en-us/products/visual-studio-express-vs.aspx) for free.
* Rebuild the solution. This will import the Nuget packages.
* Hit F5 to run the demo site. You'll see some buttons to generate events. Hit a few.
* This demo uses Elmah as the server side logging package. Open http://localhost:*portnumber*/elmah.axd to see the log messages written to the log. Besides Elmah, JSNLog supports NLog, Log4Net, Serilog and any other logging package for which there is a Common.Logging adapter.

## Install logToServer.js

Note that JSNLog does not include logToServer.js. The two packages have to be installed separately. 

1. [Install the JSNLog JavaScript Logging Package](http://jsnlog.com/Documentation/DownloadInstall). 

2. Install logToServer.js:

	* Using bower: 
	```
	bower install logToServer.js
	```

	* Or copy directly from this repo to for example your Scripts directory ([get the file here](https://raw.githubusercontent.com/mperdeck/JSNLog.AngularJS/master/logToServer.js)).

3. Make sure that logToServer.js gets loaded into your web pages, for example with a script tag.

## Log uncaught exceptions and other events to the server 

Simply import module _logToServer_ into your main module, like so:
```
var app = angular.module('mainmodule', ['logToServer']);
```

This logs uncaught exceptions to the server. If you do any [debug logging](http://jsnlog.com/Documentation/GetStartedLogging), those messages will go to the server as well.

You can configure your client side loggers (setting severity levels, etc.) using a [server side configuration file](http://jsnlog.com/Documentation/WebConfig), or [directly from your JavaScript code](http://jsnlog.com/Documentation/JSNLogJs/Logger/SetOptions). 

## Log AJAX issues

First add the [interceptors](https://docs.angularjs.org/api/ng/service/$http#interceptors) to the interceptors array for your application:
```
app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('logToServerInterceptor');
}]);
```

Now when you call [$http](https://docs.angularjs.org/api/ng/service/$http) to send an AJAX message, set the timeout and the delay after which a warning log message is sent in milliseconds in the config object, using _timeout_ and _warningAfter_:
```
$http({ method: '...', url: '...', data: ..., timeout: 5000, warningAfter: 2000 })
.success(function (data, status, headers, config) {
	...
})
.error(function (data, status, headers, config) {
	...
});
```

Or when using the [new type of promises](https://docs.angularjs.org/api/ng/service/$q):
```
$http({ method: '...', url: '...', data: ..., timeout: 5000, warningAfter: 2000 })
.then(function(response) {
	...
})
.catch(function (rejection) {
	...
})
.finally(function () {
	...
});
```

## Documentation

[More about using JSNLog to handle errors in AngularJS apps](http://jsnlog.com/Documentation/GetStartedLogging/AngularJsErrorHandling)

