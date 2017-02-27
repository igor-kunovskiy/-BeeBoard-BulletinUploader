'use strict';

angular.module('BulletinUploader.controllers', ['BulletinUploader.services', 'ngStorage'])
.controller('buPageController', ['$scope', '$http', '$sessionStorage', 'buService', function ($scope, $http, $sessionStorage, buService) {
	try {
		var authObj = $sessionStorage.auth || {};
		buService.isAuth = authObj.isAuth || false;
		buService.authResult = authObj.authResult || null;
		$http.defaults.headers.common['Authorization'] = (buService.authResult !== null ? buService.authResult.SessionKey : "");
	}
	catch (err) {
		console.error("buAuthController.$sessionStorage.JSON.parse", err);
	} finally {
		if (buService.isAuth && buService.authResult) {
			buService.login();
		}
	}
	
}])
.controller('buAuthController', ['$scope', 'buService', function ($scope, buService) {
	
	$scope.auth = function () {
		return buService.auth($scope.email, $scope.password, $scope);
	};
	
	$scope.setError = function (errorText) {
		$scope.errorText = errorText;
		return;
	};
}])
.controller('buMainController', ['$scope', 'buService', function ($scope, buService) {
	
	if (!buService.isAuth) { return buService.logout(); } //User doesn't authorized!
	
	$scope.buService = buService;
	
	$scope.showPreview = function (imageInp) { //Here we show image using blob object URLs, in other case: we can upload image to the server and then show image through GET method
		if (imageInp && imageInp.files) { // Checking the property `files` on nullable and zero-length
			var imagePreview = document.getElementById('imagePreview');
			
			imagePreview.src = window.URL.createObjectURL(imageInp.files[0]);
			imagePreview.parentElement.parentElement.removeAttribute("class");
			$scope.buService.file = imageInp.files[0];
		}
		
		return $scope.buService.file;
	};
	
	$scope.upload = function (event) {
		if ($scope.buService.file) {
			return $scope.buService.uploadBulletin();
		}
		return false;
	};
	
	$scope.publishBulletin = function (event) {
		return $scope.buService.publishBulletin();
	};
	
	$scope.buService.getBulletins();
	
}]);