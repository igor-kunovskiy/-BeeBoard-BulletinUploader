'use strict';

angular.module('BulletinUploader.config', ['ngRoute'])
// register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('buHttpInterceptor', function ($q, $window) {
	return function (promise) {
		return promise.then(function (response) {
			// do something on success
			// todo hide the spinner
			//alert('stop spinner');
			$('#loading_div').hide();
			return response;
			
		}, function (response) {
			// do something on error
			// todo hide the spinner
			//alert('stop spinner');
			$('#loading_div').hide();
			return $q.reject(response);
		});
	};
})
.config(function ($routeProvider, $httpProvider) {
	$routeProvider
	.when('/', {
		controller: 'buMainController as mainController',
		templateUrl: '/view/main.html'
	})
	.when('/auth', {
		controller: 'buAuthController as authController',
		templateUrl: '/view/auth.html'
	})
	.otherwise({
		redirectTo: '/'
	});
	
	$httpProvider.defaults.withCredentials = false;

	$httpProvider.interceptors.push('buHttpInterceptor');
	
	var spinnerFunction = function (data, headersGetter) {
		// todo start the spinner here
		//alert('start spinner');
		$('#loading_div').show();
		return data;
	};
	$httpProvider.defaults.transformRequest.push(spinnerFunction);
});
