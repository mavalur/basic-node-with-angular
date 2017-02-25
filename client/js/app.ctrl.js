/**
 * Created by Mavalur on 2/25/17.
 */

(function () {
    angular.module('sortable.test',[])
        .controller('appCtrl',['$scope', function($scope) {
            alert("controller init");
            $scope.sayHi = function(){
                alert("Hello Hari");
            }
        }]);
})();