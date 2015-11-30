angular.module('logToServer', [])
// http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/
.config(["$provide", function( $provide )
{
    // Use the `decorator` solution to substitute or attach behaviors to
    // original service instance; @see angular-mocks for more examples....
 
    $provide.decorator( '$log', [ "$delegate", function($delegate)
    {
        // Save the original $log.debug()
        //var debugFn = $delegate.debug; 
        $delegate.debug = function() {
            JL().debug(arguments);
        };
        $delegate.log = function() {
            JL().log(arguments);
        };
        $delegate.info = function () {
            JL().info(arguments);
        };
        $delegate.warn = function () {
            JL().warn(arguments);
        };
        $delegate.error = function () {
            JL().error(arguments);
        };
 
        return $delegate;
    }]);
}])
.factory('$exceptionHandler', function () {
    return function (exception, cause) {
        JL().fatalException(cause, exception);
        throw exception;
    };
})
.factory('logToServerInterceptor', ['$q', function ($q) {

    var myInterceptor = {
        'request': function (config) {
            config.msBeforeAjaxCall = new Date().getTime();
            return config;
        },
        'response': function (response) {
            if (response.config.warningAfter) {
                var msAfterAjaxCall = new Date().getTime();
                var timeTakenInMs = msAfterAjaxCall - response.config.msBeforeAjaxCall;
                if (timeTakenInMs > response.config.warningAfter) {
                    JL().warn({ "timeTakenInMs": timeTakenInMs, config: response.config, data: response.data });
                }
            }

            return response;
        },
        'responseError': function (rejection) {
            var errorMessage = "timeout";
            if (rejection && rejection.status && rejection.data) {
                errorMessage = rejection.data.ExceptionMessage;
            }

            JL().fatalException({ errorMessage: errorMessage, status: rejection.status, config: rejection.config }, rejection.data);
            return $q.reject(rejection);
        }
    };

    return myInterceptor;
}]);

