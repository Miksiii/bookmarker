'use strict';

/**
 * @ngdoc service
 * @name bookmarkerApp.Site
 * @description
 * # Site
 * Factory in the bookmarkerApp.
 */
angular.module('bookmarkerApp')
  .factory('Site', function () {

    var Site = function(newGroup){
      this.id     = newGroup.id;
      this.url    = newGroup.url;
      this.color  = newGroup.color;
      this.groups = newGroup.groups; // newGroup.groups is already an array.
    };

    return Site;
  });
