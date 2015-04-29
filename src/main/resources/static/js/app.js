var app = angular.module('mfw-app', [
]).controller('RedminexCtrl', function($scope, $http, $resource, $location, CONFIG) {
	
	$scope.apiKey = $location.search().apiKey;
	
	$scope.apiParams = {};
	var Api = $resource('/service/api/:call', $scope.apiParams);
	
	$scope.projects = [];
	
	$scope.issuesRequest = $resource('/service/issues', $scope.apiParams);
	
	$scope.onApiKey = function() {
		$scope.apiParams.key = $scope.apiKey;
		
		$scope.availableProjects = Api.get({call:'projects.json'});
	};

    if ($scope.apiKey) {
    	$scope.onApiKey();
    }
    
    $scope.queryIssues = function() {
    	$http.get('/service/issues', $scope.apiParams).success(function(data) {
    		$scope.issuesResult = data;
    	});
    };
});