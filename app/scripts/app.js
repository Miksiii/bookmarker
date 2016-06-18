'use strict';

/**
 * @ngdoc overview
 * @name bookmarkerApp
 * @description
 * # bookmarkerApp
 *
 * Main module of the application.
 */
angular
  .module('bookmarkerApp', [
    'ngResource',
    'ngRoute',
    'checklist-model'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'main'
      })
      .when('/addNewGroup', {
        templateUrl: 'views/addnewgroup.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
