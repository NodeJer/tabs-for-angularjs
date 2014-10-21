/**
* tabs Module
*
* Description
*/
angular.module('tabs', []).

directive('tabs', function(){
	return {
		scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs, $transclude) {

			$scope.btns = [];
			$scope.contents = [];


			this.addBtn = function(){
				$scope.btns.push(arguments);
			}
			this.addContent = function(){
				$scope.contents.push(arguments);
			}
			this.selectBtn = function(currentBtn){
				var index = 0;

				angular.forEach($scope.btns, function(btn, i){
					if(btn[1] == currentBtn[1]){
						index = i;
					}
					btn[1].removeClass(btn[2].activeClass);
				});
				currentBtn[1].addClass(currentBtn[2].activeClass);

				this.selectContent($scope.contents[index]);
			}
			this.selectContent = function(currentContent){
				angular.forEach($scope.contents, function(content){
					content[1].removeClass(content[2].activeClass);
				});
				currentContent[1].addClass(currentContent[2].activeClass);
			}
		},
		restrict: 'AC', // E = Element, A = Attribute, C = Class, M = Comment
		link: function($scope, $element, $attrs, controller){
			controller.selectBtn($scope.btns[0]);
		}
	};
}).

directive('tabsBtn', function(){
	return {
		scope:{},
		require: '^tabs', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'AC', // E = Element, A = Attribute, C = Class, M = Comment
		link: function($scope, $element, $attrs, tabsCtrl) {
			var args = arguments;

			tabsCtrl.addBtn.apply(this, arguments);

			$element.on('click', function(){
				tabsCtrl.selectBtn(args);
			});
		}
	};
}).

directive('tabsContent', function(){
	return {
		scope:{},
		require: '^tabs', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'AC', // E = Element, A = Attribute, C = Class, M = Comment
		
		link: function($scope, $element, $attrs, tabsCtrl) {
			tabsCtrl.addContent.apply(this, arguments);
		}
	};
})