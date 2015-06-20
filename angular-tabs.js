angular.module('ng.tabs', []).

service('$tabs', ['', function(){
	
}]).

directive('tabs', function() {
    return {
        scope: {},
        controller: function($scope, $element) {
            var panes = $scope.panes = [];

            $scope.select = function(pane) {
                angular.forEach(panes, function(pane) {
                    pane.selected = false;
                });
                pane.selected = true;
            }

            this.getScope = function(){
            	return $scope;
            }
            this.addPane = function(pane) {
                if (panes.length == 0) $scope.select(pane);
                panes.push(pane);
            }
        },
        templateUrl: function($element, $attrs){

        	var templateUrl = $attrs.templateUrl;
        	
        	if(templateUrl && templateUrl != 'templateUrl'){
        		return templateUrl;
        	}
        	else{
        		alert('tabs directive templateUrl is null');
        	}
        },
        restrict: 'AE',
        transclude: true,
        replace: true
    };
}).

directive('tabsPane', ['$http', function($http) {
    return {
        require: '^tabs',
        restrict: 'AE',
        transclude: true,
        scope: {
            title: '@',
            ajax: '@'
        },
        link: function($scope, $element, $attrs, tabsController) {
            tabsController.addPane($scope);

            if(!$scope.ajax)return;

            $scope.$watch('selected', function(newValue, oldValue, scope) {
            	if(newValue === true){
            		$http.post($scope.ajax).success(function(data){
            			if(angular.isObject(data)){
            				
            			}
            			else{
            				$scope.ajaxData = data;
            			}
            		});
            	}
            });
        },
        template: function($element, $attrs){
        	var ajax = $attrs.ajax;

        	if(ajax && ajax != 'ajax'){
        		return '<div ng-class="{enter: selected}">{{ajaxData}}</div>';
        	}
        	else{
        		return '<div ng-class="{enter: selected}" ng-transclude></div>';
        	}
        },
        replace: true
    };
}]);
