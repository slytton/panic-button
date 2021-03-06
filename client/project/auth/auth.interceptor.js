(function() {
  'use strict';

  angular.module('panic')
  .factory('AuthInterceptorService', factory)

    factory.$inject = ['$window', '$injector'];

    function factory($window, $injector) {
    return {
     'request': function(req) {
        var token = localStorage.getItem('token');
        if (token) req.headers.authentication = token;
        return req;
      },

      'responseError': function(response) {
        if(response.status === 401) {
          $window.localStorage.clear();
          $injector.get('$state').go('landing');
        }
        return response;
        }
      };
    }

}());
