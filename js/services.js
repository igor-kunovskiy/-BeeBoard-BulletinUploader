'use strict';

angular.module('BulletinUploader.services', ['ngStorage'])
.service('buService', ['$http', '$location', '$sessionStorage', 'buURL', function ($http, $location, $sessionStorage, buURL) {
	var service = this;
	service.isAuth = false;
	service.authResult = null;
	
	service.channels = [];
	service.channel = null;
	service.file = null;
	service.bulletinForPublish = null;
	service.imageDescription = "";
	
	//region Auth methods
	service.auth = function (email, password, contrl) {
		$http({
			method: 'GET',
			url: buURL + 'Account/Login',
			params: {
				"Email": email,
				"Password": password
			},
			withCredentials: false
		}).then(function successCallback(response) {
			service.isAuth = true;
			service.authResult = response.data.Result;
			//Save data to SessionStorage Object of Window
			$sessionStorage.auth = {
				"isAuth": true,
				"authResult": service.authResult
			};
			
			//Setup Auth Session token from response for future authorized requests
			$http.defaults.headers.common['Authorization'] = (service.authResult !== null ? service.authResult.SessionKey : "");
			//return to Main page
			return $location.path('/');
		}, function errorCallback(response) {
			service.isAuth = false;
			service.authResult = null;
			//echo server error message to page
			return contrl.setError((response.data !== undefined ? response.data.ErrorMessage : ""));
		});
	};
	
	service.login = function () {
		return $location.path('/');
	};
	
	service.logout = function () {
		$sessionStorage.$reset();
		service.isAuth = false;
		service.authResult = null;
		
		return $location.path('/auth');
	};
	//endregion
	
	//region API Methods
	//TODO: Add `loader` div while request running
	service.getBulletins = function () {//Once the user logs in, populate a drop-down with the list of possible channels
		$http({
			method: 'GET',
			url: buURL + 'Account/ListContainers',
			params: {
				"OwnerUUID": service.authResult.UUID,
				"NodeType": "1"
			}
		}).then(function successCallback(response) {
			service.channels = response.data.Result;
			return service.channels;
		}, function errorCallback(response) {
			if (response.status == 401) {
				return service.logout();
			} else {
				return;
			}
		});
	};
	
	service.uploadBulletin = function () {
		if (service.file) {
			$http({
				method: 'POST',
				url: buURL + 'Storage/Upload',
				data: service.file,
				headers: {
					'Content-Type': service.file.type
				}
			}).then(function successCallback(response) {
				service.bulletinForPublish = response.data.Result;
				return service.bulletinForPublish;
				
			}, function errorCallback(response) {
				if (response.status == 401) {
					return service.logout();
				} else {
					return;
				}
			});
		}
	};
	
	service.publishBulletin = function ($scope) {
		if (service.bulletinForPublish !== null) {
			$http({
				method: 'POST',
				url: buURL + 'MediaNode/PublishNew',
				params: {
					"UUID": "",//service.bulletinForPublish.UUID,
					"URL": service.bulletinForPublish.URL,
					"DisplayName": service.imageDescription,
					"ParentUUID": service.channel,
					"NodeType": 0
				}
			}).then(function successCallback(response) {
				return service.retrieveBulletin();
			}, function errorCallback(response) {
				if (response.status == 401) {
					return service.logout();
				} else {
					return;
				}
			});
		}
	};
	
	service.retrieveBulletin = function () {
		if (service.bulletinForPublish) {
			
			return $http({
				method: 'GET',
				url: buURL + service.bulletinForPublish.URL
			}).then(function successCallback(response) {
				return window.open(buURL + service.bulletinForPublish.URL);
			}, function errorCallback(response) {
				if (response.status == 401) {
					return service.logout();
				} else {
					return;
				}
			});
		} else {
			return;
		}
	};
	//endregion
	
	//region Helpful Methods
	service.guid = function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	};
	//endregion
	
	return service;
	
}]);