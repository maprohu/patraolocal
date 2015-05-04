var app = angular.module('mfw-app', [
                                     
	'ui.router'                      
	
]).directive('plComplete', function($compile) {
	return {
		restrict: 'E',
		link: function(scope, element, attrs) {
			scope.$watch(function(scope) {
				return scope.$eval(attrs.data);
			}, function(value) {
				value = value.replace(/{{/g, '<pl-complete-field handler="handler" model="model" solution="\'').replace(/}}/g, '\'"></pl-complete-field>')
				element.html('<div>'+value+'</div>');
				$compile(element.contents())(scope);
			})
		}
	};
	
}).directive('plChoiceItem', function($compile) {
	return {
		restrict: 'E',
		link: function(scope, element, attrs) {
			scope.$watch(function(scope) {
				return scope.$eval(attrs.data);
			}, function(value) {
				value = value.replace(/{{/g, '<pl-choice-ref handler="handler" model="model" index="\'').replace(/}}/g, '\'"></pl-choice-ref>')
				element.html(value);
				$compile(element.contents())(scope);
			})
		}
	};
	
}).filter('alphabet', function() {

	return function(input) {
		return String.fromCharCode(97+Number(input));
	}
		
}).directive('plChoiceRef', function() {
	
	return {
		restrict: 'E',
		scope: {
		      index: '=',
		      handler: '=',
		      model: '='
		},
		templateUrl: 'partials/exercise/choice/ref.html'
	};

}).directive('plCompleteField', function() {
	
	return {
		restrict: 'E',
		scope: {
		      solution: '=',
		      handler: '=',
		      model: '='
		},
		templateUrl: 'partials/exercise/complete/field.html',
		link: function(scope, element, attr) {
			scope.$on("plInitialize", function() {
				scope.value = null;
			});
		}
	};

}).config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider
	.state('practice', {
	      url: "/practice",
	      templateUrl: "partials/practice.html"
	});

}).controller('MainCtrl', function($scope, $http, $resource, $location, $state, CONFIG) {

	function extend(base, sub) {
		var origProto = sub.prototype;
		sub.prototype = Object.create(base.prototype);
		for ( var key in origProto) {
			sub.prototype[key] = origProto[key];
		}
		sub.prototype.constructor = sub;
		Object.defineProperty(sub.prototype, 'constructor', {
			enumerable : false,
			value : sub
		});
	}
	
	function random(i) {
		return Math.floor(Math.random() * i);
	}
	
	function shuffle(o){
	    for(var j, x, i = o.length; i; j = random(i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	}	
	
	$scope.model = {};
	
	function Handler(topic, exercise) {
		this.topic = topic;
		this.exercise = exercise;
	}
	
	Handler.prototype = {
		getTemplateName: function() {
			return this.exercise.type;
		},
		getTemplate: function() {
			return 'partials/exercise/' + this.getTemplateName() + '.html'
		},
		initialize: function() {
			
		},
		check: function() {
			$scope.model.showSolution = true;
		},
		stripDown: function(value) {
			return (value||'').trim().toLowerCase().replace(/\s+/g, ' ');
		},
		isCorrect: function(value, solution) {
			return this.stripDown(value) === this.stripDown(solution);
		}
		
	};
	
	function ChoiceHandler(topic, exercise) {
		Handler.call(this, topic, exercise);
	}
	ChoiceHandler.prototype = {
		initialize: function() {
			var indexes = [0];
			for (var i = 0 ; i < this.exercise.alternatives.length ; i++) {
				indexes.push(i+1);
			}
			shuffle(indexes);
			
			$scope.model.elements = [this.exercise.solution].concat(this.exercise.alternatives);
			$scope.model.indexes = indexes;
			$scope.model.correct = this.reverse(0);
		},
		forward: function(index) {
			return $scope.model.indexes[index];
		},
		reverse: function(index) {
			return $scope.model.indexes.indexOf(Number(index)); 
		},
		parse: function(text) {
			
			
		},
		select: function(selection) {
			$scope.model.selection = selection;
			this.check();
		},
		showDefault: function(index) {
			return !this.showCorrect(index) && !this.showIncorrect(index);
		},
		showCorrect: function(index) {
			return $scope.model.showSolution && $scope.model.correct == index;
		},
		showIncorrect: function(index) {
			return $scope.model.showSolution && $scope.model.correct != index && $scope.model.selection == index;
		}
	};
	extend(Handler, ChoiceHandler);
	
	function ChoiceMultiHandler(topic, exercise) {
		Handler.call(this, topic, exercise);
	}
	ChoiceMultiHandler.prototype = {
		initialize: function() {
			var indexes = [];
			for (var i = 0 ; i < this.exercise.solution.length + this.exercise.alternatives.length ; i++) {
				indexes.push(i);
			}
			shuffle(indexes);
			
			$scope.model.elements = this.exercise.solution.concat(this.exercise.alternatives);
			$scope.model.indexes = indexes;
		},
		forward: function(index) {
			return $scope.model.indexes[index];
		},
		reverse: function(index) {
			return $scope.model.indexes.indexOf(Number(index)); 
		},
		isCorrect: function(index) {
			return this.reverse(index) < this.exercises.solutions.length;
		},
		select: function(selection) {
			$scope.model.selection = selection;
			this.check();
		},
		showDefault: function(index) {
			return !this.showCorrect(index) && !this.showIncorrect(index);
		},
		showCorrect: function(index) {
			return $scope.model.showSolution && this.isCorrect(index);
		},
		showIncorrect: function(index) {
			return $scope.model.showSolution && $scope.model.correct != index && $scope.model.selection == index;
		}
	};
	extend(Handler, ChoiceMultiHandler);
	
	function CompleteHandler(topic, exercise) {
		Handler.call(this, topic, exercise);
	}
	CompleteHandler.prototype = {
		isStrict: function() {
			return true;
		}
	};
	extend(Handler, CompleteHandler);
	
	function CompleteTextHandler(topic, exercise) {
		CompleteHandler.call(this, topic, exercise);
	}
	CompleteTextHandler.prototype = {
		isStrict: function() {
			return false;
		},
		getTemplateName: function() {
			return 'complete';
		}
	};
	extend(CompleteHandler, CompleteTextHandler);
	
	
	function ItemsHandler(topic, exercise) {
		Handler.call(this, topic, exercise);
	}
	ItemsHandler.prototype = {
		initialize: function() {
			$scope.model.values = [];
		},
		isIncluded: function(value, elements) {
			var that = this;
			return (elements||[]).some(function(element) {
				return that.isCorrect(value, element);
			});
		}
	};
	extend(Handler, ItemsHandler);

	
	$scope.exercises = [];
	$scope.handler = null;
	
	$scope.nextExercise = function() {
		$scope.model = {};
		$scope.handler = $scope.exercises[random($scope.exercises.length)];
		$scope.handler.initialize();
		$scope.$broadcast("plInitialize");
	}

	var exerciseHandlers = {
		text: Handler,
		phrase: Handler,
		phrases: Handler,
		choice: ChoiceHandler,
		choice_multi: ChoiceMultiHandler,
		complete: CompleteHandler,
		complete_text: CompleteTextHandler,
		items: ItemsHandler,
		draw: Handler,
	};
	
	
	$scope.dataPromise = $http.get('data/exam.json').success(function(data) {
		$scope.exam = data;
		
		$scope.exercises = [].concat.apply([], data.map(function(topic) {
			return topic.exercises.map(function(exercise) {
				var handler = exerciseHandlers[exercise.type]
				if (typeof handler === "undefined") {
				    alert("no such type: " + exercise.type);
				}
				return new handler(topic, exercise);
			});
		}));
		
		$scope.nextExercise();
		
		$state.go('practice');
	});

});