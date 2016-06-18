'use strict';

/**
 * @ngdoc service
 * @name bookmarkerApp.Group
 * @description
 * # Group
 * Factory in the bookmarkerApp.
 */
angular.module('bookmarkerApp')
  .factory('Group', function () {

    var Group = function(newGroup){
      this.id    = newGroup.id;
      this.name  = newGroup.name;
      this.color = newGroup.color;
      this.sites = newGroup.sites; // newGroup.sites is already an array.
    };

    return Group;
  });
