(function() {
  'use strict';

    angular.module('panic')
      .directive('dashboard', dashboardDirective);

      function dashboardDirective (){
        return {
          restrict: "E",
          scope: {},
          templateUrl: "partials/dashboard.html",
          controller: dashboardController,
          controllerAs: "vm"
        }
      }

      dashboardController.$inject = [
        '$log',
        '$state',
        'dashboardService',
        'authService',
        '$window'
      ];

      function dashboardController($log, $state, dashboardService, authService, $window) {
        var vm = this;
        vm.info = {};
        vm.session = authService.session;
        vm.getInfo = getInfo;
        vm.addClass = addClass;
        vm.formClose = formClose;
        vm.addLecture = addLecture;
        vm.currentClass;
        vm.logout = logout;

        dashboardService.getClasses()
        .then(function (res){
          vm.teaching = res._teaching;
          vm.attending = res._attending;
          if(res._teaching.length > 0){
            for (var i = 0; i < res._teaching.length; i++) {
              if(+res._teaching[i].attributes.id === +$state.params.classId) {
                vm.currentClass = res._teaching[i];
                return getInfo(res._teaching[i]);
              }
            }
          }          
          if(res._teaching.length > 0){
            for (var i = 0; i < res._attending.length; i++) {
              if(+res._attending[i].attributes.id === +$state.params.classId) {
                vm.currentClass = res._attending[i];
                return getInfo(res._attending[i]);
              }
            }
          }
        })

        function getInfo (currentClass){
          vm.currentClass = currentClass;
          return dashboardService.getClassInfo(currentClass.links.summary)
          .then(function(res) {
            console.log(res);
            vm.links = res.links;
            vm.info = res.attributes;
            return
          })
        }

        function addClass (myForm){
          var newClass = angular.copy(vm.class)
          myForm.$setPristine();
          myForm.$setUntouched();
          vm.class = {};
          return dashboardService.addClass(newClass).then(function(res){
            //// TODO: waiting for api change to correct class format
          });
        }

        function addLecture (form) {
          var newLecture = angular.copy(vm.lecture);
          form.$setPristine();
          form.$setUntouched();
          vm.lecture = {};
          return dashboardService.addLecture(newLecture, vm.links.lectures.post);
        }

        function formClose (form) {
          form.$setPristine();
          form.$setUntouched();
          vm.class = {};
          vm.lecture = {};
          return
        }

        function logout () {
          $window.localStorage.clear();
          $state.go('landing');
          return
        }


      }
}());
