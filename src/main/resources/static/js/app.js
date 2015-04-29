var app = angular.module('mfw-app', [
	'ui.router'                                    
]).config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider
	.state('practice', {
	      url: "/practice",
	      templateUrl: "partials/practice.html"
	});

}).controller('MainCtrl', function($scope, $http, $resource, $location, $state, CONFIG) {

	$scope.exercises = [];
	$scope.currentExercise = null;
	
	$scope.nextExercise = function() {
		$scope.currentExercise = $scope.exercises[Math.floor(Math.random()*$scope.exercises.length)];
	}

	var exercise = function() {
		return $scope.currentExercise().exercise;
	}
	var exerciseHandlers = {
			text: {
				template: function() {
					'partials/exercise/' + exercise().type + '.html'
				}
				
			}
	};
	
	
	$scope.dataPromise = $http.get('data/exam.json').success(function(data) {
		$scope.exam = data;
		
		$scope.exercises = [].concat.apply([], data.map(function(topic) {
			return topic.exercises.map(function(exercise) {
				return {
					topic: topic,
					exercise: exercise,
					handler: exerciseHandlers[exercise.type] 
				}
			});
		}));
		
		$scope.nextExercise();
		
		$state.go('practice');
	});

});