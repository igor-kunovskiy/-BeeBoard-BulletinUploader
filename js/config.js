'use strict';

angular.module('BulletinUploader.config', ['ngRoute'])
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
});