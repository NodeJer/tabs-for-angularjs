angular
  .module("ng.tabs", [])
  //pr学习
  .directive("tabs", [
    "$compile",
    function ($compile) {
      return {
        scope: {},
        controller: function ($scope, $element) {
          var panes = [];
          var btns = [];
          var templateElement;

          this.selectPane = function (pane) {
            angular.forEach(panes, function (pane) {
              pane.selected = false;
            });
            pane.selected = true;
          };
          this.getScope = function () {
            return $scope;
          };
          this.addPane = function (pane) {
            if (panes.length == 0) this.selectPane(pane);
            panes.push(pane);
          };
          this.getPanes = function () {
            return panes;
          };
          this.setBtnTemplateElement = function (el) {
            templateElement = el;
          };
          this.getBtnTemplateElement = function () {
            return templateElement;
          };
        },
        link: function ($scope, $element, $attrs, controller) {
          var templateElement = controller.getBtnTemplateElement();
          var templateParent = templateElement.parent();
          var panes = controller.getPanes();

          templateElement.removeAttr("tabs-btn-template");

          var outerHTML = templateElement[0].outerHTML;

          outerHTML = outerHTML.replace(
            /active\-class="(\w+)"/,
            'ng-class="{$1: selected}"'
          );
          outerHTML = outerHTML.replace("ref", "ng-bind");

          for (var i = 0, len = panes.length; i < len; i++) {
            var pane = panes[i];
            var newTemplateElement = angular.element(outerHTML);

            templateParent.append(newTemplateElement);

            newTemplateElement.on(
              "click",
              (function (pane) {
                return function () {
                  $scope.$apply(function () {
                    controller.selectPane(pane);
                  });
                };
              })(pane)
            );

            $compile(newTemplateElement)(pane);
          }
          //删除模板
          templateElement.remove();
        },
        restrict: "AE",
      };
    },
  ])
  .directive("tabsBtnTemplate", [
    "$parse",
    function ($parse) {
      return {
        require: "^?tabs",
        scope: {},
        restrict: "AE",
        link: function ($scope, $element, iAttrs, tabsController) {
          if (!tabsController) return;

          tabsController.setBtnTemplateElement($element);
        },
      };
    },
  ])
  .directive("tabsPane", [
    "$http",
    function ($http) {
      return {
        require: "^?tabs",
        restrict: "AE",
        transclude: true,
        scope: {
          title: "@",
          ajax: "@",
        },
        link: function ($scope, $element, $attrs, tabsController) {
          if (!tabsController) return;

          tabsController.addPane($scope);

          $scope.$watch("selected", function (newValue, oldValue, scope) {
            if (newValue === true) {
              $element.addClass($attrs.activeClass);

              if (!$scope.ajax) return;

              if ($scope.ajaxData) return;

              $http.post($scope.ajax).success(function (data) {
                if (angular.isObject(data)) {
                } else {
                  $scope.ajaxData = data;
                }
              });
            } else {
              $element.removeClass($attrs.activeClass);
            }
          });
        },
        template: function ($element, $attrs) {
          var tagName = $element[0].tagName.toLowerCase();
          var ajax = $attrs.ajax;

          if (ajax && ajax != "ajax") {
            return "<" + tagName + ' ng-bind="ajaxData"></' + tagName + ">";
          }

          return "<" + tagName + " ng-transclude></" + tagName + ">";
        },
        replace: true,
      };
    },
  ]);
